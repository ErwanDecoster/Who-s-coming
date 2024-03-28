<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Modifier mon événement - Who's coming - Organisateur d'évènements";
const desc = "Modifiez les détails de votre événement sur Who's coming. Mettez à jour les informations de l'événement selon vos besoins."
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
	image: File,
	name: "",
	address: '',
	datetime: '',
	desc: '',
	rules: '',
	invite_message: '',
})
let comfirmDelete = ref()
const isImageAccessible = ref<boolean>(false)
let messages = ref<Array<Message>>([])
let data: {
	event: event;
	publicUrl: string;
}
try {
	data = await $fetch(`/api/events/${route.params.id}`, {})
	form.value.address = data.event.address;
	form.value.datetime = new Date(data.event.datetime).toISOString().slice(0, 16)
	form.value.desc = data.event.desc;
	form.value.name = data.event.name;
	form.value.rules = data.event.rules;
	form.value.invite_message = data.event.invite_message;
	const imageExists = await fetch(data.publicUrl)
  isImageAccessible.value = imageExists.ok
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'évènement : "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
}

const checkInviteMessage = () => {
	if (!form.value.invite_message.includes("{first_name}") && !form.value.invite_message.includes("{surname}"))
		messages.value.push({type: 'error', content: "Le message d'invitation doit contenir : {first_name} ou {surname}"})
	if (!form.value.invite_message.includes("{code}"))
		messages.value.push({type: 'error', content: "Le message d'invitation doit contenir : {code}"})
	if (!form.value.invite_message.includes("{inviteUrl}"))
		messages.value.push({type: 'error', content: "Le message d'invitation doit contenir : {inviteUrl}"})
}

