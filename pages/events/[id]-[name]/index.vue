<script setup lang="ts">
const route = useRoute()

let messages = ref<Array<Message>>([])
let data: {
	event: event;
	publicUrl: string;
}
try {
	data = await $fetch(`/api/events/${route.params.id}`, {})
} catch (e) {
	console.error(e);
	messages.value.push({type: 'error', content: `L'évènement : "${route.params.name}" id : ${route.params.id} na pas pu etre recuperé.`})
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
			<img v-if="data.publicUrl" :src="data.publicUrl" alt="">
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/invites`" class="secondary">Liste des invités</NuxtLink>
			<div class="grid gap-1">
				<p>Adresse postale :</p>
				<p v-if="data.event.address" class="text-black-300">{{ data.event.address }}</p>
				<p v-else class="text-black-300">Aucune adresse configuré.</p>
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
						:to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/${need.id_need}`" 
						:class="[
							{ 'rounded-tr-lg hover:rounded-tr-xl': index === 0},
							{ 'rounded-bl-lg hover:rounded-bl-xl': index === data.event.needs.length - 1}
						]"	
						class="leaf flex justify-between rounded-sm"
					>
						<p class="text-base text-black-300 first-letter:uppercase">{{ need.label }}</p>
						<p class="text-base text-black-300"> / {{ need.min_required_number }}</p>
					</NuxtLink>
				</div>
				<p v-else class="text-base text-black-300">Aucun besoin ajouté.</p>
				<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/needs/new-need`" class="secondary">Ajouter un besoin</NuxtLink>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}/edit`" class="primary">Modifier</NuxtLink>
		</template>
	</div>
</template>
