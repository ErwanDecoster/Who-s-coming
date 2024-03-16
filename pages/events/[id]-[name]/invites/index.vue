<script setup lang="ts">
const route = useRoute()
interface Message {
	type: string;
	content: string;
}

let messages = ref<Array<Message>>([])
let data: unknown
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
		<template v-if="data?.invitesByState">
			<h3>
				Liste des invités - {{ 
					(data.invitesByState[2]?.length ?? 0) + (data.invitesByState[3]?.length ?? 0) 
				}} {{ 
					((data.invitesByState[2]?.length ?? 0) + (data.invitesByState[3]?.length ?? 0) > 1) ? 'invités confirmé' : 'invité confirmé' 
				}} 
			</h3>
			<div v-if="data.invitesByState[5]" class="grid gap-1">
				<p>Demandes - {{ data.invitesByState[5].length }} {{ (data.invitesByState[5].length > 1) ? 'demandes' : 'demande' }} : </p>
				<AskedInvitesView :invites="data.invitesByState[5]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invitesByState[1]" class="grid gap-1">
				<p>Invitations non envoyées - {{ data.invitesByState[1].length }} {{ (data.invitesByState[1].length > 1) ? 'non envoyées' : 'non envoyée' }} : </p>
				<UnsendInvitesView :invites="data.invitesByState[1]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invitesByState[2]" class="grid gap-1">
				<p>Invitations en attentes - {{ data.invitesByState[2].length }} {{ (data.invitesByState[2].length > 1) ? 'en attentes' : 'en attente' }} : </p>
				<InvitesView :invites="data.invitesByState[2]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invitesByState[3]" class="grid gap-1">
				<p>Invitations acceptées - {{ data.invitesByState[3].length }} {{ (data.invitesByState[3].length > 1) ? 'acceptées' : 'acceptée' }} : </p>
				<InvitesView :invites="data.invitesByState[3]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invitesByState[4]" class="grid gap-1">
				<p>Invitations declinées - {{ data.invitesByState[4].length }} {{ (data.invitesByState[4].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesView :invites="data.invitesByState[4]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invitesByState[6]" class="grid gap-1">
				<p>Demande declinées - {{ data.invitesByState[6].length }} {{ (data.invitesByState[6].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesView :invites="data.invitesByState[6]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<p v-if="Object.keys(data.invitesByState).length === 0" class="text-base text-black-300">Aucun invités n'est associer a cette événement.</p>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/new-invite`" class="primary">Ajouter un invité</NuxtLink>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/edit`" class="secondary">Modifier</NuxtLink>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}`" class="tertiary">Retour</NuxtLink>
		</template>
	</div>
</template>