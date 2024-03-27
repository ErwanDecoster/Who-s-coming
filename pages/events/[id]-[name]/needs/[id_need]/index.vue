<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Besoin - Who's coming - Organisateur d'évènements";
const desc = "Consultez les détails d'un besoin sur Who's coming. Découvrez les quantités minimale et maximale requises, ainsi que les invités associés à ce besoin."
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

let messages = ref<Array<Message>>([])
let need: need
try {
	need = await $fetch(`/api/events/${route.params.id}/needs/${route.params.id_need}`, {})
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `Le besoin id : "${route.params.id_need}" de l'évènement "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
}
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
		<template v-if="need">
			<h3 v-if="need.label">{{ need.label }}</h3>
			<div class="grid gap-1">
				<p>Minimun requis :</p>
				<p class="text-base text-black-300" v-if="need.min_required_number">{{ need.min_required_number }} requis</p>
			</div>
			<div class="grid gap-1">
				<p>Maximun :</p>
				<p class="text-base text-black-300" v-if="need.max_number">{{ need.max_number }} maximun</p>
			</div>
			<div v-if="need.need_invitations" class="grid gap-1">
				<p>Invités lié - {{ need.need_invitations.length }} {{ (need.need_invitations.length < 1) ? 'personnes' : 'personne' }} : </p>
				<div class="grid gap-1" v-if="need.need_invitations.length">
					<NuxtLink 
						v-for="(need_invitation, index) in need.need_invitations" 
						:key="need_invitation.id"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${need_invitation.id_invitation}`" 
						:class="[
							{ 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:*:rounded-bl-xl': index === need.need_invitations.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300">{{ need_invitation.invitation.first_name }} {{ need_invitation.invitation.surname }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun invités n'est associer a ce besoin.</p>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/${$route.params.id_need}/edit`" class="primary">Modifier</NuxtLink>
			<button @click="$router.back()" class="tertiary">Retour</button>
		</template>
	</div>
</template>