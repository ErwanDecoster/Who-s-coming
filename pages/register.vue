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
let passwordRetype = ref('')

const ValidEmail = ((email: string) => {
  const re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return re.test(email);
})

const ValidPassword = ((password: string) => {
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return re.test(password);
})

const ValidForm = (() => {
  messages.value = [];
	if (!ValidEmail(email.value))
		messages.value.push({type: 'error', content: 'Une adresse e-mail valide est requise."'})
  if (!ValidPassword(password.value))
    messages.value.push({type: 'error', content: 'Un mot de passe valide est requis.'})
  if (password.value !== passwordRetype.value)
    messages.value.push({type: 'error', content: 'Les mots de passe ne correspondent pas.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const Register = async () => {
	if (ValidForm()) {
		try {
			const supabase = useSupabaseClient();
			let { data, error } = await supabase.auth.signUp({
				email: email.value,
				password: password.value
			})
			if (error) throw error
			console.log(data);
			if (data.user?.role && data.user.role === "authenticated") {
				messages.value.push({type: 'success', content: "Veuillez vérifier votre boîte mail et confirmer votre inscription." })
				needEmailComfirmation.value = true;
			}	else {
				messages.value.push({type: 'error', content: "Cet e-mail est déjà associé à un compte." })
			}
		} catch (error) {
			console.log(error);
			messages.value.push({type: 'error', content: error as string })
		}
	}
}

let formCheck = ref({
	email: false,
	lenght: false,
	number: false,
	small: false,
	capital: false,
	special: false,
	retype: false,
})

watch(() => password.value, (newVal) => {
  const lowerCaseLetters = /[a-z]/g;
  if(newVal.match(lowerCaseLetters)) {
    formCheck.value.small = false
  } else {
    formCheck.value.small = true
	}
  const upperCaseLetters = /[A-Z]/g;
  if(newVal.match(upperCaseLetters)) {
    formCheck.value.capital = false
  } else {
    formCheck.value.capital = true
	}
  const numbers = /[0-9]/g;
  if(newVal.match(numbers)) {
    formCheck.value.number = false
  } else {
    formCheck.value.number = true
	}
  const special = /(?=.*?[#?!@$ %^&*-])/g;
  if(newVal.match(special)) {
    formCheck.value.special = false
  } else {
    formCheck.value.special = true
	}

  if(newVal.length >= 8) {
    formCheck.value.lenght = false
  } else {
    formCheck.value.lenght = true
	}
})

watch(() => passwordRetype.value, (newVal) => {
  if(newVal === password.value) {
    formCheck.value.retype = false
  } else {
    formCheck.value.retype = true
	}
})

watch(() => email.value, (newVal) => {
	formCheck.value.email = !ValidEmail(newVal)
})

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
			<template v-if="!needEmailComfirmation">
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
					<ul>
						<li v-if="formCheck.email" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">L'adresse e-mail n'est pas valide.</li>
					</ul>
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
							autocomplete="new-password"
							required
							pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}"
						>
					</div>
					<ul>
						<li v-if="formCheck.lenght" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">8 caractères</li>
						<li v-if="formCheck.capital" class="text-red leading-4 before:content-['•'] before:mr-1" id="capital">Une lettre majuscule</li>
						<li v-if="formCheck.small" class="text-red leading-4 before:content-['•'] before:mr-1" id="small">Une lettre minuscule</li>
						<li v-if="formCheck.number" class="text-red leading-4 before:content-['•'] before:mr-1" id="number">Un chiffre</li>
						<li v-if="formCheck.special" class="text-red leading-4 before:content-['•'] before:mr-1" id="special">Un caractère spécial</li>
					</ul>
				</div>
				<div class="input-container">
					<label for="passwordRetype">Comfirmation du mot de passe :</label>
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
							name="passwordRetype" 
							v-model="passwordRetype" 
							id="passwordRetype" 
							autocomplete="new-password"
							required
						>
					</div>
					<ul>
						<li v-if="formCheck.retype" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">Les mots de passe ne correspondent pas.</li>
					</ul>
				</div>
				<input 
					type="submit" 
					value="Inscription"
					:disabled="Object.values(formCheck).some(value => value === true)"
				>
			</template>
		</form>
		<NuxtLink v-if="!needEmailComfirmation" to="/" class="tertiary">Retour</NuxtLink>
	</div>
</template>
