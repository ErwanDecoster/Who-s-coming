<template>
	<div class="grid gap-6">
		<h2>Liste des invités</h2>
		<button class="absolute top-0 right-0 btn-secondary w-fit" @click="more = !more">•••</button>
		<div v-if="more" class="absolute right-0 top-10 z-10 bg-app">
			<button class="btn-secondary">Sélectionner des invités</button>
			<button class="btn-secondary">Demandes d'invités</button>
			<button class="btn-secondary">Modifier la liste</button>
			<button class="btn-secondary">Invités supprimé</button>
		</div>
		<div class="grid gap-2" action="">
			<!-- <NuxtLink v-for="invite in invites" class="btn-secondary">
				{{ invite.fist_name }} {{ invite.surname }} ({{ invite.state }})
			</NuxtLink> -->
		</div>
		<NuxtLink class="btn-secondary" to="Register">Retour</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return {
			invite: '',
			more: false,
			user: 0,
		}
	},
	methods: {
		async GetEvents() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('invitations')
				.select("*")
				.eq('id_evenement', this.user.id)
				if (error) throw error
				this.events = evenements;
			} catch (error) {
			} finally {
			}
		},
		async GetUser(){
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
		},
	},
	mounted() {
		const user = useSupabaseUser();
		this.GetUser();
		watchEffect(() => {
			if (!user.value)
				navigateTo('/');
		})
	},
}
</script>