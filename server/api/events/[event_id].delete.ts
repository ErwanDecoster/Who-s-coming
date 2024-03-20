import { serverSupabaseClient } from '#supabase/server'

// use 
// exemple 

export default eventHandler(async (event) => {
  try {
    const event_id = getRouterParam(event, 'event_id')
    const client = await serverSupabaseClient(event)
    const { error } = await client
    .from('evenements')
    .delete()
    .eq('id_evenement', event_id)
    if (error) throw error
    return true
  } catch (e) {
    console.log(e);
    return (e)
  }
})