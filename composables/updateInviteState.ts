export default async function (eventId: number, inviteId: number, newState: number) {
  if (newState) {
    try {
      const data = await $fetch(`/api/events/${eventId}/invites/${inviteId}/update-state`, {
        method: 'put',
        body: {
          id_state: newState,
        },
      })
      if (data != true) throw new Error
      return (data)
    } catch (error) {
      console.log(error);
    }
  }
}