const ValidForm = (() => {
  messages.value = [];
	checkInviteMessage()
	if (!form.value.address)
		messages.value.push({type: 'error', content: 'Une adresse est requise."'})
  if (!form.value.datetime)
    messages.value.push({type: 'error', content: 'La date et l\'heure sont requise.'})
  if (!form.value.name)
		messages.value.push({type: 'error', content: 'Un nom est requis.'})
  if (!form.value.desc)
    messages.value.push({type: 'error', content: 'Une description est requise.'})
  if (!form.value.name)
    messages.value.push({type: 'error', content: 'Un titre est requis.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const UpdateEvent = async () => {
	if (ValidForm()) {
		try {
			const [eventResponse, pictureResponse] = await Promise.all([
				$fetch(`/api/events/${route.params.id}`, {
					method: 'put',
					body: {
						name: form.value.name,
						address: form.value.address,
						datetime: form.value.datetime,
						desc: form.value.desc,
						rules: form.value.rules,
						invite_message: form.value.invite_message,
					},
				}),
				UploadImage(form.value.image, route.params.id, form.value.name)
			])
			if (eventResponse) {
				addRefreshData(`event-${data.event.id_evenement}`)
				
				messages.value.push({type: 'success', content: "L'évènement a été mis a jour."})
			}
			if (pictureResponse && pictureResponse != "done") {
				messages.value.push({type: 'success', content: "L'image a été mis a jour."})
			}
			if (eventResponse && pictureResponse) {
				navigateTo(`/events/${route.params.id}-${toSlug(route.params.name.toString())}`);
			}
		} catch(e) {
			console.log(e);
		}
	}
}

const UpdateImage = (event) => {
	form.value.image = event.target.files[0]
}

const UploadImage = async (files:File, eventId: number, name: string) => {
	if (files) {
		try {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase.storage
				.from('event_picture')
				.upload(`${eventId.toString()}`, files, {
					upsert: true,
				})
			if (error) throw error
			return data;
		} catch(e) {
			messages.value.push({
				type: 'error',
				content: `L'image n'as pas pu etre ajouté.`
			})
			messages.value.push({
				type: 'error',
				content: `statusCode ${e.statusCode}, error : ${e.error}, message: ${e.message}`
			})
			return false;
		}
	}
	return "done"
}

const DeleteEvent = async () => {
	if (comfirmDelete.value === false) {
		comfirmDelete.value = true
	}
	if (comfirmDelete.value === true) {
		try {
			const data = await $fetch(`/api/events/${route.params.id}`, {
				method: 'delete',
			})
			if (data == true) {
				messages.value.push({type: 'success', content: "L'événement a été supprimé."})
				router.push("/events")
			} else {
				throw Error
			}
		} catch(e) {
			console.log(e);
		  comfirmDelete.value = null
			messages.value.push({type: 'error', content: "L'événement n'as pas pu étre supprimé."})
		}
	} else {
		comfirmDelete.value = false
	}
}

</script>

<template>
	<div class="container">
		<h3>Modifier {{ data.event.name }}</h3>
		<form @submit.prevent="UpdateEvent()">
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
				<label class="image-label" for="image">
					Image :
					<div class="input-style">
						<img v-if="data.publicUrl && isImageAccessible" :src="data.publicUrl" alt="">
						<input 
							@change="UpdateImage($event)"
							type="file" 
							accept="image/*"
							name="image"
							id="image"
							class="img"
							:data-image="data.publicUrl"
						>
					</div>
				</label>
			</div>
			<div class="input-container">
				<label for="name">Titre :</label>
				<input 
					type="text" 
					name="name" 
					v-model="form.name" 
					id="name"
					required
					autocomplete="off"
				>
			</div>
			<div class="input-container">
				<label for="address">Adresse postale :</label>
				<input 
					type="text" 
					name="address" 
					v-model="form.address" 
					id="address"
					required
				>
			</div>
			<div class="input-container">
				<label for="datetime">Date et heure :</label>
				<input 
					type="datetime-local" 
					name="datetime" 
					v-model="form.datetime" 
					id="datetime"
					required
					autocomplete="off"
				>
			</div>
			<div class="input-container">
				<label for="desc">Description :</label>
				<div class="grow-wrap" :data-replicated-value="form.desc">
					<textarea 
						name="desc" 
						v-model="form.desc" 
						id="desc"
						required
					/>
				</div>
			</div>
			<div class="input-container">
				<label for="rules">Règlement :</label>
				<div class="grow-wrap" :data-replicated-value="form.rules">
					<textarea 
						name="rules" 
						v-model="form.rules" 
						id="rules"
					/>
				</div>
			</div>
			<div class="input-container">
				<label for="invite_message">Message d'invitation :</label>
				<div class="info text-black-300 text-sm pb-2">
					<p class="text-base">Variable utilisable :</p>
					<ul class="list-disc list-inside">
						<li>Prénom : {first_name}</li>
						<li>Nom : {surname}</li>
						<li>Nom de l'événement : {eventName}</li>
						<li>Code d'invitation : {code}</li>
						<li>Lien de l'invitation : {inviteUrl}</li>
					</ul>
				</div>
				<div class="grow-wrap" :data-replicated-value="form.invite_message">
					<textarea 
						name="invite_message" 
						v-model="form.invite_message" 
						id="invite_message"
					/>
				</div>
			</div>
			<div class="grid gap-1">
				<p>Besoins : </p>
				<div class="grid gap-1" v-if="data.event.needs.length">
					<NuxtLink 
						v-for="(need, index) in data.event.needs" 
						:key="need.id_need"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}/needs/${need.id_need}/edit`" 
						:class="[
							{ 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.event.needs.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300">{{ need.label }}</p>
						<p class="text-base text-black-300"> / {{ need.min_required_number }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun besoin ajouté.</p>
			</div>
			<button type="submit" class="primary">
				Enregistrer
			</button>
		</form>
		<button @click="DeleteEvent()" class="delete">
			<template v-if="comfirmDelete === false">
				Comfirmer la suppresion
			</template>
			<template v-else>
				Supprimer l'évènement
			</template>
		</button>
		<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}`" class="tertiary">Annuler</NuxtLink>
	</div>
</template>