<script setup lang="ts">
const route = useRoute()
const router = useRouter()

let form = ref({
	first_name: '',
	surname: '',
	tel: '',
	countryCode: '',
})
let comfirmDelete = ref()

let messages = ref<Array<Message>>([])
let data: {
	invite: invite;
}
try {
	data = await $fetch(`/api/events/${route.params.id}/invites/${route.params.id_invite}`, {})
	form.value.first_name = data.invite.first_name;
	form.value.surname = data.invite.surname;
	form.value.tel = formatPhoneNumberForDisplay(data.invite.tel).tel;
	form.value.countryCode = formatPhoneNumberForDisplay(data.invite.tel).cc;
	
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'évènement : "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
}

const ValidForm = (() => {
  messages.value = [];
	if (!form.value.first_name)
		messages.value.push({type: 'error', content: 'Un Prénom est requis.'})
  if (!form.value.surname)
    messages.value.push({type: 'error', content: 'Un Nom est requis.'})
  if (!form.value.tel)
    messages.value.push({type: 'error', content: 'Un numéro de téléphone valide est requis.'})
	else if (form.value.countryCode === '33' && formatPhoneNumberForDatabase(form.value.tel, form.value.countryCode).length != 12)
		messages.value.push({type: 'error', content: 'Un numéro de téléphone valide est requis, par exemple : 06 39 98 68 13 ou 6 39 98 68 13.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const UpdateInvite = async () => {
	if (ValidForm()) {
		try {
			const data = await $fetch(`/api/events/${route.params.id}/invites/${route.params.id_invite}`, {
				method: 'put',
				body: {
					first_name: form.value.first_name,
					surname: form.value.surname,
					tel: formatPhoneNumberForDatabase(form.value.tel, form.value.countryCode),
				},
			})
			if (data) {
				messages.value.push({type: 'success', content: "L'invité a été mis a jour."})
				router.back()
			}
		} catch(e) {
			console.log(e);
			messages.value.push({type: 'error', content: "L'invité n'as pas pu étre mis a jour."})
		}
	}
}

const DeleteInvite = async () => {
	if (comfirmDelete.value === false) {
		comfirmDelete.value = true
	}
	if (comfirmDelete.value === true) {
		try {
			const data = await $fetch(`/api/events/${route.params.id}/invites/${route.params.id_invite}`, {
				method: 'delete',
			})
			if (data == true) {
				messages.value.push({type: 'success', content: "L'invité a été supprimé."})
				router.go(-2)
			} else {
				throw Error
			}
		} catch(e) {
			console.log(e);
		  comfirmDelete.value = null
			messages.value.push({type: 'error', content: "L'invité n'as pas pu étre supprimé."})
		}
	} else {
		comfirmDelete.value = false
	}
}

</script>

<template>
	<div class="container">
		<h3>Modifier un invité</h3>
		<form @submit.prevent="UpdateInvite()">
			<ul v-if="messages.length">
				<li 
					v-for="message in messages" 
					:key="message.type"
					class="bg-black rounded-lg py-1 px-4 text-white bg-opacity-85"
					:class="[
						{ 'bg-red': message.type === 'error'},
						{ 'bg-green': message.type === 'success'}
					]"
				>
					{{ message.content }}
				</li>
			</ul>
			<div class="input-container">
				<label for="first_name">Prénom :</label>
				<input 
					type="text" 
					name="first_name" 
					v-model="form.first_name" 
					placeholder="Jean"
					id="first_name"
					required
				>
			</div>
			<div class="input-container">
				<label for="surname">Nom :</label>
				<input 
					type="text" 
					name="surname" 
					v-model="form.surname" 
					placeholder="Dupont"
					id="surname"
					min="1"
					required
				>
			</div>
			<div class="input-container">
				<label for="tel">Téléphone :</label>
				<div class="flex gap-1 relative">
					<select 
						autocomplete="tel-country-code" 
						name="comptry-code" 
						v-model="form.countryCode"
						id=""
					>
						<option value="33">FR (+33)</option>
						<option value="44">GB (+44)</option>
						<option value="49">DE (+49)</option>
						<option value="39">IT (+39)</option>
						<option value="34">ES (+34)</option>
						<option value="7">RU (+7)</option>
						<option value="30">GR (+30)</option>
						<option value="41">CH (+41)</option>
						<option value="31">NL (+31)</option>
						<option value="46">SE (+46)</option>
						<option value=""></option>
					</select>
					<input 
						type="tel" 
						name="tel" 
						v-model="form.tel" 
						placeholder="06 39 98 68 13"
						id="tel"
						autocomplete="tel-national"
						class="flex-1"
						required
					>
				</div>
			</div>
			<button type="submit" class="primary">
				Enregistrer
			</button>
		</form>
		<button @click="DeleteInvite()" class="delete">
			<template v-if="comfirmDelete === false">
				Comfirmer la suppresion
			</template>
			<template v-else>
				Supprimer l'invité
			</template>
		</button>
		<button @click="$router.back()" class="tertiary">Annuler</button>
	</div>
</template>