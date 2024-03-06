import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const event_id = getRouterParam(event, 'event_id')
  const client = await serverSupabaseClient(event)

  const [eventResponse, pictureResponse] = await Promise.all([
    client.from('evenements').select('*').eq('id_evenement', event_id),
    client.storage.from('event_picture').getPublicUrl(event_id)
  ])

  const eventData = eventResponse.data
  const pictureData = pictureResponse.data

  // Assurez-vous que les données sont définies
  if (!eventData || !pictureData) {
    throw new Error('Impossible de récupérer les données de l\'événement ou de l\'image.')
  }

  // Combiner les résultats des deux requêtes
  const combinedResult = {
    event: {
      ...eventData[0], // Utilisation de la première (et unique) entrée de la réponse de la première requête
      publicUrl: pictureData.publicUrl
    }
  }

  return combinedResult
})