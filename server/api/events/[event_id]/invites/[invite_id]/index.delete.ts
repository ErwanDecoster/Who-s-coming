import { serverSupabaseClient } from '#supabase/server'

// use 
// exemple 

export default eventHandler(async (event) => {
  try {
    const invite_id = getRouterParam(event, 'invite_id')
    const client = await serverSupabaseClient(event)
    const { error } = await client
    .from('invitations')
    .delete()
    .eq('id_invitation', invite_id)
    if (error) throw error
    return true
  } catch (e) {
    console.log(e);
    return (e)
  }
})