<template>
	<div class="relative">
		<h2>Votre événement</h2>
		<button class="absolute top-3 right-3 btn-secondary">...</button>
		<div>
			<div>
				evenement short block
			</div>
			<NuxtLink to="Events/NewEvent" class="btn-secondary">Voir la liste des invité</NuxtLink>
			<div class="grid gap-2">
				<h3 for="email">Description :</h3>
				<p>{{ event.desc }}</p>
			</div>
			<div class="grid gap-2">
				<h3 for="email">Règlement :</h3>
				<p>{{ event.rules }}</p>
			</div>
			<div class="grid gap-2">
				<h3 for="email">Nécessaire a la soirée :</h3>
				<p v-for="need in event.needs" :key="need">{{ need.label }} ({{ need.number }} manquants)</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
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