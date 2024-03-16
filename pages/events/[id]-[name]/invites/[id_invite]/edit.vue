<script setup lang="ts">
const route = useRoute()
const router = useRouter()

interface Message {
	type: string;
	content: string;
}
let form = ref({
	first_name: '',
	surname: 1,
	tel: 1,
})
let comfirmDelete = ref()

let messages = ref<Array<Message>>([])
let data: unknown
try {
	data = await $fetch(`/api/events/${route.params.id}/invites/${route.params.id_invite}`, {})
	form.value.first_name = data.invite.first_name;
	form.value.surname = data.invite.surname;
	form.value.tel = data.invite.tel;
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
					tel: form.value.tel,
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
			if (data) {
				messages.value.push({type: 'success', content: "L'invité a été supprimé."})
				router.go(-2)
			}
		} catch(e) {
			console.log(e);
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
					id="surname"
					min="1"
					required
				>
			</div>
			<div class="input-container">
				<label for="tel">Téléphone :</label>
				<input 
					type="tel" 
					name="tel" 
					v-model="form.tel" 
					id="tel"
					:min="form.tel"
					required
				>
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
				Supprimer le besoin
			</template>
		</button>
		<button @click="$router.back()" class="tertiary">Annuler</button>
	</div>
</template>