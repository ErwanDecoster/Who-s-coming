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