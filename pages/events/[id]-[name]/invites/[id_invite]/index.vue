<script setup lang="ts">
const route = useRoute()
interface Message {
	type: string;
	content: string;
}

let messages = ref<Array<Message>>([])
let data: unknown
try {
	data = await $fetch(`/api/events/${route.params.id}/invites/${route.params.id_invite}`, {})
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'invitation id : "${route.params.id_invite}" de l'évènement "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
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
		<template v-if="data?.invite">
			<h3>
				{{ data.invite.first_name }} {{ data.invite.surname }} 
				<span v-if="data.asker_invite.id_invitation">
					via {{ data.asker_invite.first_name }} {{ data.asker_invite.surname }}
				</span>
				<span class="text-black-300 font-thin">
					 - {{ getStateName(data.invite.id_state) }}
				</span>
			</h3>
			<div class="grid gap-1">
				<p>Téléphone :</p>
				<p class="text-base text-black-300" v-if="data.invite.tel">
				 	<span v-if="formatPhoneNumberForDisplay(data.invite.tel).cc">
						+{{ formatPhoneNumberForDisplay(data.invite.tel).cc }}
					</span>	
					{{ formatPhoneNumberForDisplay(data.invite.tel).tel.replace(/^0/, '') }}
					<a class="secondary-inline ml-1" :href="`sms:+${data.invite.tel.replace(' ', '')}`">Ouvrir Messages</a>
				</p>
			</div>
			<div class="grid gap-1">
				<p>Code :</p>
				<p class="text-base text-black-300 uppercase" v-if="data.invite.code">
					{{ data.invite.code }}
					<CopyButton :copy-text="data.invite.code" />
				</p>
			</div>
			<div class="grid gap-1">
				<p>Besoins lié - {{ data.invite.need_invitations.length }} {{ (data.invite.need_invitations.length < 1) ? 'besoins' : 'besoin' }} : </p>
				<div class="grid gap-1" v-if="data.invite.need_invitations.length">
					<NuxtLink 
						v-for="(need_invitation, index) in data.invite.need_invitations" 
						:key="need_invitation.id"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/${need_invitation.needs.id_need}`" 
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.invite.need_invitations.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300">{{ need_invitation.needs.label }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun besoin n'est associer a cette invité.</p>
			</div>
			<div v-if="data.asked_invites_by_state[5]" class="grid gap-1">
				<p>Demandes en attente - {{ data.asked_invites_by_state[5].length }} {{ (data.asked_invites_by_state[5].length > 1) ? 'demandes' : 'demande' }} : </p>
				<AskedInvitesView :invites="data.asked_invites_by_state[5]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.asked_invites_by_state[2]" class="grid gap-1">
				<p>Demande confirmé en attente - {{ data.asked_invites_by_state[2].length }} {{ (data.asked_invites_by_state[2].length > 1) ? 'demandes' : 'demande' }} : </p>
				<InvitesView :invites="data.asked_invites_by_state[2]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.asked_invites_by_state[3]" class="grid gap-1">
				<p>Demande accepées confirmé - {{ data.asked_invites_by_state[3].length }} {{ (data.asked_invites_by_state[3].length > 1) ? 'demandes' : 'demande' }} : </p>
				<InvitesView :invites="data.asked_invites_by_state[3]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.asked_invites_by_state[6]" class="grid gap-1">
				<p>Demande declinées - {{ data.asked_invites_by_state[6].length }} {{ (data.asked_invites_by_state[6].length > 1) ? 'demandes' : 'demande' }} : </p>
				<InvitesView :invites="data.asked_invites_by_state[6]" :eventUrl="`${$route.params.id}-${toSlug($route.params.name)}`" />
			</div>
			<div v-if="data.invite.id_state === 5" class="duration-300 p-0 overflow-hidden bg-white hover:bg-beige text-primary grid rounded-sm rounded-tr-lg hover:rounded-tr-xl rounded-bl-lg hover:rounded-bl-xl">
				<p class="text-base py-1 px-2 w-full text-black-300">
					{{ data.invite.first_name }} {{ data.invite.surname }} <span v-if="data.asker_invite">via {{ data.asker_invite.first_name }} {{ data.asker_invite.surname }}</span>
				</p>
				<div class="grid grid-cols-2">
					<button class="bg-primary rounded-r-none text-white">
						Refuser
					</button>
					<button class="bg-secondary rounded-l-none text-white">
						Envoyer
					</button>
				</div>
			</div>
			<button v-if="data.invite.id_state === 2" class="primary">Renvoyer l'invitation</button>
			<button v-if="data.invite.id_state === 1" class="primary">Envoyer l'invitation</button>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${toSlug($route.params.id_invite)}/edit`" class="primary">Modifier</NuxtLink>
			<button @click="$router.back()" class="tertiary">Retour</button>
		</template>
	</div>
</template>