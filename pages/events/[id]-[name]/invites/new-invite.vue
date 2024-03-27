<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Ajouter un invité - Who's coming - Organisateur d'évènements";
const desc = "Ajoutez un nouvel invité sur Who's coming. Entrez les détails de l'invité, tels que le prénom, le nom et le numéro de téléphone."
const img = runtimeConfig.public.siteUrl + "/images/minia.png"
const url = runtimeConfig.public.siteUrl + route.path
useHead({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: url,
    },
  ],
})
useSeoMeta({
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogUrl: url,
  ogType: 'article',
  ogImage: img,
  twitterCard: 'summary_large_image',
  twitterSite: '@erwan_decoster',
  twitterCreator: '@erwan_decoster',
  twitterTitle: title,
  twitterDescription: desc,
  twitterImage: img,
})

interface Message {
	type: string;
  content: string;
}

let messages = ref<Array<Message>>([])

let form = ref({
	first_name: '',
	surname: '',
	countryCode: '33',
	tel: '',
})

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

const AddInvite = async () => {
	if (ValidForm()) {	
		try {
			const data = await $fetch(`/api/events/${route.params.id}/invites`, {
				method: 'post',
				body: {
					first_name: form.value.first_name,
					surname: form.value.surname,
					tel: formatPhoneNumberForDatabase(form.value.tel, form.value.countryCode) ,
				},
			}).then((data) => {
				if (data != true) throw new Error
				messages.value.push({
					type: 'success',
					content: "L'invité a été ajouté avec succès."
				})
				navigateTo(`/events/${route.params.id}-${toSlug(route.params.name)}/invites`);
			})
		} catch(e) {
			messages.value.push({
				type: 'error',
				content: "L'invité n'as pas pu étre ajouté."
			})
			console.log(e);
		}
	}
}
</script>

<template>
	<div class="container">
		<h3>Ajouter un invité</h3>
		<form @submit.prevent="AddInvite()">
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
					autofocus
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
						<option value="">Autre</option>
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
				Ajouter
			</button>
		</form>
		<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites`" class="tertiary">Annuler</NuxtLink>
	</div>
</template>
