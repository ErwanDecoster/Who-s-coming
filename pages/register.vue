<template>
	<div class="grid gap-6">
		<h2>S'inscrire</h2>
		<form @submit.prevent="Register()" class="grid gap-4" action="">
			<div
				class="grid gap-1"
				:class="{ 'hidden': formMessages.length == 0 }"
			>
				<p 
					v-for="message in formMessages" 
					:key="message.type"
					class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes' }"
					@click="formMessages.splice(formMessages.indexOf(message), 1)"
				>
					{{ message.content }}
				</p>
			</div>
			<div class="grid gap-2">
				<label for="email">E-mail :</label>
				<input v-model="form.email" type="email" name="email" id="email">
			</div>
			<div class="grid gap-2">
				<label for="password">Mot de passe :</label>
				<input v-model="form.password" type="password" name="password" id="password">
			</div>
			<div class="grid gap-2">
				<label for="password_retype">Confirmation du mot de passe :</label>
				<input v-model="form.passwordRetype" type="password" name="password_retype" id="password_retype">
			</div>
			<input class="btn-primary" type="submit" value="Inscription">
		</form>
		<NuxtLink class="btn-secondary" to="/login">Se connecter</NuxtLink>
	</div>
</template>

<script>
// definePageMeta({
// 	middleware: 'auth'
// })
export default {
  data() {
	return {
		formMessages: [],
		form: {
			email: '',
			password: '',
			passwordRetype: ''
		}
	}
  },
  methods: {
	ValidEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
	CheckForm()
	{
		this.formMessages = []
		if (!this.form.email)
			this.formMessages.push({type: 'error', content: 'Le champ "E-mail" est requis'})
		else if (!this.ValidEmail(this.form.email))
			this.formMessages.push({type: 'error', content: "L'e-mail n'est pas valide"})
		if (!this.form.password)
			this.formMessages.push({type: 'error', content: 'Le champ "Mot de passe" est requis'})
		if (!this.form.passwordRetype)
			this.formMessages.push({type: 'error', content: 'Le champ "Confirmation du mot de passe" est requis'})
		if (this.form.password.length < 6)
			this.formMessages.push({type: 'error', content: 'Le Mot de passe doit contenir au moins 6 caracteres'})
		if (this.form.passwordRetype && this.form.password)
			if (this.form.password !== this.form.passwordRetype)
				this.formMessages.push({type: 'error', content: 'Les mots de passe ne correspondent pas' })
		if (this.formMessages.length == 0)
			return (0)
		return (1)
	},
	async SignUp() {
		try {
			const supabase = useSupabaseClient();
			let { data, error } = await supabase.auth.signUp({
				email: this.form.email,
				password: this.form.password
			})
			if (error) throw error
		} catch (error) {
			this.formMessages.push({type: 'error', content: error })
		}
    }, 
	Register()
	{
		if (this.CheckForm())
			return (1);
		this.SignUp();
	}
  },
  created() {
		const metadata = {
			desc: "Inscrivez vous visualiser vos événements et gérer vos invités",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Inscription - Who's coming",
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