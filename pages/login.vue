<script setup lang="ts">

interface Message {
  type: string;
  content: string;
}

let messages = ref<Array<Message>>([])

// let waiting = ref(false)
let needEmailComfirmation = ref(false);

let email = ref('')
let password = ref('')

const ValidForm = (() => {
  messages.value = [];
	if (!email.value.length)
		messages.value.push({type: 'error', content: "L'adresse e-mail est requise."})
  if (!password.value.length)
    messages.value.push({type: 'error', content: 'le mot de passe est requis.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const Register = async () => {
	if (ValidForm()) {
		try {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.value,
				password: password.value,
			})
			if (error) throw error
			console.log(data);
			if (data.user?.role && data.user.role === "authenticated") {
				const router = useRouter()
				router.push('/events')
			}
		} catch (error) {
			console.log(error);
			messages.value.push({type: 'error', content: error as string })
		}
	}
}

</script>

<template>
	<div class="container">
		<form @submit.prevent="Register()">
			<ul>
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
			<div class="input-container">
				<label for="email">Email :</label>
				<input 
					type="email" 
					name="email" 
					v-model="email" 
					id="email" 
					autocomplete="email"
					required
				>
			</div>
			<div class="input-container">
				<label for="password">Mot de passe :</label>
				<input 
					type="password" 
					name="password" 
					v-model="password" 
					id="password" 
					autocomplete="new-password"
					required
					pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}"
				>
			</div>
			<input 
				type="submit" 
				value="Connexion"
			>
		</form>
		<NuxtLink to="/" class="tertiary">Retour</NuxtLink>
	</div>
</template>

<!-- <script>
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
</script> -->