<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Connexion - Who's coming - Organisateur d'évènements";
const desc = "Connectez-vous à votre compte Who's coming pour accéder à vos événements et gérer vos invitations facilement."
const img = runtimeConfig.public.siteUrl + "/images/minia.png"
const url = runtimeConfig.public.siteUrl + route.path
useHead({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: url,
    },
  ],
})
useSeoMeta({
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogUrl: url,
  ogType: 'article',
  ogImage: img,
  twitterCard: 'summary_large_image',
  twitterSite: '@erwan_decoster',
  twitterCreator: '@erwan_decoster',
  twitterTitle: title,
  twitterDescription: desc,
  twitterImage: img,
})

interface Message {
  type: string;
  content: string;
}
let messages = ref<Array<Message>>([])

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

const Login = async () => {
	if (ValidForm()) {
		try {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.value,
				password: password.value,
			})
			if (error) throw error
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

if (typeof route.query.comfirm !== 'undefined')
	messages.value.push({type: 'success', content: "Votre e-mail a été vérifiée avec succès. Vous pouvez maintenant vous connecter !" })

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
					type="email" 
					name="email" 
					v-model="email" 
					id="email" 
					autocomplete="email"
					autofocus
					required
				>
			</div>
			<div class="input-container">
				<label for="password">Mot de passe :</label>
				<div class="relative">
					<button type="button" @click.self="viewPassword" class="show_pass p-2 absolute top-1/2 -translate-y-1/2 right-2">
						<svg class="pointer-events-none" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1 8.30154C5.74762 1.80365 12.4889 1.88804 17 8.30154C12.1679 15.0526 5.78141 14.6813 1 8.30154Z" stroke="#333333" stroke-linejoin="round"/>
							<path d="M11.7864 8.33554C11.7864 9.86722 10.5433 11.1098 9.00868 11.1098C7.47409 11.1098 6.23096 9.86722 6.23096 8.33554C6.23096 6.80386 7.47409 5.56128 9.00868 5.56128C10.5433 5.56128 11.7864 6.80386 11.7864 8.33554Z" stroke="#333333"/>
							<path class="barred duration-300 delay-100 scale-0 origin-center" d="M2.62195 1.33341L15.9694 14.6667" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<input 
						class="w-full"
						type="password" 
						name="password" 
						v-model="password" 
						id="password" 
						autocomplete="current-password"
						required
					>
				</div>
			</div>
			<input 
				type="submit" 
				value="Connexion"
			>
		</form>
		<NuxtLink to="/" class="tertiary">Retour</NuxtLink>
	</div>
</template>