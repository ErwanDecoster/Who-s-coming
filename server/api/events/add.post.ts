import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (form) => {
  try {
    const client = await serverSupabaseClient(form)
    const body = await readBody(form)
    const event = await client.from('evenements')
    .insert([
      {
        name: body.name,
        address: body.address,
        datetime: body.datetime,
        desc: body.desc,
        rules: body.rule,
      }
    ]).select()
    return (event)
  } catch(e) {
    console.log(e);
    return (e)
  }
})


// try {
//   const supabase = useSupabaseClient();
//   const { data, error } = await supabase
//   .from('evenements')
//   .insert([
//     {
//       name: this.form.name,
//       date: this.form.date,
//       time: this.form.time,
//       address: this.form.address,
//       desc: this.form.desc,
//       rules: this.form.rules,
//       user_id: this.user.id,
//     },
//   ]).select()
//   if (error) throw error
//   eventId = data[0].id_evenement;
//   this.eventId = eventId;
//   this.form.name = '';
//   this.form.date = '';
//   this.form.time = '';
//   this.form.address = '';
//   this.form.desc = '';
//   this.form.rules = '';
//   this.formMessages.push({ type: 'succes', content: 'L\'événement a bien été créé.' })
//   if (this.form.needs.length == 0)
//     navigateTo(`/events/${eventId}`);
//   this.form.needs.forEach(need => {
//     this.SaveNeeds(need, eventId);
//   })
// } catch (error) {
//   this.formMessages.push({ type: 'error', content: 'Une erreur est survenue l\'événement ne pas été créé.' })
// } finally {
// }