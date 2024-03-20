import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/need
// exemple api/events/45/need

// NEED BODY :
// body: {
//   label: '',
//   min_required_number: '',
//   max_number: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')
    const { data: evenements, error } = await client.from('needs')
    .insert([
      {
        id_evenement: event_id,
        label: body.label.trimEnd(),
        min_required_number: body.min_required_number,
        max_number: body.max_number,
      }
    ]).select()
    if (error) throw new Error("Le besoin n'as pas pu étre ajouté.")
    return (evenements)
  } catch(e) {
    console.log(e);
    return (e)
  }
})