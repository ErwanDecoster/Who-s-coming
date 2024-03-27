<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Who's coming - Organisateur d'évènements";
const desc = "Simplifiez la gestion des invités et des détails logistiques de vos évènements."
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
