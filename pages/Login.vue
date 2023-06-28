<template>
	<div class="grid gap-6">
		<h2>Se connecter</h2>
		<form @submit.prevent="SignUp()" class="grid gap-4" action="">
			<div class="grid gap-2">
				<label for="email">E-mail :</label>
				<input v-model="form.email" type="email" name="email" id="email">
			</div>
			<div class="grid gap-2">
				<label for="password">Mot de passe :</label>
				<input v-model="form.password" type="text" name="password" id="password">
			</div>
			<input class="btn-primary" type="submit" value="Connection">
		</form>
		<NuxtLink class="btn-secondary" to="Register">S'inscrire</NuxtLink>
	</div>
</template>

<script>
export default {
  data() {
	return {
		formMessages: [],
		form: {
			email: '',
			password: '',
		}
	}
  },
  methods: {
	async SignUp() {
		try {
			const supabase = useSupabaseClient();
			let { data, error } = await supabase.auth.signInWithPassword({
				email: this.form.email,
				password: this.form.password
			})
			if (error) throw error
		} catch {
			this.formMessages.push({ type: 'error', content: 'Connection impossible' })
		}
    },
  },
  mounted() {
    const user = useSupabaseUser();
    watchEffect(() => {
      if (user.value)
        navigateTo('/events');
    })
  },
}
</script>