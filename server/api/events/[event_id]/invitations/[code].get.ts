import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/invites/getByCode:invite_code
// exemple api/events/45/invites/getByCode-12

export default eventHandler(async (event) => {
  try {
    const event_id = getRouterParam(event, 'event_id')
    const invite_code = getRouterParam(event, 'code')
    const client = await serverSupabaseClient(event)
    // const body = await readBody(event)

    const inviteResponse = await client.from('invitations')
      .select('id_invitation, id_invitation_asker, first_name, surname, code, need_invitations (need:needs (id_need)), asked_for:invitations (id_invitation, id_state, first_name, surname)')
      .eq('id_evenement', event_id).eq('code', invite_code)
    const inviteData = inviteResponse.data

    if (!inviteData) {
      throw new Error("Impossible de récupérer l'invité.")
      // return inviteResponse
      // throw new Error(inviteResponse)
    }

    // let askerInviteData = {}
    // if (inviteData[0].id_invitation_asker) {
    //   const askerInviteResponse = await client.from('invitations')
    //     .select('first_name, surname, id_invitation').eq('id_evenement', event_id).eq('id_invitation', inviteData[0].id_invitation_asker)
    //   askerInviteData = askerInviteResponse.data
    // }

    // let askedInvitesByState = {}

    // inviteData[0].asked_for.forEach(asker_invite => {
    //   if (!askedInvitesByState.hasOwnProperty(asker_invite.id_state)) {
    //     askedInvitesByState[asker_invite.id_state] = [];
    //   }
    //   askedInvitesByState[asker_invite.id_state].push(asker_invite);
    // })
    // delete inviteData[0].asked_for
    const result = {
      invite: {
        ...inviteData[0]
      },
      // asked_invites_by_state: {
      //   ...askedInvitesByState
      // },
      // asker_invite: {
      //   ...askerInviteData[0]
      // },
    }
    return result
  } catch (e) {
    console.log(e);
    return (e)
  }
})