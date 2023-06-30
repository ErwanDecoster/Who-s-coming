<template>
	<div class="relative grid gap-6">
		<h2>Événements</h2>
		<!-- <button class="absolute top-0 right-0 btn-secondary w-fit">•••</button> -->
		<div class="grid gap-2">
			<h3>Liste de vos événements :</h3>
			<div class="grid gap-2">
				<p v-if="events.length == 0" class="text-sm">Vous n'avez encore aucun evenement.</p>
				<NuxtLink v-for="event in events" :key="event.id" :to="`events/${event.id_evenement}/`" class="bg-white block relative text-black rounded-xl p-2">
					<div class="text-sm grid gap-1">
						<p class="text-base">{{ event.name }} - <span class="underline">{{ event.address }}</span></p>
						<p class="text-opacity-70">{{ event.invites }} - {{ event.invitesConfirmed }}</p>
					</div>
					<!-- <span class="bg-orange w-[14px] h-[14px] absolute -top-1 -right-1 rounded-full">
						{{ event.nbInvitePending }}
					</span> -->
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
</script>
