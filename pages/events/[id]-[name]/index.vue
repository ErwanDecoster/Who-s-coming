<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const title = "Événement - Who's coming - Organisateur d'évènements";
const desc = "Consultez les détails de l'événement, y compris la liste des invités, l'adresse, la date et l'heure, la description, le règlement et les besoins."
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

const isImageAccessible = ref<boolean>(false)
const messages = ref<Array<Message>>([])

const { data } = await useFetch(
	`/api/events/${route.params.id}`,
	{
		transform: (data: any) => {
			return {
				event: {
					id_evenement: data.event.id_evenement,
					name: data.event.name,
					address: data.event.address,
					desc: data.event.desc,
					rules: data.event.rules,
					datetime: data.event.datetime,
					needs: data.event.needs.map((need: need) => ({
						id_need: need.id_need,
						label: need.label,
						min_required_number: need.min_required_number,
						actual_number: need.need_invitations[0].count
					}))
				},
				publicUrl: data.publicUrl,
				fetchedAt: new Date(),
			}
		},
		getCachedData(key, nuxtApp) {
			const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
			if (!data) {
				return 
			}
			const espirationDate = new Date(data.fetchedAt)
			espirationDate.setTime(espirationDate.getTime() + 120 * 1000)
			if (espirationDate.getTime() < Date.now()) {
				return
			}
			const localStorageRefresh = localStorage.getItem("refresh")
			if (localStorageRefresh) {
				let refreshDatas = JSON.parse(localStorageRefresh)
				const toFind = `event-${route.params.id}`
				if (refreshDatas.includes(toFind)) {
					refreshDatas = refreshDatas.filter((refreshData: string) => refreshData !== toFind)
					localStorage.setItem('refresh', JSON.stringify(refreshDatas))
					return
				}
			}
		},
	}
)
if (data.value && data.value.publicUrl) {
	const imageExists = await fetch(data.value.publicUrl)
	isImageAccessible.value = imageExists.ok
}
</script>

<template>
	<div class="container">
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
		<template v-if="data?.event">
			<h3>{{ data.event.name }}</h3>
			<img v-if="isImageAccessible && data.publicUrl" :src="data.publicUrl" alt="">
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}/invites`" class="secondary">Liste des invités</NuxtLink>
			<div class="grid gap-1">
				<p>Adresse postale :</p>
				<p v-if="data.event.address" class="text-black-300">{{ data.event.address }}</p>
				<p v-else class="text-black-300">Aucune adresse configuré.</p>
			</div>
			<div class="grid gap-1">
				<p>Date et heure :</p>
				<p v-if="data.event.datetime" class="text-black-300">{{ formatDate(new Date(data.event.datetime)) }}</p>
			</div>
			<div class="grid gap-1">
				<p>Description :</p>
				<p v-if="data.event.desc" class="text-black-300 whitespace-pre-line">{{ data.event.desc }}</p>
				<p v-else class="text-black-300">Aucune description configuré.</p>
			</div>
			<div class="grid gap-1">
				<p>Règlement :</p>
				<p v-if="data.event.rules" class="text-black-300 whitespace-pre-line">{{ data.event.rules }}</p>
				<p v-else class="text-black-300">Aucune règlement configuré.</p>
			</div>
			<div class="grid gap-1">
				<p>Besoins : </p>
				<div class="grid gap-1" v-if="data.event.needs.length">
					<NuxtLink 
						v-for="(need, index) in data.event.needs" 
						:key="need.id_need"
						:to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}/needs/${need.id_need}`" 
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.event.needs.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300 first-letter:uppercase">{{ need.label }}</p>
						<p class="text-base text-black-300">{{ need.actual_number }} / {{ need.min_required_number }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun besoin ajouté.</p>
				<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}/needs/new-need`" class="secondary">Ajouter un besoin</NuxtLink>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name.toString())}/edit`" class="primary">Modifier</NuxtLink>
		</template>
	</div>
</template>
