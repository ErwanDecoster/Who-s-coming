<template>
	<div class="grid gap-6">
		<h2>Rejoindre un événement</h2>
		<form class="grid gap-4" @submit.prevent="RedirectToInvite()" action="">
			<div v-if="formMessages" class="grid gap-1">
				<p v-for="message in formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="formMessages.splice(formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<div class="grid gap-2">
				<label for="invitations_code">Code d'invitation :</label>
				<input class="uppercase" maxlength="6" v-model="form.code" type="text" name="invitations_code" id="invitations_code">
			</div>
			<input class="btn-primary" type="submit" value="Rejoindre">
		</form>
		<NuxtLink class="btn-secondary" to="/register">Créer un événement</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return {
			formMessages: [],
			form: {
				code: '',
			},
		};
	},
	methods: {
		CheckForm() {
			this.formMessages = [];
			if (!this.form.code)
				this.formMessages.push({type: 'error', content: 'Le champ "Code d\'invitation" est requis'})
			else if (this.form.code.length != 6)
				this.formMessages.push({type: 'error', content: 'Le champ "Code d\'invitation" doit etre de 6 caracteres'})
			if (this.formMessages.length == 0)
				return (0)
			return (1)
		},
		async GetInvite() {
			try {
				this.formMessages = [];
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('invitations')
				.select('id_evenement')
				.eq('code', this.form.code.toLowerCase())
				if (error) throw error
				if (data.length)
       				navigateTo(`/events/${data[0].id_evenement}/invites/${this.form.code}`);
				else 
					this.formMessages.push({ type: 'error', content: 'Le code n\'est pas valide.' })
			} catch (error) {
				this.formMessages.push({ type: 'error', content: 'Une erreur est survenue.' })
			} finally {
			}
		},
		RedirectToInvite() {
			if (this.CheckForm())
				return (1)
			this.GetInvite()
		},
	},
	mounted() {
		const user = useSupabaseUser()
		watchEffect(() => {
		if (user.value)
			navigateTo('/events');
		})
  	},
}
</script>