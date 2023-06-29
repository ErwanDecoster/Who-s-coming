<template>
	<div class="grid gap-6 relative">
		<h2>Invitation {{ invite.first_name }} {{ invite.surname }}</h2>
		<div class="grid gap-4">
			<div class="bg-white block relative text-black rounded-xl p-2">
				<div class="text-sm grid gap-1">
					<p class="text-base">{{ event.name }} - {{ event.date }} - {{ event.time }} - <span class="underline">{{ event.address }}</span></p>
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
			<NuxtLink :to="`/events/${$route.params.id_event}/invites`" class="btn-secondary">Voir la liste des invité</NuxtLink>
			<div class="grid gap-2">
				<h3 class="text-sm">Description :</h3>
				<p class="text-xs">{{ event.desc }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="text-sm">Règlement :</h3>
				<p class="text-xs">{{ event.rules }}</p>
			</div>
			<div class="grid gap-2">
				<h3 class="text-sm">Nécessaire a la soirée :</h3>
				<div v-for="need in event.needs" class="flex items-center gap-2">
					<input type="checkbox" name="" :id="need.id_need" :disabled="need.number == 0" class="delete-selection h-4 w-4">
					<label :for="need.id_need" class="text-xs">
						{{ need.label }} ({{ need.number }} manquants)
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			more: false,
			user: 0,
			event: '',
			invite: '',
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
				.eq('id_evenement', this.$route.params.id_event)
				if (error) throw error
				this.invitesState = invitationsState;
				this.SetInviteState()
			} catch (error) {
			} finally {
			}
		},
		async GetNeeds() {
			try {
				const supabase = useSupabaseClient();
				let { data: needs, error } = await supabase
				.from('needs')
				.select("*")
				.eq('id_evenement', this.$route.params.id_event)
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
				.eq('id_evenement', this.$route.params.id_event)
				if (error) throw error
				this.event = evenements[0];
				this.GetNeeds();
			} catch (error) {
			} finally {
			}
		},
		async GetInvite() {
			try {
				const supabase = useSupabaseClient();
				let { data: invitation, error } = await supabase
				.from('invitations')
				.select("*")
				.eq('code', this.$route.params.id)
				if (error) throw error
				localStorage.code = invitation[0].code
				this.invite = invitation[0];
			} catch (error) {
				console.log('c');
			} finally {
			}
		},
		async GetUser(){
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
		},
	},
	mounted() {
		const user = useSupabaseUser();
		watchEffect(() => {
			if (user.value)
				navigateTo('/');
		})
		this.GetEvent()
		this.GetInvite()
		this.GetUser();
		this.GetInvitesState()
	},
}
</script>