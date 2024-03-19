<script setup lang="ts">
const props = defineProps<{
  isEdit?: boolean
  invites: invite[]
}>();


const OpenMessageApp = ((first_name: string, surname: string, code: string, tel: string, eventName: string) => {
  const url = 'https://who-s-coming.vercel.app/'
  const inviteUrl = `${url}events/${props.url}/invites/${code}`
  const message = `Salut ${first_name} ${surname} je t'invite a l'événement ${eventName} code d'invitation : ${code.toUpperCase()}, pour plus d'information, ou pour accepter ou decliné l'invitation clique sur ce lien : ${inviteUrl}`
  // Stocker et recuperer les donnée dans le local host
  message.replaceAll(' ', '%20')
  message.replaceAll("'", '%27')
  const link = `sms://${tel}?body=${message}`
  // secure if message app not opened
  try {
    window.location.href = link;
  } catch (error) {
    console.log('wsh');
  }
})

const SendInvite = ((invite: invite, newState: number) => {
  const data = updateInviteState(invite.id_evenement, invite.id_invitation, newState).then((data) => {
    // open message app
    console.log(data);
    if (data === true) {
      // update invites liste
      OpenMessageApp(invite.first_name, invite.surname, invite.code, invite.tel, props.url)
    }
    else {
      // find a way to show an error message
      console.error('Invite state not updated');
    }
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
      class="duration-300 pl-2 overflow-hidden bg-white hover:bg-beige text-primary flex justify-between rounded-sm"
    >
      <NuxtLink 
        :to="getInviteUrl($route.params, invite, isEdit)" 
        class="text-base text-black-300"
      >
        {{ invite.first_name }} 
        {{ invite.surname }} 
        <span v-if="invite.asked_by">
          via 
          {{ invite.asked_by.first_name }}
          {{ invite.asked_by.surname }}
        </span>
      </NuxtLink>
      <button 
        @click="SendInvite(invite, 2)" 
        class="bg-secondary px-1.5 text-white"
      >
        Envoyer
      </button>
    </div>
  </div>
</template>
