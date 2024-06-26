<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Modifier un besoin - Who's coming - Organisateur d'évènements";
const desc = "Modifiez un besoin sur Who's coming. Mettez à jour les détails tels que le label, les quantités minimale et maximale requises. Enregistrez vos modifications ou supprimez le besoin si nécessaire"
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

const router = useRouter()

let form = ref({
	label: '',
	min_required_number: 1,
	max_number: 1,
})
let comfirmDelete = ref()

let messages = ref<Array<Message>>([])
let need: need
try {
	need = await $fetch(`/api/events/${route.params.id}/needs/${route.params.id_need}`, {})
	form.value.label = need.label;
	form.value.min_required_number = need.min_required_number;
	form.value.max_number = need.max_number;
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'évènement : "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
}

const ValidForm = (() => {
  messages.value = [];
	if (!form.value.label)
		messages.value.push({type: 'error', content: 'Un libellé est requis.'})
  if (!form.value.min_required_number)
    messages.value.push({type: 'error', content: 'Un nombre minimun est requis.'})
	else if (form.value.min_required_number < 1)
		messages.value.push({type: 'error', content: 'Le minimun doit étre d\'au moin 1.'})
  if (!form.value.max_number)
    messages.value.push({type: 'error', content: 'Un nombre maximun est requis.'})
  else if (form.value.max_number < form.value.min_required_number)
    messages.value.push({type: 'error', content: 'Le maximun doit étre au moin égale au minimun.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const UpdateNeed = async () => {
	if (ValidForm()) {
		try {
			const need = await $fetch(`/api/events/${route.params.id}/needs/${route.params.id_need}`, {
				method: 'put',
				body: {
					label: form.value.label,
					min_required_number: form.value.min_required_number,
					max_number: form.value.max_number,
				},
			})
			if (need) {
				messages.value.push({type: 'success', content: "Le besoin a été mis a jour."})
				router.back()
			} else {
				throw Error
			}
		} catch(e) {
			console.log(e);
			messages.value.push({type: 'error', content: "Le besoin n'as pas pu étre mis a jour."})
		}
	}
}

const DeleteNeed = async () => {
	if (comfirmDelete.value === false) {
		comfirmDelete.value = true
	}
	if (comfirmDelete.value === true) {
		try {
			const data = await $fetch(`/api/events/${route.params.id}/needs/${route.params.id_need}`, {
				method: 'delete',
			})
			if (data == true) {
				messages.value.push({type: 'success', content: "Le besoin a été supprimé."})
				router.go(-2)
			} else {
				throw Error
			}
		} catch(e) {
			console.log(e);
		  comfirmDelete.value = null
			messages.value.push({type: 'error', content: "Le besoin n'as pas pu étre supprimé."})
		}
	} else {
		comfirmDelete.value = false
	}
}

watch(() => form.value.min_required_number, (newVal) => {
	if (newVal > form.value.max_number) {
		form.value.max_number = newVal
	}
})

</script>

<template>
	<div class="container">
		<h3>Modifier le besoin</h3>
		<form @submit.prevent="UpdateNeed()">
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
				<label for="label">Label :</label>
				<input 
					type="text" 
					name="label" 
					v-model="form.label" 
					id="label"
					required
					autofocus
					placeholder="Bouée gonflable"
				>
			</div>
			<div class="input-container">
				<label for="min_required_number">Minimun requis :</label>
				<input 
					type="number" 
					name="min_required_number" 
					v-model="form.min_required_number" 
					id="min_required_number"
					min="1"
					pattern="[0-9]*"
					inputmode="numeric"
					required
				>
			</div>
			<div class="input-container">
				<label for="max_number">Maximun :</label>
				<input 
					type="number" 
					name="max_number" 
					v-model="form.max_number" 
					id="max_number"
					:min="form.min_required_number"
					pattern="[0-9]*"
					inputmode="numeric"
					required
				>
			</div>
			<button type="submit" class="primary">
				Enregistrer
			</button>
		</form>
		<button @click="DeleteNeed()" class="delete">
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