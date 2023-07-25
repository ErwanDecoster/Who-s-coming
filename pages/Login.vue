<template>
	<div class="grid gap-6">
		<h2>Se connecter</h2>
		<form @submit.prevent="SignUp()" class="grid gap-4">
			<div class="grid gap-2">
				<label for="email">E-mail :</label>
				<input v-model="form.email" type="email" name="email" id="email">
			</div>
			<div class="grid gap-2">
				<label for="password">Mot de passe :</label>
				<input v-model="form.password" type="password" name="password" id="password">
			</div>
			<input class="btn-primary" type="submit" value="Connection">
		</form>
		<NuxtLink class="btn-secondary" to="register">S'inscrire</NuxtLink>
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
			navigateTo('/events');
		} catch (error) {
			this.formMessages.push({type: 'error', content: error })
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
  created() {
		const metadata = {
			desc: "Connecter vous, visualiser vos événements et gérer vos invités",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Connection - Who's coming",
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