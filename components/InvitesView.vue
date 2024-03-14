<script setup lang="ts">
const props = defineProps({
  eventUrl: String,
  invites: Array,
})
</script>

<template>
<!--   
  <div class="grid gap-1">
    <div 
      v-for="(invite, index) in data.invitesByState[5]" 
      :key="invite.id_invitation"
      :class="[
        { 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:rounded-bl-xl': index === data.invitesByState[5].length - 1}
      ]"	
      class="duration-300 p-0 overflow-hidden bg-white hover:bg-beige text-primary grid rounded-sm"
    >
      <NuxtLink 
        :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
        class="text-base py-1 px-2 w-full text-black-300"
      >
        {{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
      </NuxtLink>
      <div class="grid grid-cols-2">
        <button class="bg-primary rounded-r-none text-white">
          Refuser
        </button>
        <button class="bg-secondary rounded-l-none text-white">
          Envoyer
        </button>
      </div>
    </div>
  </div>

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
        :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
        class="text-base text-black-300"
      >
        {{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span>
      </NuxtLink>
      <button class="bg-secondary px-1.5 text-white">Envoyer</button>
    </div>
  </div>

  <div class="grid gap-1">
    <NuxtLink 
      v-for="(invite, index) in data.invitesByState[2]" 
      :key="invite.id_invitation"
      :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
      :class="[
        { 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.invitesByState[2].length - 1}
      ]"	
      class="leaf flex justify-between rounded-sm"
    >
      <p class="text-base text-black-300">{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span></p>
    </NuxtLink>
  </div>

  <div class="grid gap-1">
    <NuxtLink 
      v-for="(invite, index) in data.invitesByState[3]" 
      :key="invite.id_invitation"
      :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
      :class="[
        { 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.invitesByState[3].length - 1}
      ]"	
      class="leaf flex justify-between rounded-sm"
    >
      <p class="text-base text-black-300">{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span></p>
    </NuxtLink>
  </div>

  <div class="grid gap-1">
    <NuxtLink 
      v-for="(invite, index) in data.invitesByState[4]" 
      :key="invite.id_invitation"
      :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites/${invite.id_invitation}`" 
      :class="[
        { 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:*:rounded-bl-xl': index === data.invitesByState[4].length - 1}
      ]"	
      class="leaf flex justify-between rounded-sm"
    >
      <p class="text-base text-black-300">{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span></p>
    </NuxtLink>
  </div>


  eventUrl: `${$route.params.id}-${toSlug($route.params.name)}`,
  invites: [
    {
      id_invitation: 3,
      first_name: '',
      surname: '',
      asked_by: {
        first_name: '',
        surname: '',
      }
    },
  ]


   -->
  <div class="grid gap-1">
    <NuxtLink 
      v-for="(invite, index) in invites" 
      :key="invite.id_invitation"
      :to="`/events/${eventUrl}/invites/${invite.id_invitation}`" 
      :class="[
        { 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:*:rounded-bl-xl': index === invites.length - 1}
      ]"	
      class="leaf flex justify-between rounded-sm"
    >
      <p class="text-base text-black-300">{{ invite.first_name }} {{ invite.surname }} <span v-if="invite.asked_by">via {{ invite.asked_by.first_name }} {{ invite.asked_by.surname }}</span></p>
    </NuxtLink>
  </div>
</template>
