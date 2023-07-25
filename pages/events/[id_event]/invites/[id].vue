<template>
	<div v-if="invite.id_invitation" class="grid gap-6 relative">
		<h2>Invitation {{ invite.first_name }} {{ invite.surname }}</h2>
		<div class="grid gap-4">
			<div v-if="messages.length" class="grid gap-1">
				<p v-for="message in messages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' , 'bg-white text-black': message.type == 'message' }"
					@click="messages.splice(messages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<div class="bg-white block relative text-black rounded-xl p-2">
				<div v-if="event" class="text-sm grid gap-1">
					<p class="text-base"><span class="font-bold">{{ event.name }}</span> - {{ ReturnFrenchFormatDate(event.date) }} - {{ ReturnFormatedTime(event.time) }}</p>
					<a target="_blank" :href="`http://maps.google.com/?q=${event.address}`" class="underline">{{ event.address }}</a>
					<p class="text-opacity-70 flex gap-1">
						<span v-if="!event.inviteState.unsend && !event.inviteState.send && !event.inviteState.accepted && !event.inviteState.denied && !event.inviteState.asked">Aucune personne invité</span>
						<span v-if="event.inviteState.unsend">{{ event.inviteState.unsend }} non invité</span>
						<span v-if="event.inviteState.send">{{ event.inviteState.send }} invités</span>  
						<span v-if="event.inviteState.accepted">{{ event.inviteState.accepted }} comfirmés</span>
						<span v-if="event.inviteState.denied">{{ event.inviteState.denied }} refusés</span>
						<span v-if="event.inviteState.asked">{{ event.inviteState.asked }} demandes</span>
					</p>
				</div>
			</div>
			<NuxtLink :to="`/events/${$route.params.id_event}/invites`" class="btn-secondary">Voir la liste des invité</NuxtLink>
			<div v-if="invite.id_state == 2 || invite.id_state == 4" class="grid gap-4">
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
					<div v-for="need in event.needs" class="flex items-center gap-2">
						<input type="checkbox" name="" :id="need.id_need" :disabled="need.number == 0" :checked="need.need_invitations.findIndex(need_invitation => need_invitation.id_invitation == invite.id_invitation) != -1" class="need-selection h-4 w-4 self-start mt-0.5">
						<label :for="need.id_need" class="text-sm">
							{{ need.label }} ({{ need.number - need.need_invitations.length }} manquants sur {{need.number  }})
							<ol class="ml-4 list-inside">
							<li v-for="need_invitation in need.need_invitations" :key="need_invitation">
								- 
								{{ GetInvitationForNeedInvitation(need_invitation).first_name }}
								{{ GetInvitationForNeedInvitation(need_invitation).surname }}
							</li>
						</ol>
						</label>
					</div>
				</div>
				<button @click="AccepteInvitation()" class="btn-primary">Accepter l'invitation</button>
			</div>
			<div v-if="invite.id_state == 3" class="grid gap-4">
				<p class="my-8 mx-4">Parfait, ton invitation est bien noté comme acceptée, enregistre bien la date !</p>
				<!-- <button @click="" class="btn-primary">Ajouter au calendrier</button> -->
			</div>
		</div>
		<button v-if="invite.id_state == 3" @click="popup.addInvite = true" class="btn-secondary">Demander l'ajout d'un invité</button>
		<button v-if="invite.id_state == 3 || invite.id_state == 2" @click="ChangeInviteState(4)" class="btn-secondary-red">Décliner l'invitation</button>
		<Popup v-if="popup.addInvite" @close="popup.addInvite = false">
			<p class="text-2xl text-center">Demande d'ajout d'invité</p>
			<div class="grid gap-1" :class="{ 'hidden': popup.formMessages.length == 0 }">
				<p v-for="message in popup.formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="popup.formMessages.splice(popup.formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<form class="grid gap-4" @submit.prevent="AddInviteToEvent()" action="">
				<div class="grid gap-2">
					<label for="add_invite_first_name">Prénom :</label>
					<input v-model="popup.form.firstName" type="text" name="add_invite_first_name" id="add_invite_first_name">
				</div>
				<div class="grid gap-2">
					<label for="add_invite_surname">Nom :</label>
					<input v-model="popup.form.surname" type="text" name="add_invite_surname" id="add_invite_surname">
				</div>
				<div class="grid gap-2">
					<label for="add_invite_tel">Tél :</label>
					<input v-model="popup.form.tel" type="tel" name="add_invite_tel" id="add_invite_tel">
				</div>
				<div class="grid gap-2">
					<label for="add_invite_relationship">Relation (petit amis, amis...) :</label>
					<textarea v-model="popup.form.relationship" type="tel" name="add_invite_relationship" id="add_invite_relationship"></textarea>
				</div>
				<input class="btn-primary" type="submit" value="Ajouter">
			</form>
		</Popup>
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
			messages: [],
			invitesStateNb: {
				unsend: 0,
				send: 0,
				accepted: 0,
				denied: 0,
				asked: 0,
			},
			popup: {
				formMessages: [],
				addInvite: false,
				form: {
					firstName: '',
					surname: '',
					tel: '',
					relationship: '',
				}
			},
		}
	},
	methods: {
		GetInvitationForNeedInvitation(need_invitation) {
			return (this.event.invitations[this.event.invitations.findIndex(invitation => invitation.id_invitation == need_invitation.id_invitation)])
		},
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
		async AccepteInvitation() {
			this.ChangeInviteState(3)
			const inputs = document.querySelectorAll('input.need-selection')
			inputs.forEach(input => {
				console.log(input);
				if (input.checked)
				{
					this.CheckNeedInvitation(input.id).then((nb) => {
						if (nb == 0) {
							this.AddNeedInvitation(input.id);
						}
					})
				} else {
					this.DeleteNeedInvitation(input.id)
				}
			})
		},
		async CheckNeedInvitation(id_need) {
			const supabase = useSupabaseClient();
			const { data, error } = await supabase
			.from('need_invitations')
			.select('id', { count: 'exact' })
			.eq('id_invitation', this.invite.id_invitation)
			.eq('id_need', id_need)
			return Promise.resolve(data.length);
		},
		async AddNeedInvitation(id_need) {
			try {
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('need_invitations')
				.insert([
					{ 
						id_invitation: this.invite.id_invitation,
						id_need: id_need,
					},
				])
				if (error) throw error
				const need = this.event.needs[this.event.needs.findIndex(need => need.id_need == id_need)]
				need.need_invitations.push({
					id_need: id_need,
					id_invitation: this.invite.id_invitation,
				})
			} catch {
			}
		},
		async DeleteNeedInvitation(id_need) {
			try {
				const supabase = useSupabaseClient();
				const { error } = await supabase
				.from('need_invitations')
				.delete()
				.eq('id_invitation', this.invite.id_invitation)
				.eq('id_need', id_need)
				if (error) throw error
				const needs = this.event.needs[this.event.needs.findIndex(need => need.id_need == id_need)];
				console.log('needs', needs);
				const need_invitation = needs.need_invitations[needs.need_invitations.findIndex(need_invitation => need_invitation.id_invitation == this.invite.id_invitation)]
				console.log('need_invitation', need_invitation);
				needs.need_invitations.splice(need_invitation, 1); 
			} catch {
			}
		},
		async ChangeInviteState(newState)
		{
			try {
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('invitations')
				.update({ id_state: newState })
				.eq('id_invitation', this.invite.id_invitation)
				.select()
				if (newState == 4)
				{
					this.event.needs.forEach(need => {
						this.DeleteNeedInvitation(need.id)
					})
				}
				if (error) throw error
				// this.GetInvitesState()
				// this.SetInviteState()
				// this.event.
				this.invite.id_state = newState
				this.messages = [];
				this.AddMessageInviteStatu(newState)
			} catch (error) {
					this.messages.push({ type: 'error', content: 'Une erreur est survenue le status de votre invitation n\'a pas pu étre mis a jour.' })
			} finally {
			}
		},
		AddMessageInviteStatu(state) {
			if (state == 1)
				console.debug("\'invitation est marqué comme non envoyé.");
			if (state == 3) 
				this.messages.push({ type: 'succes', content: 'Votre invitation est marqué comme accepté.' })
			if (state == 4)
				this.messages.push({ type: 'warning', content: 'Votre invitation est marqué comme decliné.' })
			if (state == 5)
				this.messages.push({ type: 'warning', content: 'Votre invitation n\'a pas encore etait validé par l\'organisateur. Revenez plus tard !' })
			if (state == 6)
				this.messages.push({ type: 'warning', content: 'Votre invitation n\'a malheuresement pas etait validé par l\'organisateur.' })
		},
		SetInviteState() {
			this.event.inviteState = {};
			this.event.inviteState.unsend = 0;
			this.event.inviteState.send = 0;
			this.event.inviteState.accepted = 0;
			this.event.inviteState.denied = 0;
			this.event.inviteState.asked = 0;
			this.event.invitations.forEach(invitation => {
				if (invitation.id_state == 1)
					this.event.inviteState.unsend++;
				if (invitation.id_state == 2)
					this.event.inviteState.send++;
				if (invitation.id_state == 3)
					this.event.inviteState.accepted++;
				if (invitation.id_state == 4)
					this.event.inviteState.denied++;
				if (invitation.id_state == 5)
					this.event.inviteState.asked++;
			});
		},
		// async GetInvitesState() {
		// 	try {
		// 		const supabase = useSupabaseClient();
		// 		let { data: invitationsState, error } = await supabase
		// 		.from('invitations')
		// 		.select("id_state")
		// 		.eq('id_evenement', this.$route.params.id_event)
		// 		if (error) throw error
		// 		this.invitesState = invitationsState;
		// 		this.SetInviteState()
		// 	} catch (error) {
		// 	} finally {
		// 	}
		// },
		// async GetNeeds() {
		// 	try {
		// 		const supabase = useSupabaseClient();
		// 		let { data: needs, error } = await supabase
		// 		.from('needs')
		// 		.select("*")
		// 		.eq('id_evenement', this.$route.params.id_event)
		// 		if (error) throw error
		// 		this.event.needs = needs;
		// 	} catch (error) {
		// 	} finally {
		// 	}
		// },
		// async GetEvent() {
		// 	try {
		// 		const supabase = useSupabaseClient();
		// 		let { data: evenements, error } = await supabase
		// 		.from('evenements')
		// 		.select("*")
		// 		.eq('id_evenement', this.$route.params.id_event)
		// 		if (error) throw error
		// 		this.event = evenements[0];
		// 		this.GetNeeds();
		// 	} catch (error) {
		// 	} finally {
		// 	}
		// },
		async GetEvent() {
			try {
				const supabase = useSupabaseClient();
				let { data: evenements, error } = await supabase
				.from('evenements')
				.select('id_evenement, name, desc, rules, address, date, time, invitations ( id_evenement, id_invitation, first_name, surname, tel, id_state, code ), needs ( id_evenement, id_need, label, number, need_invitations ( id_need, id_invitation ))')
				.eq('id_evenement', this.$route.params.id_event)
				// .eq('invitations.code', this.$route.params.id)
				.neq('invitations.id_state', 5)
				.order('id_state', { foreignTable: 'invitations', ascending: true })
				if (error) throw error
				this.event = evenements[0];
				this.SetInvite()
				this.SetInviteState()
			} catch (error) {
			} finally {
			}
		},
		async SaveInvite() {
			try {
				const supabase = useSupabaseClient();
				const code = Math.floor(Math.random() * 10000000).toString(16)
				const { data, error } = await supabase
				.from('invitations')
				.insert([
					{ 
						id_evenement: this.$route.params.id_event,
						first_name: this.popup.form.firstName,
						surname: this.popup.form.surname,
						tel: this.popup.form.tel,
						relationship: this.popup.form.relationship,
						id_invitation_asker: this.invite.id_invitation,
						id_state: 5,
						code: code,
					},
				])
				if (error) throw error
				this.popup.formMessages.push({ type: 'succes', content: 'La demande d\'invité a bien été ajouté a l\'événement.' })
				this.popup.addInvite = false;
			} catch (error) {
				this.popup.formMessages.push({ type: 'error', content: 'Une erreur est survenue la demande d\'invité n\'a pas pu étre ajouté a l\'événement.' })
			}
		},
		CheckForm()
		{
			this.popup.formMessages = []
			if (!this.popup.form.firstName)
			this.popup.formMessages.push({type: 'error', content: 'Le champ "Prénom" est requis.'})
			if (!this.popup.form.surname)
				this.popup.formMessages.push({type: 'error', content: 'Le champ "Nom" est requis.'})
			if (!this.popup.form.tel)
				this.popup.formMessages.push({type: 'error', content: 'Le champ "Tél" est requis.'})
				else if (this.popup.form.tel.length != 10)
				this.popup.formMessages.push({type: 'error', content: 'Le numéro de téléphone n\'est pas valide.'})
			if (!this.popup.form.relationship)
				this.popup.formMessages.push({type: 'error', content: 'Le champ "Relation" est requis.'})
			if (this.popup.formMessages.length == 0)
				return (0)
			return (1)
		},
		SetInvite() {
			this.event.invitations.forEach(invitation => {
				if (invitation.code == this.$route.params.id)
				{
					this.invite = invitation
					localStorage.code = invitation.code
				}
			})
		},
		// async GetInvite() {
		// 	try {
		// 		const supabase = useSupabaseClient();
		// 		let { data: invitation, error } = await supabase
		// 		.from('invitations')
		// 		.select("*")
		// 		.eq('code', this.$route.params.id)
		// 		.eq('id_evenement', this.$route.params.id_event)
		// 		if (error) throw error
		// 		localStorage.code = invitation[0].code
		// 		this.invite = invitation[0];
		// 		this.AddMessageInviteStatu(this.event.invitations[0])
		// 	} catch (error) {
		// 		// navigateTo('/');
		// 	} finally {
		// 	}
		// },
		AddInviteToEvent() {
			if (this.CheckForm())
				return
			this.SaveInvite()
		},
		// async GetUser(){
		// 	const supabase = useSupabaseClient();
		// 	const { data: { user } } = await supabase.auth.getUser()
		// 	this.user = user;
		// },
	},
	mounted() {
		const user = useSupabaseUser();
		watchEffect(() => {
			if (user.value)
				navigateTo('/');
		})
		this.GetEvent()
		// this.GetInvite()
		// this.GetUser();
		// this.GetInvitesState()
	},
	created() {
		const metadata = {
			desc: "Visualisez votre invatation a l'événement.",
			// url: "http://localhost:3000/",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Invitation - Who's coming",
			imageDirectory: "cover.png"
		}
    	useHead({
			title: metadata.pageName,
			htmlAttrs: {
				lang: 'fr'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow'},
				{ name: 'theme-color', content: '#014979'},
				{ hid: 'description', name: 'description', content: metadata.desc },
				{ property: 'og:url', content: metadata.url + this.$route.path },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:title', content: metadata.desc },
				{ property: 'og:description', content: metadata.desc },
				{ property: 'og:image', content: metadata.url + metadata.imageDirectory },
				{ property: 'twitter:card', content: 'summary_large_image' },
				{ property: 'twitter:title', content: metadata.pageName },
				{ property: 'twitter:description', content: metadata.desc },
				{ property: 'twitter:image', content: metadata.url + metadata.imageDirectory },
			],
			link: [
				{
					hid: 'canonical',
					rel: 'canonical',
					href: metadata.url + this.$route.path,
				},
			],
		})
	}
}
</script>