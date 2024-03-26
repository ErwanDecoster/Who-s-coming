<script setup lang="ts">
interface Message {
  type: string;
  content: string;
}

let messages = ref<Array<Message>>([])

let form = ref({
	image: File,
	name: "",
	address: '',
	datetime: Date.now(),
	desc: '',
	rules: '',
})

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

const AddEvent = async () => {
	if (ValidForm()) {
		try {
			const data = await $fetch('/api/events/event', {
				method: 'post',
				body: {
					name: form.value.name,
					address: form.value.address,
					datetime: form.value.datetime,
					desc: form.value.desc,
					rules: form.value.rules,
				},
				
			}).then((data) => {
				if (data) {
					messages.value.push({
						type: 'success',
						content: "L'événement a été crée avec succès."
					})
					UploadImage(form.value.image, data[0].id_evenement, form.value.name)
				}
			})
		} catch(e) {
			console.log(e);
		}
	}
}

const UpdateImage = (event) => {
	form.value.image = event.target.files[0]
}

const UploadImage = async (files:File, eventId, name) => {
	try {
		const supabase = useSupabaseClient();
		const { data, error } = await supabase.storage
		.from('event_picture')
		.upload(`${eventId.toString()}`, files, {
			upsert: true,
		})
		if (error) throw error
		if (data) {
			navigateTo(`/events/${eventId}-${toSlug(name)}`);
		}
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
	}
}
</script>

<template>
	<div class="container">
		<form @submit.prevent="AddEvent()">
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
				<label for="image">Image :</label>
				<input 
					@change="UpdateImage($event)"
					type="file" 
					accept="image/*"
					name="image"
					id="image"
					required
				>
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
					placeholder="Anniversaire surprise Anna"
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
					placeholder="114 Av. des Champs-Élysées, 75008 Paris"
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
						placeholder="Thème haut en couleur : n'oubliez pas d'apporter votre maillot de bain. L'entrée se fait par le garage."
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
						placeholder="Le chat est malade. Merci de ne pas le toucher."
					/>
				</div>
			</div>
			<button type="submit" class="primary">
				Ajouter
			</button>
		</form>
		<NuxtLink to="/events" class="tertiary">Annuler</NuxtLink>
	</div>
</template>