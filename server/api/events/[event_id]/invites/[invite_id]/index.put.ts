import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/invites/:invite_id
// exemple api/events/45/invites/23

// invite BODY :
// body: {
//  first_name: '',
//  surname: '',
//  tel: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')
    const invite_id = getRouterParam(event, 'invite_id')

    const { data: invitations, error } = await client
    .from('invitations')
    .update({ 
      first_name: body.first_name,
      surname: body.surname,
      tel: body.tel,
    })
    .eq('id_evenement', event_id)
    .eq('id_invitation', invite_id)
    .select()
  
    if (error) throw new Error("L'invité n'as pas pu étre mis a jour.")
    return (invitations)
  } catch(e) {
    console.log(e);
    return (e)
  }
})
