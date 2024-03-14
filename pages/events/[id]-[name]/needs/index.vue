<script setup lang="ts">
// let events = ref()
// const fetchEvents = async () => {
//   const data = await $fetch('/api/events')
// 	events.value = data.events
// }
const { data, pending, error, refresh } = useFetch('/api/events', {
	onRequestError({ request, options, error }) {
		console.log(request);
		console.log(options);
		console.log(error);
		// Handle the request errors
	},
	onResponse({ request, response, options }) {
		console.log(request);
		console.log(response);
		console.log(options);
		console.log(data);
		// events.value = data
	},
	onResponseError({ request, response, options }) {
		console.log(request);
		console.log(response);
		console.log(options);
		// Handle the response errors
	}
})

interface Message {
  type: string;
  content: string;
}

let messages = ref<Array<Message>>([])
</script>

<template>
	<div class="container">
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
		<img src="" alt="">
		<NuxtLink :to="`/events/${toSlug($route.params.id)}/invites`" class="secondary">Liste des invités</NuxtLink>
		<div class="grid gap-1">
			<p>Adresse postale :</p>
			<p v-if="event.address">{{ event.address }}</p>
			<p v-else>Aucune adresse configuré.</p>
		</div>
		<div class="grid gap-1">
			<p>Description :</p>
			<p v-if="event.desc">{{ event.desc }}</p>
			<p v-else>Aucune description configuré.</p>
		</div>
		<div class="grid gap-1">
			<p>Règlement :</p>
			<p v-if="event.rules">{{ event.rules }}</p>
			<p v-else>Aucune règlement configuré.</p>
		</div>
		<div class="grid gap-1">
			<p>Besoins : </p>
			<div v-if="event.needs">
				<NuxtLink :to="`/events/${toSlug($route.params.id)}/needs/${toSlug(need.id_need)}`" v-for="need in needs" :key="need.id_need">
					<p>{{ need.label }}</p>
					<p> / {{ need.min_required_number }}</p>
				</NuxtLink>
			</div>
			<p v-else>Aucun besoin ajouté.</p>
			<NuxtLink :to="`/events/${toSlug($route.params.id)}/needs/newNeed`" class="secondary">Liste des invités</NuxtLink>
		</div>
		<NuxtLink :to="`/events/${toSlug($route.params.id)}/edit`" class="primary">Nouvel événement</NuxtLink>
	</div>
</template>