<template>
	<div class="relative grid gap-6">
		<h2>Événements</h2>
		<!-- <button class="absolute top-0 right-0 btn-secondary w-fit">•••</button> -->
		<div class="grid gap-2">
			<h3>Liste de vos événements :</h3>
			<div class="grid gap-2">
				<p v-if="events.length == 0" class="text-sm">Vous n'avez encore aucun evenement.</p>
				<NuxtLink v-for="event in events" :key="event.id_evenement" :to="`events/${event.id_evenement}/`" class="bg-white block relative text-black rounded-xl p-2">
					<div class="text-sm grid gap-1">
						<p class="text-base font-bold">{{ event.name }}</p>
						<a :href="`http://maps.google.com/?q=${event.address}`" class="underline">{{ event.address }}</a>
						<p class="text-opacity-70 flex gap-1">
							<span v-if="!event.invitations.length">Aucune personne invité</span>
							<span v-if="event.inviteState.unsend">{{ event.inviteState.unsend }} non invité</span>
							<span v-if="event.inviteState.send">{{ event.inviteState.send }} invités</span>  
							<span v-if="event.inviteState.accepted">{{ event.inviteState.accepted }} comfirmés</span>
							<span v-if="event.inviteState.denied">{{ event.inviteState.denied }} refusés</span>
							<span v-if="event.inviteState.asked">{{ event.inviteState.asked }} demandes</span>
						</p>
					</div>
					<span v-if="event.inviteState.asked" class="bg-orange w-[16px] h-[16px] absolute -top-1 -right-1 rounded-full text-sm justify-center flex items-center">
						{{ event.inviteState.asked }}
					</span>
				</NuxtLink>
			</div>
		</div>
		<NuxtLink class="btn-primary" to="Events/NewEvent">Créer un nouvelle événement</NuxtLink>
	</div>
</template>

<script>
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
	created() {
		const metadata = {
			desc: "Gérez vos événements créés en de nouveau et visualiser le nombre d'invités",
			url: "http://localhost:3000/",
			// url: "https://who-s-coming.vercel.app/",
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
</script>
