<script setup lang="ts">
const route = useRoute()

let messages = ref<Array<Message>>([])

// let data = ref<{
//   invites_by_state: invites_by_state
// }>({
//   invites_by_state: {}// Initialisez les invites par état selon votre logique
// })
let data: {
	invites_by_state: invites_by_state,
}
try {
	data = await $fetch(`/api/events/${route.params.id}/invites`, {})

} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `Les invites de l'évènement "${route.params.name}" id : ${route.params.id} non pas pu étre recuperé.`})
}
const DeleteInvite = async (inviteList: invite[], invite: invite) => {
	try {
		const data = await $fetch(`/api/events/${route.params.id}/invites/${invite.id_invitation}`, {
			method: 'delete',
		})
		console.log(data);
		
		if (data == true) {
			// visible.value = false
			inviteList = inviteList.filter(item => item !== invite);
			messages.value.push({type: 'success', content: "L'invité a été supprimé."})
		}
	} catch(e) {
		console.log(e);
		messages.value.push({type: 'error', content: "L'invité n'as pas pu étre supprimé."})
	}
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
				Modifier la liste des invités
			</h3>
			<div v-if="data.invites_by_state[1]" class="grid gap-1">
				<p>Invitations non envoyées - {{ data.invites_by_state[1].length }} {{ (data.invites_by_state[1].length > 1) ? 'non envoyées' : 'non envoyée' }} : </p>
				<InvitesViewDelete @in-delete="(EmitInvite) => DeleteInvite(data.invites_by_state[1], EmitInvite)" :invites="data.invites_by_state[1]" :isEdit="true" :messages="messages"/>
			</div>
			<div v-if="data.invites_by_state[2]" class="grid gap-1">
				<p>Invitations en attentes - {{ data.invites_by_state[2].length }} {{ (data.invites_by_state[2].length > 1) ? 'en attentes' : 'en attente' }} : </p>
				<InvitesViewDelete :invites="data.invites_by_state[2]" :isEdit="true" :messages="messages"/>
			</div>
			<div v-if="data.invites_by_state[3]" class="grid gap-1">
				<p>Invitations acceptées - {{ data.invites_by_state[3].length }} {{ (data.invites_by_state[3].length > 1) ? 'acceptées' : 'acceptée' }} : </p>
				<InvitesView :invites="data.invites_by_state[3]" :isEdit="true" />
			</div>
			<div v-if="data.invites_by_state[4]" class="grid gap-1">
				<p>Invitations declinées - {{ data.invites_by_state[4].length }} {{ (data.invites_by_state[4].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesViewDelete :invites="data.invites_by_state[4]" :isEdit="true" :messages="messages"/>
			</div>
			<div v-if="data.invites_by_state[6]" class="grid gap-1">
				<p>Demande declinées - {{ data.invites_by_state[6].length }} {{ (data.invites_by_state[6].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<InvitesViewDelete :invites="data.invites_by_state[6]" :isEdit="true" :messages="messages"/>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites`" class="primary">Terminer</NuxtLink>
		</template>
	</div>
</template>