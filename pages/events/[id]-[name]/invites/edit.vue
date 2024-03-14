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
	console.log(data);
	
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
			<h3>Liste des invités - {{ data.invitesByState[2].length + data.invitesByState[3].length }} {{ (data.invitesByState[2].length + data.invitesByState[3].length > 1) ? 'invités' : 'invité' }} </h3>
			<div v-if="data.invitesByState[1]" class="grid gap-1">
				<p>Invitations non envoyées - {{ data.invitesByState[1].length }} {{ (data.invitesByState[1].length > 1) ? 'non envoyées' : 'non envoyée' }} : </p>
				<div class="grid gap-1">
					<div 
						v-for="(invite, index) in data.invitesByState[1]" 
						:key="invite.id_invitation"
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.invitesByState[1].length - 1}
						]"	
						class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
					>
						<NuxtLink 
							:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}/edit`" 
							class="text-base text-black-300"
						>
							{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
						</NuxtLink>
						<button class="bg-secondary px-1.5 text-white">Supprimer</button>
					</div>
				</div>
			</div>
			
			<div v-if="data.invitesByState[2]" class="grid gap-1">
				<p>Invitations en attentes - {{ data.invitesByState[2].length }} {{ (data.invitesByState[2].length > 1) ? 'en attentes' : 'en attente' }} : </p>
				<div class="grid gap-1">
					<div 
						v-for="(invite, index) in data.invitesByState[2]" 
						:key="invite.id_invitation"
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.invitesByState[2].length - 1}
						]"	
						class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
					>
						<NuxtLink 
							:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}/edit`" 
							class="text-base text-black-300"
						>
							{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
						</NuxtLink>
						<button class="bg-secondary px-1.5 text-white">Supprimer</button>
					</div>
				</div>
			</div>
			
			<div v-if="data.invitesByState[3]" class="grid gap-1">
				<p>Invitations acceptées - {{ data.invitesByState[3].length }} {{ (data.invitesByState[3].length > 1) ? 'acceptées' : 'acceptée' }} : </p>
				<div class="grid gap-1">
					<NuxtLink 
						v-for="(invite, index) in data.invitesByState[3]" 
						:key="invite.id_invitation"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}/edit`" 
						:class="[
							{ 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.invitesByState[3].length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300">{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span></p>
					</NuxtLink>
				</div>
			</div>
			
			<div v-if="data.invitesByState[4]" class="grid gap-1">
				<p>Invitations declinées - {{ data.invitesByState[4].length }} {{ (data.invitesByState[4].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<div class="grid gap-1">
					<div 
						v-for="(invite, index) in data.invitesByState[4]" 
						:key="invite.id_invitation"
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.invitesByState[4].length - 1}
						]"	
						class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
					>
						<NuxtLink 
							:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}/edit`" 
							class="text-base text-black-300"
						>
							{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
						</NuxtLink>
						<button class="bg-secondary px-1.5 text-white">Supprimer</button>
					</div>
				</div>
			</div>
			
			<div v-if="data.invitesByState[6]" class="grid gap-1">
				<p>Demande declinées - {{ data.invitesByState[6].length }} {{ (data.invitesByState[6].length > 1) ? 'declinées' : 'declinée' }} : </p>
				<div class="grid gap-1">
					<div 
						v-for="(invite, index) in data.invitesByState[6]" 
						:key="invite.id_invitation"
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.invitesByState[6].length - 1}
						]"	
						class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
					>
						<NuxtLink 
							:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
							class="text-base text-black-300"
						>
							{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
						</NuxtLink>
						<button class="bg-secondary px-1.5 text-white">Supprimer</button>
					</div>
				</div>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites`" class="primary">Terminer</NuxtLink>
		</template>
	</div>
</template>