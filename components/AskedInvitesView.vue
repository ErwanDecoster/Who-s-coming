<script setup lang="ts">
const props = defineProps({
  eventUrl: String,
  invites: Array,
})
const SendInvite = ((eventId, inviteId, newState) => {
  updateInviteState(eventId, inviteId, newState).then(() => {
    // open message app
    // change the invite in general invites list
  })
})

const DenieInvite = ((eventId, inviteId, newState) => {
  updateInviteState(eventId, inviteId, newState).then(() => {
    // change the invite in general invites list
  })
})
</script>

<template>
  <div class="grid gap-1">
    <div 
      v-for="(invite, index) in invites" 
      :key="invite.id_invitation"
      :class="[
        { 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:rounded-bl-xl': index === invites.length - 1}
      ]"	
      class="duration-300 p-0 overflow-hidden bg-white hover:bg-beige text-primary grid rounded-sm"
    >
      <NuxtLink 
        :to="`/events/${eventUrl}/invites/${invite.id_invitation}`" 
        class="text-base py-1 px-2 w-full text-black-300"
      >
        {{ invite.first_name }} 
        {{ invite.surname }} 
        <span v-if="invite.asked_by">
          via 
          {{ invite.asked_by.first_name }}
          {{ invite.asked_by.surname }}
        </span>
      </NuxtLink>
      <div class="grid grid-cols-2">
        <button 
          @click="DenieInvite(invite.id_evenement, invite.id_invitation, 6)"
          class="bg-primary rounded-r-none text-white"
        >
          Refuser
        </button>
        <button 
          @click="SendInvite(invite.id_evenement, invite.id_invitation, 2)"
          class="bg-secondary rounded-l-none text-white"
        >
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>
