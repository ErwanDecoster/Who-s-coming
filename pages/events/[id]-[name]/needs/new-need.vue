<script setup lang="ts">
interface Message {
	type: string;
  content: string;
}

const route = useRoute()
let messages = ref<Array<Message>>([])

let form = ref({
	label: '',
	min_required_number: 1,
	max_number: 1,
})

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

const AddNeed = async () => {
	if (ValidForm()) {	
		try {
			const data = await $fetch(`/api/events/${route.params.id}/needs`, {
				method: 'post',
				body: {
					label: form.value.label,
					min_required_number: form.value.min_required_number,
					max_number: form.value.max_number,
				},
			}).then((data) => {
				if (data[0]) {
					messages.value.push({
						type: 'success',
						content: "Le besoin a été ajouté avec succès."
					})
					navigateTo(`/events/${route.params.id}-${toSlug(route.params.name)}`);
				}
			})
		} catch(e) {
			messages.value.push({
				type: 'error',
				content: "Le besoin n'as pas pu étre ajouté."
			})
			console.log(e);
		}
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
		<h3>Ajouter un besoin</h3>
		<form @submit.prevent="AddNeed()">
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
					autocomplete="off"
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
				Ajouter
			</button>
		</form>
		<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}`" class="tertiary">Annuler</NuxtLink>
	</div>
</template>
