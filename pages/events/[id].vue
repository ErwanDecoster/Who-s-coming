<template>
	<div class="relative grid gap-6">
		<h2>Votre événement</h2>
		<button class="absolute top-0 right-0 btn-secondary w-fit" @click="more = !more">•••</button>
		<div v-if="more" class="absolute right-0 top-10 z-10 bg-app rounded-xl">
			<button class="btn-secondary rounded-b-none">Modifier l'événement</button>
			<button class="btn-secondary-red rounded-t-none">Supprimer l'événement</button>
		</div>
		<div class="grid gap-4">
			<div class="bg-white block relative text-black rounded-xl p-2">
				<div class="text-sm grid gap-1">
					<p class="text-base">{{ event.name }} - <span class="underline">{{ event.address }}</span></p>
					<p class="text-opacity-70">{{ event.invites }} - {{ event.invitesConfirmed }}</p>
				</div>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}/invites`" class="btn-secondary relative">
				Voir la liste des invités
				<!-- <span v-if="event.nbInvitePending.length > 0" class="bg-orange w-[14px] h-[14px] absolute -top-1 -right-1 rounded-full">
					{{ event.nbInvitePending }}
				</span> -->
			</NuxtLink>
			<div class="grid gap-2">
				<h3 class="text-sm">Description :</h3>
				<p class="text-xs">{{ event.desc }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="text-sm">Règlement :</h3>
				<p class="text-xs">{{ event.rules }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="text-sm">Nécessaire a la soirée :</h3>
				<p class="text-xs" v-for="need in event.needs" :key="need">{{ need.label }} ({{ need.number }} manquants)</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			more: false,
			user: '',
			event: [],
		}
	},
	methods: {
		async GetUser() {
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
			this.GetEvent()
		},
		async GetNeeds() {
			try {
				const supabase = useSupabaseClient();
				let { data: needs, error } = await supabase
				.from('needs')
				.select("*")
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.event.needs = needs;
			} catch (error) {
			} finally {
			}
		},
		async GetEvent() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('evenements')
				.select("*")
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.event = evenements[0];
				this.GetNeeds()
			} catch (error) {
			} finally {
			}
		},
	},
	mounted() {
		this.GetUser()
	},
}
</script>