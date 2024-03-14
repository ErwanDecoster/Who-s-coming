import { serverSupabaseClient } from '#supabase/server'

// use api/events/event
// exemple api/events/event

// NEED BODY :
// body: {
//   name: '',
//   address: '',
//   datetime: '',
//   desc: '',
//   rules: '',
// },

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { data: evenements, error } = await client.from('evenements')
    .insert([
      {
        name: body.name,
        address: body.address,
        datetime: body.datetime,
        desc: body.desc,
        rules: body.rules,
      }
    ]).select()
    if (error) throw new Error("L'événement n'as pas pu étre ajouté.")
    return (evenements)
  } catch(e) {
    console.log(e);
    return (e)
  }
})
