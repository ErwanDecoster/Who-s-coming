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
		<NuxtLink to="/events/newEvent" class="primary">Nouvel événement</NuxtLink>
	</div>
</template>

<!-- <script>
export default {
	data() {
		return {
			user: '',
			messages: [],
			events: [],
		}
	},
	methods: {
		async GetUser() {
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
			this.GetEvents()
		},
		async GetEvents() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('evenements')
				.select("*")
				.eq('user_id', this.user.id)
				if (error) throw error
				this.events = evenements;
				// this.formMessages.push({ type: 'succes', content: 'L\'événement a bien été créé.' })
			} catch (error) {
				// this.formMessages.push({ type: 'error', content: 'Une erreur est survenue l\'événement ne pas été créé.' })
			} finally {
			}
		},
	},
	mounted() {
		this.GetUser()
		const user = useSupabaseUser();
		watchEffect(() => {
		if (!user.value)
			navigateTo('/');
		})
	},
}
</script> -->
