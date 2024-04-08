<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Mes événements - Who's coming - Organisateur d'évènements";
const desc = "Explorez et gérez vos événements sur Who's coming. Consultez les détails de vos événements passés et à venir, ainsi que les listes d'invités."
const img = runtimeConfig.public.siteUrl + "/images/minia.png"
const url = runtimeConfig.public.siteUrl + route.path
useHead({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: url,
    },
  ],
})
useSeoMeta({
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogUrl: url,
  ogType: 'article',
  ogImage: img,
  twitterCard: 'summary_large_image',
  twitterSite: '@erwan_decoster',
  twitterCreator: '@erwan_decoster',
  twitterTitle: title,
  twitterDescription: desc,
  twitterImage: img,
})

const groupEventsByDateAndMonth = (events: event[]) => {
  const groupedEvents: any = {};
  events.forEach(event => {
    const eventDate = new Date(event.datetime);
    const yearMonth = eventDate.toLocaleString('default', { month: 'long' }) + ' ' + eventDate.getFullYear();
    if (!groupedEvents[yearMonth]) {
      groupedEvents[yearMonth] = [];
    }
    groupedEvents[yearMonth].push(event);
  });
  return groupedEvents;
};
 

let messages = ref<Array<Message>>([])
let eventsGroupedByDateAndMonth: any
try {
	const { data: events } = await useFetch(
		`/api/events/`,
		{
			transform: (events: event[]) => {
				return events.map((event) => ({
					id_evenement: event.id_evenement,
					name: event.name,
					datetime: event.datetime,
				}))
			}
		}
	)
	eventsGroupedByDateAndMonth = groupEventsByDateAndMonth(events.value);
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `Vos évènements non pas pu etre recuperé.`})
}
</script>

<template>
	<div class="container">
		<h3>Mes événements</h3>
		<ul v-if="messages.length">
			<li 
				v-for="message in messages" 
				:key="message.type"
				class="bg-black rounded-lg py-1 px-4 text-white bg-opacity-85"
				:class="[
					{ 'bg-red': message.type === 'error'},
					{ 'bg-green': message.type === 'success'}
				]"
			>
				{{ message.content }}
			</li>
		</ul>
		<p v-if="!eventsGroupedByDateAndMonth">Aucun événement pour le moment.</p>
		<div class="grid gap-2">
			<div 
				v-for="(eventsOfMonth, month) in eventsGroupedByDateAndMonth" 
				:key="month"
				class="grid gap-1"
			>
				<h4 class="first-letter:uppercase">{{ month }}</h4>
				<NuxtLink 
					v-for="event in eventsOfMonth" 
					:key="event.id_evenement" 
					:to="`/events/${event.id_evenement}-${toSlug(event.name)}`" 
					class="secondary"
				>
					{{ event.name }}
				</NuxtLink>
			</div>
		</div>
		<NuxtLink to="/events/new-event" class="primary">Nouvel événement</NuxtLink>
	</div>
</template>
