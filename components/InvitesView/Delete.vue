<script setup lang="ts">
const props = defineProps<{
  isEdit?: boolean
  invites: invite[]
  messages: Message[]
}>();
let comfirmDelete = ref()
const emit = defineEmits(['inDelete'])

const EmitDeleteInvite = async (invite: invite) => {
	if (comfirmDelete.value === false) {
		comfirmDelete.value = true
	}
	if (comfirmDelete.value === true) {
    emit('inDelete', invite)
		// try {
		// 	const data = await $fetch(`/api/events/${route.params.id}/invites/${invite.id_invitation}`, {
		// 		method: 'delete',
		// 	})
    //   console.log(data);
      
		// 	if (data == true) {
    //     // visible.value = false
    //     props.invites = props.invites.filter(item => item !== invite);
		// 		props.messages.push({type: 'success', content: "L'invité a été supprimé."})
		// 	}
		// } catch(e) {
		// 	console.log(e);
		//   comfirmDelete.value = null
		// 	props.messages.push({type: 'error', content: "L'invité n'as pas pu étre supprimé."})
		// }
	} else {
		comfirmDelete.value = false
	}
}
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
      <button @click="EmitDeleteInvite(invite)" class="bg-secondary px-1.5 text-white">
        <template v-if="comfirmDelete === false">
          Comfirmer
        </template>
        <template v-else>
          Supprimer
        </template>
      </button>
    </div>
  </div>
</template>
