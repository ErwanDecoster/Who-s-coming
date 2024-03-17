<script setup lang="ts">
const props = defineProps({
  isEdit: Boolean,
  invites: Array,
})
</script>

<template>
  <div class="grid gap-1">
    <NuxtLink 
      v-for="(invite, index) in invites" 
      :key="invite.id_invitation"
      :to="getInviteUrl($route.params, invite, isEdit)" 
      :class="[
        { 'rounded-tr-lg hover:*:rounded-tr-xl': index === 0},
        { 'rounded-bl-lg hover:*:rounded-bl-xl': index === invites.length - 1}
      ]"	
      class="leaf flex justify-between rounded-sm"
    >
      <p class="text-base text-black-300">
        {{ invite.first_name }} 
        {{ invite.surname }} 
        <span v-if="invite.asked_by">
          via 
          {{ invite.asked_by.first_name }} 
          {{ invite.asked_by.surname }}
        </span>
      </p>
    </NuxtLink>
  </div>
</template>
