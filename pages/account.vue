<script setup lang="ts">
const messages = ref<Array<Message>>([])

let passwordForm = ref({
	showForm: false,
	newPassword: '',
	newPasswordRetype: '',
})

let emailForm = ref({
	showForm: false,
	newEmail: '',
})

let formCheck = ref({
	email: false,
	lenght: false,
	number: false,
	small: false,
	capital: false,
	special: false,
	retype: false,
})

const ValidEmail = ((email: string) => {
  const re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return re.test(email);
})

const ValidPassword = ((password: string) => {
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return re.test(password);
})

const ValidEmailForm = (() => {
  messages.value = [];
	if (!ValidEmail(emailForm.value.newEmail))
		messages.value.push({type: 'error', content: 'Une adresse e-mail valide est requise."'})
	if (messages.value.length)
    return (0)
  return (1)
})

const ValidPasswordForm = (() => {
  messages.value = [];
  if (!ValidPassword(passwordForm.value.newPassword))
    messages.value.push({type: 'error', content: 'Un mot de passe valide est requis.'})
  if (passwordForm.value.newPassword !== passwordForm.value.newPasswordRetype)
    messages.value.push({type: 'error', content: 'Les mots de passe ne correspondent pas.'})
	if (messages.value.length)
    return (0)
  return (1)
})

// let { data, error } = await supabase.auth.resetPasswordForEmail(email)
const disconect = async () => {
	try {
		const supabase = useSupabaseClient();
		let { error } = await supabase.auth.signOut()
		if (error) throw error
	} catch (error) {
		console.log(error);
	}
}

const updateUserEmail = async () => {
	if (ValidEmailForm()) {
		try {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase.auth.updateUser({
				email: emailForm.value.newEmail,
			})
			if (error) throw error
			console.log(data);
		} catch (error) {
			messages.value.push({type: 'error', content: "Votre email n'as pas pu étre mis a jour."})
			console.error(error);
		}
	}
}
const updateUserPassword = async () => {
	if (ValidPasswordForm()) {
		try {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase.auth.updateUser({
				password: passwordForm.value.newPassword,
			})
			if (error) throw error
			console.log(data);
			messages.value.push({type: 'success', content: 'Votre mot de passe a bien été modifié.'})
		} catch (error) {
			messages.value.push({type: 'error', content: "Votre mot de passe n'as pas pu étre mis a jour."})
			console.error(error);
		}
	}
}

watch(() => passwordForm.value.newPassword, (newVal: string) => {
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

watch(() => passwordForm.value.newPasswordRetype, (newVal: string) => {
  if(newVal === passwordForm.value.newPassword) {
    formCheck.value.retype = false
  } else {
    formCheck.value.retype = true
	}
})

watch(() => emailForm.value.newEmail, (newVal: string) => {
	formCheck.value.email = !ValidEmail(newVal)
})

</script>

<template>
	<div class="container">
		<ul v-if="messages.length">
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
		<h3>Mon compte</h3>
		<div v-if="!passwordForm.showForm" class="grid gap-1">
			<h4>Email :</h4>
			<form v-if="emailForm.showForm" @submit.prevent="updateUserEmail()">
				<div class="input-container">
					<label for="email">Nouvel email :</label>
					<input 
						type="email" 
						name="email" 
						v-model="emailForm.newEmail" 
						id="email" 
						autocomplete="off"
						required
					>
				</div>
				<ul v-if="formCheck.email">
					<li v-if="formCheck.email" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">L'adresse e-mail n'est pas valide.</li>
				</ul>
				<input type="submit" value="Mettre a jour">
			</form>
			<button class="secondary" @click="emailForm.showForm = !emailForm.showForm">
				{{ emailForm.showForm? 'Annuler': "Modifier l'email" }}
			</button>
		</div>
		<div v-if="!emailForm.showForm" class="grid gap-1">
			<h4>Mot de passe :</h4>
			<form v-if="passwordForm.showForm" @submit.prevent="updateUserPassword()">
				<div class="input-container">
					<label for="new-password">Nouveau mot de passe :</label>
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
							name="new-password" 
							v-model="passwordForm.newPassword" 
							id="new-password" 
							autocomplete="new-password"
							required
						>
					</div>
					<ul v-if="formCheck.lenght || formCheck.capital || formCheck.small || formCheck.number || formCheck.special">
						<li v-if="formCheck.lenght" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">8 caractères</li>
						<li v-if="formCheck.capital" class="text-red leading-4 before:content-['•'] before:mr-1" id="capital">Une lettre majuscule</li>
						<li v-if="formCheck.small" class="text-red leading-4 before:content-['•'] before:mr-1" id="small">Une lettre minuscule</li>
						<li v-if="formCheck.number" class="text-red leading-4 before:content-['•'] before:mr-1" id="number">Un chiffre</li>
						<li v-if="formCheck.special" class="text-red leading-4 before:content-['•'] before:mr-1" id="special">Un caractère spécial</li>
					</ul>
				</div>
				<div class="input-container">
					<label for="password">Comfirmation du nouveau mot de passe :</label>
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
							name="new-password-retype" 
							v-model="passwordForm.newPasswordRetype" 
							id="new-password-retype" 
							autocomplete="new-password"
							required
						>
					</div>
					<ul>
						<li v-if="formCheck.retype" class="text-red leading-4 before:content-['•'] before:mr-1" id="lenght">Les mots de passe ne correspondent pas.</li>
					</ul>
				</div>
				<input type="submit" value="Mettre a jour le mot de passe">
			</form>
			<button class="secondary" @click="passwordForm.showForm = !passwordForm.showForm">
				{{ passwordForm.showForm? 'Annuler': 'Modifier le mot de passe'}}
			</button>
		</div>
		<button v-if="!passwordForm.showForm && !emailForm.showForm" @click="disconect" class="delete" >Deconnexion</button>
		<NuxtLink v-if="!passwordForm.showForm && !emailForm.showForm" :to="`/account`" class="primary">Retour</NuxtLink>
		<button v-if="!passwordForm.showForm && !emailForm.showForm" class="delete-rev" @click="delete">Supprimer mon compte</button>
	</div>
</template>
