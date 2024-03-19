<script setup lang="ts">
const route = useRoute()
const props = defineProps<{
  isEdit?: boolean
  invites: invite[]
  messages: Message[]
}>();
const comfirmDelete = ref<boolean[]>([])
const emit = defineEmits(['updateList'])

const DeleteInvite = async (invite: invite, index: number) => {
	if (comfirmDelete.value[index] === false) {
		comfirmDelete.value[index] = true
	}
	if (comfirmDelete.value[index] === true) {
		try {
		const data = await $fetch(`/api/events/${route.params.id}/invites/${invite.id_invitation}`, {
			method: 'delete',
		})
		console.log(data);
		
		if (data == true) {
			props.messages.push({type: 'success', content: "L'invité a été supprimé."})
      emit('updateList', invite)
		}
	} catch(e) {
		console.log(e);
		props.messages.push({type: 'error', content: "L'invité n'as pas pu étre supprimé."})
	}
	} else {
		comfirmDelete.value[index] = false
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
      <button @click="DeleteInvite(invite, index)" class="bg-secondary px-1.5 text-white">
        <template v-if="comfirmDelete[index] === false">
          Comfirmer
        </template>
        <template v-else>
          Supprimer
        </template>
      </button>
    </div>
    <p v-if="!invites.length" class="text-black-300">Aucune invitation.</p>
  </div>
</template>
