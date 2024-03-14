import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/needs/:need_id
// exemple api/events/45/needs/23

// NEED BODY :
// body: {
//  label: '',
//  min_required_number: '',
//  max_number: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')
    const need_id = getRouterParam(event, 'need_id')


    const { data: evenements, error } = await client
    .from('needs')
    .update({ 
      label: body.label,
      min_required_number: body.min_required_number,
      max_number: body.max_number,
    })
    .eq('id_evenement', event_id)
    .eq('id_need', need_id)
    .select()
  
    if (error) throw new Error("Le besoin n'as pas pu étre mis a jour.")
    return (evenements)
  } catch(e) {
    console.log(e);
    return (e)
  }
})
