import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  const client = await serverSupabaseClient(event)

  const { data } = await client.from('evenements').select('*')

  return { events: data }
})