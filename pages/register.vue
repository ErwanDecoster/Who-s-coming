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
					<input 
						type="password" 
						name="password" 
						v-model="password" 
						id="password" 
						autocomplete="new-password"
						required
						pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}"
					>
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
					<input 
						type="password" 
						name="passwordRetype" 
						v-model="passwordRetype" 
						id="passwordRetype" 
						autocomplete="new-password"
						required
					>
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
		<NuxtLink to="/" class="tertiary">Retour</NuxtLink>
	</div>
</template>
