import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// use api/events/:event_id
// exemple api/events/45

export default eventHandler(async (event) => {
  try {
    const event_id = getRouterParam(event, 'event_id')
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event);
    if (user) {
      const [eventResponse, pictureResponse] = await Promise.all([
        client.from('evenements').select('*, needs (*, need_invitations (count))').eq('id_evenement', event_id).eq('user_id', user?.id),
        client.storage.from('event_picture').getPublicUrl(event_id)
      ])
  
      const eventData = eventResponse.data
      const pictureData = pictureResponse.data
  
      if (!eventData) {
        throw new Error('Impossible de récupérer les données de l\'événement : ' + eventResponse)
      }
      if (!pictureData) {
        throw new Error('Impossible de récupérer les données de l\'image : ' + pictureResponse)
      }
      if (!eventData || !pictureData) {
        throw new Error('Impossible de récupérer les données de l\'événement ou de l\'image.')
      }
  
      const combinedResult = {
        event: {
          ...eventData[0], // Utilisation de la première (et unique) entrée de la réponse de la première requête
        },
        publicUrl: pictureData.publicUrl
      }
      return combinedResult
    }
  } catch (e) {
    console.log(e);
    return (e)
  }
  

})