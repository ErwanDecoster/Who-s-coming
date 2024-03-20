import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id
// exemple api/events/45

// NEED BODY :
// body: {
//   name: '',
//   address: '',
//   datetime: '',
//   desc: '',
//   rule: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const event_id = getRouterParam(event, 'event_id')


    const { data: evenements, error } = await client
    .from('evenements')
    .update({ 
      name: body.name.trimEnd(),
      address: body.address.trimEnd(),
      datetime: body.datetime,
      desc: body.desc.trimEnd(),
      rules: body.rules.trimEnd(),
      invite_message: body.invite_message.trimEnd(),
    })
    .eq('id_evenement', event_id)
    .select()
  
    if (error) throw new Error("L'événement n'as pas pu étre mis a jour.")
    return (evenements)
  } catch(e) {
    console.log(e);
    return (e)
  }
})
