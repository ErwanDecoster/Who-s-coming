<script setup lang="ts">

interface Message {
  type: string;
  content: string;
}

let messages = ref<Array<Message>>([])

let form = ref({
	email: '',
	password: '',
})

const ValidForm = (() => {
  messages.value = [];
	if (form.value.email.length === 0)
		messages.value.push({type: 'error', content: 'Un e-mail est requi.'})
  if (form.value.password.length === 0)
    messages.value.push({type: 'error', content: 'Un mot de passe est requi.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const Login = async () => {
	if (ValidForm()) {
		try {
			const supabase = useSupabaseClient();
			let { data, error } = await supabase.auth.signInWithPassword({
				email: form.value.email,
				password: form.value.password
			})
			if (error) throw error
			if (data.user) {
				console.log(data);
				navigateTo('/events');
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
		<form @submit.prevent="Login()">
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
					type="text" 
					name="email" 
					v-model="form.email" 
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
					v-model="form.password" 
					id="password" 
					autocomplete="current-password"
					required
				>
			</div>
			<input type="submit" value="Connexion">
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
}
</script> -->