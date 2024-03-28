import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event);
    if (user) {
      const eventsResponse = await client.from('evenements').select('id_evenement, name, datetime').eq('user_id', user?.id)
      const eventsData = eventsResponse.data

      if (!eventsData) {
        throw new Error('Impossible de récupérer les événements.')
      }

      return eventsData
    }
  } catch (e) {
    console.log(e);
    return (e)
  }
})
