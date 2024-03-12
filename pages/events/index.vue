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
		SetStateOccurence(events) {
			events.forEach(event => {
				event.inviteState = {};
				event.inviteState.unsend = 0;
				event.inviteState.send = 0;
				event.inviteState.accepted = 0;
				event.inviteState.denied = 0;
				event.inviteState.asked = 0;
				event.invitations.forEach(invitation => {
					if (invitation.id_state == 1)
						event.inviteState.unsend++;
					if (invitation.id_state == 2)
						event.inviteState.send++;
					if (invitation.id_state == 3)
						event.inviteState.accepted++;
					if (invitation.id_state == 4)
						event.inviteState.denied++;
					if (invitation.id_state == 5)
						event.inviteState.asked++;
				});
			});
		},
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
				.select('id_evenement, name, address, invitations ( id_evenement, id_state )')
				.eq('user_id', this.user.id)
				if (error) throw error
				this.SetStateOccurence(evenements);
				this.events = evenements;
			} catch (error) {
			} finally {
			}
		},
	},
	mounted() {
		this.GetUser()
	},
	created() {
		const metadata = {
			desc: "Gérez vos événements créés en de nouveau et visualiser le nombre d'invités",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Événements - Who's coming",
			imageDirectory: "cover.png"
		}
    	useHead({
			title: metadata.pageName,
			htmlAttrs: {
				lang: 'fr'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow'},
				{ name: 'theme-color', content: '#014979'},
				{ hid: 'description', name: 'description', content: metadata.desc },
				{ property: 'og:url', content: metadata.url + this.$route.path },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:title', content: metadata.desc },
				{ property: 'og:description', content: metadata.desc },
				{ property: 'og:image', content: metadata.url + metadata.imageDirectory },
				{ property: 'twitter:card', content: 'summary_large_image' },
				{ property: 'twitter:title', content: metadata.pageName },
				{ property: 'twitter:description', content: metadata.desc },
				{ property: 'twitter:image', content: metadata.url + metadata.imageDirectory },
			],
			link: [
				{
					hid: 'canonical',
					rel: 'canonical',
					href: metadata.url + this.$route.path,
				},
			],
		})
	}
}
</script> -->
