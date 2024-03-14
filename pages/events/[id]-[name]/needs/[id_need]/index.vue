<script setup lang="ts">
const route = useRoute()
interface Message {
	type: string;
	content: string;
}

let messages = ref<Array<Message>>([])
let data: unknown
try {
	data = await $fetch(`/api/events/${route.params.id}/needs/${route.params.id_need}`, {})
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
		<template v-if="data?.need">
			<h3 v-if="data.need.label">{{ data.need.label }}</h3>
			<div class="grid gap-1">
				<p>Nombre minimun requis :</p>
				<p class="text-base text-black-300" v-if="data.need.min_required_number">{{ data.need.min_required_number }} requis</p>
			</div>
			<div class="grid gap-1">
				<p>Nombre maximun :</p>
				<p class="text-base text-black-300" v-if="data.need.max_number">{{ data.need.max_number }} maximun</p>
			</div>
			<div v-if="data.need.need_invitations" class="grid gap-1">
				<p>Invité lié - {{ data.need.need_invitations.length }} {{ (data.need.need_invitations.length < 1) ? 'personnes' : 'personne' }} : </p>
				<div class="grid gap-1" v-if="data.need.need_invitations.length">
					<NuxtLink 
						v-for="(need_invitation, index) in data.need.need_invitations" 
						:key="need_invitation.id"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${need_invitation.id_invitation}`" 
						:class="[
							{ 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.need.need_invitations.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300">{{ need_invitation.invitations.first_name }} {{ need_invitation.invitations.surname }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun invités n'est associer a ce besoin.</p>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/${toSlug($route.params.id_need)}/edit`" class="primary">Modifier</NuxtLink>
			<button @click="$router.back()" class="tertiary">Retour</button>
		</template>
	</div>
</template>