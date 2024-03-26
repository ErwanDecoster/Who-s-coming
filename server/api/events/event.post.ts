import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

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
    const user = await serverSupabaseUser(event);
    if (user) {
      const { data: evenements, error } = await client.from('evenements')
      .insert([
        {
          name: body.name.trimEnd(),
          address: body.address.trimEnd(),
          datetime: body.datetime,
          desc: body.desc.trimEnd(),
          rules: body.rules.trimEnd(),
          user_id: user?.id,
        }
      ]).select()
      if (error) throw error
      // if (error) throw new Error("L'événement n'as pas pu étre ajouté.")
      return (evenements)
    }
  } catch(e) {
    console.log(e);
    return (e)
  }
})
