import { serverSupabaseClient } from '#supabase/server'

// use 
// exemple 

export default eventHandler(async (event) => {
  try {
    const need_id = getRouterParam(event, 'need_id')
    const client = await serverSupabaseClient(event)
    const { error } = await client
    .from('needs')
    .delete()
    .eq('id_need', need_id)
    if (error) throw error
    return true
  } catch (e) {
    console.log(e);
    return (e)
  }
  

})