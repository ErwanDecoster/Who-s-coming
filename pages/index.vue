<script setup lang="ts">


let haveCode = ref(false)
let code = ref('')
</script>

<template>
	<div class="container">
		<div v-if="haveCode" class="input-container">
			<label for="code">Mon code :</label>
			<input class="uppercase" type="text" name="code" v-model="code" id="code" autocomplete="off">
		</div>
		<button @click="haveCode = true" class="primary">
			<template v-if="!haveCode">
				J'ai un code
			</template>
			<template v-else>
				Rejoindre l'évènement
			</template>
		</button>
		<button v-if="haveCode" @click="haveCode = false" class="tertiary">Retour</button>
		<NuxtLink to="/register" v-if="!haveCode" class="secondary">Inscription</NuxtLink>
		<NuxtLink to="/login" v-if="!haveCode" class="tertiary">Connexion</NuxtLink>
	</div>
</template>
