import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/needs/:need_id
// exemple api/events/45/needs/23

// NEED BODY :
// body: {
//  id_state: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')
    const invite_id = getRouterParam(event, 'invite_id')
    
    const { data: evenements, error } = await client
    .from('invitations')
    .update({ 
      id_state: body.id_state,
      state_change_date: new Date,
    })
    .eq('id_evenement', event_id)
    .eq('id_invitation', invite_id)
    .select()
    console.log(error);
    
    if (error) throw error
    return true
  } catch(e) {
    console.log(e);
    console.log('e');
    return (e)
  }
})
