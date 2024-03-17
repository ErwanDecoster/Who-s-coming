import { serverSupabaseClient } from '#supabase/server'

// use api/events/:event_id/:need_id
// exemple api/events/45/12

export default eventHandler(async (event) => {
  try {
    const event_id = getRouterParam(event, 'event_id')
    const need_id = getRouterParam(event, 'need_id')
    const client = await serverSupabaseClient(event)

    const needResponse = await client.from('needs').select('*, need_invitations (*, invitation:invitations (*))').eq('id_evenement', event_id).eq('id_need', need_id)
    const needData = needResponse.data

    if (!needData) {
      throw new Error('Impossible de récupérer le besoin')
    }

    const result = {
      ...needData[0]
    }
    return result
  } catch (e) {
    console.log(e);
    return (e)
  }
  

})