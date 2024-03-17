<script setup lang="ts">
const route = useRoute()
let form = ref({
	image: File,
	name: "",
	address: '',
	datetime: '',
	desc: '',
	rules: '',
})
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
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'évènement : "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
}

const ValidForm = (() => {
  messages.value = [];
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
					},
				}),
				UploadImage(form.value.image, route.params.id, form.value.name)
			])
			
			if (eventResponse) {
				messages.value.push({type: 'success', content: "L'évènement a été mis a jour."})
			}
			if (pictureResponse && pictureResponse != "done") {
				messages.value.push({type: 'success', content: "L'image a été mis a jour."})
			}
			if (eventResponse && pictureResponse) {
				navigateTo(`/events/${route.params.id}-${toSlug(route.params.name)}`);
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
				.upload(`${eventId.toString()}`, files)
			if (error) throw error
			return data;
		} catch(e) {
			messages.value.push({
				type: 'error',
				content: `L'image n'as pas pu etre ajouté.`
			})
			messages.value.push({
				type: 'error',
				content: `statusCode ${e.statusCode}, error : ${e.error}, message: ${message}`
			})
			console.log(e);
			return e;
		}
	}
	return "done"
}


</script>

<template>
	<div class="container">
		<form @submit.prevent="UpdateEvent()">
			<ul>
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
						<img v-if="data.publicUrl" :src="data.publicUrl" alt="">
						<input 
							@change="UpdateImage($event)"
							type="file" 
							accept="image/png, image/jpeg, image/webp"
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
			<div class="grid gap-1">
				<p>Besoins : </p>
				<div class="grid gap-1" v-if="data.event.needs.length">
					<NuxtLink 
						v-for="(need, index) in data.event.needs" 
						:key="need.id_need"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/${need.id_need}/edit`" 
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
		<button class="delete">Supprimer l'évènement</button>
		<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}`" class="tertiary">Annuler</NuxtLink>
	</div>
</template>