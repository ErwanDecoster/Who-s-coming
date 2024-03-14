export default async function (eventId: number, inviteId: number, newState: number) {
  if (newState) {
    try {
      const error = await $fetch(`/api/events/${eventId}/invites/${inviteId}`, {
        method: 'put',
        body: {
          id_state: newState,
        },
      })
      if (error) throw error
    } catch (error) {
      console.log(error);
    }
  }
}