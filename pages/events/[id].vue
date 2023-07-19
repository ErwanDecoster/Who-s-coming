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
			<div class="bg-white block relative text-black rounded-xl p-2">
				<div class="text-sm grid gap-1">
					<p class="text-base">{{ event.name }} - {{ event.date }} - {{ event.time }} - <a target="_blank" :href="`http://maps.google.com/?q=${event.address}`" class="underline">{{ event.address }}</a></p>
					<p class="text-opacity-70">
						<span v-if="!invitesStateNb.unsend && !invitesStateNb.send && !invitesStateNb.accepted && !invitesStateNb.denied && !invitesStateNb.asked">Aucune personnes invité</span>
						<span v-if="invitesStateNb.unsend">{{ invitesStateNb.unsend }} non invité</span>
						<span v-if="invitesStateNb.send">- {{ invitesStateNb.send }} invités</span>  
						<span v-if="invitesStateNb.accepted">- {{ invitesStateNb.accepted }} comfirmés</span>
						<span v-if="invitesStateNb.denied">- {{ invitesStateNb.denied }} refusés</span>
						<span v-if="invitesStateNb.asked">- {{ invitesStateNb.asked }} demandes</span>
					</p>
				</div>
			</div>
			<NuxtLink :to="`/events/${$route.params.id}/invites`" class="btn-secondary relative">
				Voir la liste des invités
				<span v-if="invitesStateNb.asked" class="bg-orange text-xs w-[14px] h-[14px] absolute -top-1 -right-1 rounded-full">
					{{ invitesStateNb.asked }}
				</span>
			</NuxtLink>
			<div class="grid gap-2">
				<h3 class="">Description :</h3>
				<p class="text-sm">{{ event.desc }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="">Règlement :</h3>
				<p class="text-sm">{{ event.rules }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="">Nécessaire a la soirée :</h3>
				<p class="text-sm" v-for="need in event.needs" :key="need">{{ need.label }} ({{ need.number }} manquants)</p>
			</div>
		</div>
		<NuxtLink class="btn-primary disabled" to="/events">Retour au événements</NuxtLink>
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
			invitesState: [],
			invitesStateNb: {
				unsend: 0,
				send: 0,
				accepted: 0,
				denied: 0,
				asked: 0,
			},
		}
	},
	methods: {
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
		SetInviteState(state) {
			this.invitesState.forEach(invite => {
				if (invite.id_state == 1)
					this.invitesStateNb.unsend++;
				if (invite.id_state == 2)
					this.invitesStateNb.send++;
				if (invite.id_state == 3)
					this.invitesStateNb.accepted++;
				if (invite.id_state == 4)
					this.invitesStateNb.denied++;
				if (invite.id_state == 5)
					this.invitesStateNb.asked++;
			})
		},
		async GetInvitesState() {
			try {
				const supabase = useSupabaseClient();
				let { data: invitationsState, error } = await supabase
				.from('invitations')
				.select("id_state")
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.invitesState = invitationsState;
				this.SetInviteState()
			} catch (error) {
			} finally {
			}
		},
		async GetUser() {
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
			this.GetEvent()
		},
		async GetNeeds() {
			try {
				const supabase = useSupabaseClient();
				let { data: needs, error } = await supabase
				.from('needs')
				.select("*")
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.event.needs = needs;
			} catch (error) {
			} finally {
			}
		},
		async GetEvent() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('evenements')
				.select("*")
				.eq('id_evenement', this.$route.params.id)
				if (error) throw error
				this.event = evenements[0];
				this.GetNeeds()
				this.GetInvitesState()
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