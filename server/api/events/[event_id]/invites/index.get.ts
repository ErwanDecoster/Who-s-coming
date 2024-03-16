import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/invites
// exemple api/events/45/invites

export default eventHandler(async (event) => {
  try {
    const event_id = getRouterParam(event, 'event_id')
    const client = await serverSupabaseClient(event)

    const invitesResponse = await client.from('invitations').select('*').eq('id_evenement', event_id)
    const invitesData = invitesResponse.data

    if (!invitesData) {
      throw new Error('Impossible de récupére les invités.')
    }

    // function compareStateChangeDate(a, b) {
    //   if (a.state_change_date < b.state_change_date) {
    //     return 1;
    //   }
    //   if (a.state_change_date > b.state_change_date) {
    //     return -1;
    //   }
    //   return 0;
    // }

    // function compareIdInvitationAsker(a, b) {
    //   if (a.id_invitation_asker < b.id_invitation_asker) {
    //     return -1;
    //   }
    //   if (a.id_invitation_asker > b.id_invitation_asker) {
    //     return 1;
    //   }
    //   return 0;
    // }

    function compareInvites(a, b) {
      if (a.id_invitation_asker < b.id_invitation_asker) {
        return -1;
      }
      if (a.id_invitation_asker > b.id_invitation_asker) {
        return 1;
      }
      if (a.state_change_date < b.state_change_date) {
        return -1;
      }
      if (a.state_change_date > b.state_change_date) {
        return 1;
      }
      return 0;
    }

    let invitesByState = {}

    invitesData.sort(compareInvites)
    // invitesData.sort(compareIdInvitationAsker)

    invitesData.forEach(invite => {
      if (!invitesByState.hasOwnProperty(invite.id_state)) {
        // Si la clé n'existe pas, créer un tableau vide pour stocker les invités avec cet id_state
        invitesByState[invite.id_state] = [];
      }
      if (invite.id_invitation_asker) {
        let askedBy = invitesData.find(row => row.id_invitation === invite.id_invitation_asker)
        invite.asked_by = askedBy
      }
      invitesByState[invite.id_state].push(invite);
    })

    const result = {
      invitesByState: {
        ...invitesByState
      }
    }
    return result
  } catch (e) {
    console.log(e);
    return (e)
  }


})