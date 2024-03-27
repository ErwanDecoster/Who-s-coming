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

let messages = ref<Array<Message>>([])
let events:  event[];
try {
	events = await $fetch(`/api/events/`, {})
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
		<p v-if="!events || !events.length">Aucun événement pour le moment.</p>
		<NuxtLink 
			v-for="event in events" 
			:key="event.id_evenement" 
			:to="`/events/${event.id_evenement}-${toSlug(event.name)}`" 
			class="secondary"
		>
			{{ event.name }}
		</NuxtLink>
		<NuxtLink to="/events/new-event" class="primary">Nouvel événement</NuxtLink>
	</div>
</template>
