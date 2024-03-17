<script setup lang="ts">
const props = defineProps<{
  isEdit?: boolean
  invites: invite[]
}>();
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
      class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
    >
      <NuxtLink 
        :to="getInviteUrl($route.params, invite, isEdit)" 
        class="text-base text-black-300 grow"
      >
        {{ invite.first_name }} 
        {{ invite.surname }} 
        <span v-if="invite.asked_by">
          via 
          {{ invite.asked_by.first_name }} 
          {{ invite.asked_by.surname }}
        </span>
      </NuxtLink>
      <button class="bg-secondary px-1.5 text-white">Supprimer</button>
    </div>
  </div>
</template>
