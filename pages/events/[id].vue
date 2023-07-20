<template>
	<div class="relative grid gap-6">
		<h2>Votre événement</h2>
		<button class="absolute top-0 right-0 btn-secondary w-fit" @click="more = !more">•••</button>
		<div v-if="more" @click="more = false" class="fixed inset-0"></div>
		<div v-if="more" class="absolute right-0 top-10 z-10 bg-app rounded-xl">
			<button disabled class="btn-secondary rounded-b-none">Modifier l'événement</button>
			<button @click="DeleteEvent()" class="btn-secondary-red rounded-t-none">Supprimer l'événement</button>
		</div>
		<div class="grid gap-4">
			<div v-if="messages" class="grid gap-1">
				<p v-for="message in messages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="messages.splice(messages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<div class="bg-white block relative text-black rounded-xl p-2 min-h-[88px]">
				<div v-if="event" class="text-sm grid gap-1">
					<p class="text-base"><span class="font-bold">{{ event.name }}</span> - {{ ReturnFrenchFormatDate(event.date) }} - {{ ReturnFormatedTime(event.time) }}</p>
					<a target="_blank" :href="`http://maps.google.com/?q=${event.address}`" class="underline">{{ event.address }}</a>
					<p v-if="event.invitations" class="text-opacity-70 flex gap-1">
						<span v-if="!event.invitations.length">Aucune personne invité</span>
						<span v-if="event.inviteState.unsend">{{ event.inviteState.unsend }} non invité</span>
						<span v-if="event.inviteState.send">{{ event.inviteState.send }} invités</span>  
						<span v-if="event.inviteState.accepted">{{ event.inviteState.accepted }} comfirmés</span>
						<span v-if="event.inviteState.denied">{{ event.inviteState.denied }} refusés</span>
						<span v-if="event.inviteState.asked">{{ event.inviteState.asked }} demandes</span>
					</p>
				</div>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}/invites`" class="btn-secondary relative">
				Voir la liste des invités
				<span v-if="event && event.inviteState.asked" class="bg-orange text-black w-[16px] h-[16px] absolute -top-1 -right-1 rounded-full text-sm justify-center flex items-center">
					{{ event.inviteState.asked }}
				</span>
			</NuxtLink>
			<div class="grid gap-2">
				<h3 class="font-semibold">Description :</h3>
				<p class="text-sm whitespace-pre-line">{{ event.desc }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="font-semibold">Règlement :</h3>
				<p class="text-sm whitespace-pre-line">{{ event.rules }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="font-semibold">Nécessaire a la soirée :</h3>
				<ul class="grid gap-2 list-disc list-inside">
					<li class="text-sm" v-for="need in event.needs" :key="need">
						{{ need.label }} ({{ need.number }} manquants)
					</li>
				</ul>
			</div>
		</div>
		<NuxtLink class="btn-primary" to="/events">Retour au événements</NuxtLink>
	</div>
</template>

<script>
export default {
	data() {
		return {
			messages: [],
			more: false,
			user: '',
			event: '',
		}
	},
	methods: {
		ReturnFrenchFormatDate(date) {
			const currentDate = new Date(date)
			const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
			return (currentDate.toLocaleDateString('fr-fr', options));
		},
		ReturnFormatedTime(time) {
			let newTime = time.slice(0, 5).replaceAll(':', 'h')
			if (time.slice(3, 5) == '00')
				return (newTime.slice(0, 3))
			return (newTime.slice(0, 5))
		},
		async DeleteEvent() {
			try {
				this.messages = [];
				const supabase = useSupabaseClient();
				const { error } = await supabase
				.from('evenements')
				.delete()
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				navigateTo('/events');
			} catch {
				this.messages.push({ type: 'error', content: 'Une erreur est survenue l\'événement n\'a pas pu étre supprimé.' })
			}
		},
		async GetUser() {
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
			this.GetEvent()
		},
		SetStateOccurence(event) {
			event.inviteState = {};
			event.inviteState.unsend = 0;
			event.inviteState.send = 0;
			event.inviteState.accepted = 0;
			event.inviteState.denied = 0;
			event.inviteState.asked = 0;
			event.invitations.forEach(invitation => {
				if (invitation.id_state == 1)
					event.inviteState.unsend++;
				if (invitation.id_state == 2)
					event.inviteState.send++;
				if (invitation.id_state == 3)
					event.inviteState.accepted++;
				if (invitation.id_state == 4)
					event.inviteState.denied++;
				if (invitation.id_state == 5)
					event.inviteState.asked++;
			});
		},
		async GetEvent() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('evenements')
				// .select("*")
				.select('id_evenement, name, desc, rules, address, date, time, invitations ( id_evenement, id_state ), needs ( id_evenement, label, number )')
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.SetStateOccurence(evenements[0])
				this.event = evenements[0];
			} catch (error) {
			} finally {
			}
		},
	},
	mounted() {
		this.GetUser()
		const user = useSupabaseUser();
		watchEffect(() => {
		if (!user.value)
			navigateTo('/');
		})
	},
}
</script>