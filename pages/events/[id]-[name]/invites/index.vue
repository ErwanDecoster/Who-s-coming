<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Invités - Who's coming - Organisateur d'évènements";
const desc = "Consultez et gérez vos invitations sur Who's coming. Suivez le statut (accepté, décliné, en attente), envoyez de nouvelles invitations et gérez les demandes d'invités supplémentaires."
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
let data: {
	invites_by_state: invites_by_state;
}
try {
	data = await $fetch(`/api/events/${route.params.id}/invites`, {})
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `Les invites de l'évènement "${route.params.name}" id : ${route.params.id} non pas pu étre recuperé.`})
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
		<template v-if="data?.invites_by_state">
			<h3>
				Liste des invités - {{ 
					(data.invites_by_state[2]?.length ?? 0) + (data.invites_by_state[3]?.length ?? 0) 
				}} {{ 
					((data.invites_by_state[2]?.length ?? 0) + (data.invites_by_state[3]?.length ?? 0) > 1) ? 'invités confirmé' : 'invité confirmé' 
				}} 
			</h3>
			<div v-if="data.invites_by_state[5]" class="grid gap-1">
				<p>Demandes - {{ data.invites_by_state[5].length }} {{ (data.invites_by_state[5].length > 1) ? 'demandes' : 'demande' }} : </p>
				<InvitesViewAsked :invites="data.invites_by_state[5]" />
			</div>
			<div v-if="data.invites_by_state[1]" class="grid gap-1">
				<p>Invitations non envoyées - {{ data.invites_by_state[1].length }} {{ (data.invites_by_state[1].length > 1) ? 'non envoyées' : 'non envoyée' }} : </p>
				<InvitesViewUnsend :invites="data.invites_by_state[1]" />
			</div>
			<div v-if="data.invites_by_state[2]" class="grid gap-1">
				<p>Invitations en attentes - {{ data.invites_by_state[2].length }} {{ (data.invites_by_state[2].length > 1) ? 'en attentes' : 'en attente' }} : </p>
				<InvitesView :invites="data.invites_by_state[2]" />
			</div>
			<div v-if="data.invites_by_state[3]" class="grid gap-1">
				<p>Invitations acceptées - {{ data.invites_by_state[3].length }} {{ (data.invites_by_state[3].length > 1) ? 'acceptées' : 'acceptée' }} : </p>
				<InvitesView :invites="data.invites_by_state[3]" />
			</div>
			<div v-if="data.invites_by_state[4]" class="grid gap-1">
				<p>Invitations declinées - {{ data.invites_by_state[4].length }} {{ (data.invites_by_state[4].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesView :invites="data.invites_by_state[4]" />
			</div>
			<div v-if="data.invites_by_state[6]" class="grid gap-1">
				<p>Demande declinées - {{ data.invites_by_state[6].length }} {{ (data.invites_by_state[6].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesView :invites="data.invites_by_state[6]" />
			</div>
			<p v-if="Object.keys(data.invites_by_state).length === 0" class="text-base text-black-300">Aucun invités n'est associer a cette événement.</p>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/new-invite`" class="primary">Ajouter un invité</NuxtLink>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/edit`" class="secondary">Modifier</NuxtLink>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}`" class="tertiary">Retour</NuxtLink>
		</template>
	</div>
</template>