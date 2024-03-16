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
		// console.log(response);
		// console.log(options);
		// console.log(data);
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
		<!-- <p v-if="events && !data.length">Aucun événement pour le moment.</p> -->
		<NuxtLink 
			v-for="event in data?.events" 
			:key="event.id_evenement" 
			:to="`/events/${event.id_evenement}-${toSlug(event.name)}`" 
			class="secondary"
		>
			{{ event.name }}
		</NuxtLink>
		<NuxtLink to="/events/new-event" class="primary">Nouvel événement</NuxtLink>
	</div>
</template>
