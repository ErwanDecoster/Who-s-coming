import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/invites
// exemple api/events/45/invites

// invite BODY :
// body: {
//   first_name: '',
//   surname: '',
//   tel: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')
    const { data: evenements, error } = await client.from('invitations')
    .insert([
      {
        id_evenement: event_id,
        first_name: body.first_name.trimEnd(),
        surname: body.surname.trimEnd(),
        tel: body.tel,
        code: Date.now().toString(36).slice(-6).toUpperCase().padStart(6, '0'),
      }
    ])
    if (error) throw error
    return true
  } catch(e) {
    console.log(e);
    return (e)
  }
})