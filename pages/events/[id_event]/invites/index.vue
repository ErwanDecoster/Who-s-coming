<template>
	<div class="grid gap-6 relative">
		<h2>
			<template v-if="mode == 0 || mode == 3">
				Liste des invités
			</template>
			<template v-if="mode == 1">
				Modifier la liste
			</template>
		</h2>
		<button v-if="admin" class="absolute top-0 right-0 btn-secondary w-fit" @click="more = !more">•••</button>
		<div v-if="more" class="absolute right-0 top-10 z-10 bg-app rounded-xl">
			<button @click="mode = 3, more = false" class="btn-secondary rounded-b-none">Sélectionner des invités</button>
			<button class="btn-secondary rounded-none">Demandes d'invités</button>
			<button @click="mode = 1, more = false" class="btn-secondary rounded-t-none">Modifier la liste</button>
			<!-- <button class="btn-secondary rounded-t-none">Invités supprimé</button> -->
		</div>
		<div v-if="formMessages.length" class="grid gap-1">
				<p v-for="message in formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="formMessages.splice(formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
		<div v-if="admin && mode == 3" class="grid gap-2">
			<div v-for="invite in invites" class="flex items-center gap-2">
				<input type="checkbox" name="" :id="invite.id_invitation" :disabled="invite.id_state == 3" class="delete-selection h-4 w-4">
				<label :for="invite.id_invitation" class="btn-secondary">
					{{ invite.first_name }} {{ invite.surname }} ({{ GetState(invite.id_state) }})
				</label>
			</div>
			<button class="btn-primary-red" @click="DeleteSelect()">Supprimer la sélection</button>
		</div>
		<div v-if="mode == 0" class="grid gap-2">
			<NuxtLink v-for="invite in invites" class="btn-secondary">
				{{ invite.first_name }} {{ invite.surname }} ({{ GetState(invite.id_state) }})
			</NuxtLink>
			<button v-if="admin && mode == 1" class="btn-secondary" @click="popup.addInvite = true">Ajouter un invité</button>
		</div>
		<div v-if="admin && mode == 1" class="grid gap-2">
			<div v-for="invite in invites" class="flex">
				<NuxtLink class="btn-primary" :class="{ 'rounded-r-none': invite.id_state < 3 }">
					{{ invite.first_name }} {{ invite.surname }} ({{ GetState(invite.id_state) }}) [{{ invite.code }}]
				</NuxtLink>
				<a v-if="invite.id_state < 3" class="btn-primary rounded-l-none border-l-2 border-black" :href="`sms://${invite.tel}?body=Salut%20je%20t%27invite%20a%20{}%20pour%20plus%20d%27information%20et%20pour%20accepter%20l%27invitation%20clique%20sur%20ce%20lien%20:%20http://10.14.6.5:3000/events/${$route.params.id_event}/invites/${invite.code}`" >
				<!-- <a v-if="invite.id_state < 3" class="btn-primary rounded-l-none border-l-2 border-black" :href="`sms://${invite.tel}?body=test`" > -->
					<template v-if="invite.id_state == 1">
						Envoyer l'invitation
					</template>
					<template v-if="invite.id_state == 2">
						Re envoyer l'invitation
					</template>
				</a>
			</div>
			<button v-if="admin && mode == 1" class="btn-secondary" @click="popup.addInvite = true">Ajouter un invité</button>
		</div>
		<div v-if="admin" class="grid gap-2">
			<button @click="mode = 0" v-if="mode != 0" class="btn-primary">Terminé</button>
			<NuxtLink class="btn-primary" @click="mode = 1" :to="`/events/${$route.params.id_event}`">Retour a l'événement</NuxtLink>
		</div>
		<div v-else>
			<NuxtLink class="btn-primary" :to="`/events/${$route.params.id_event}/invites/${userCode}`">Retour a l'invitation</NuxtLink>
		</div>
		<Popup v-if="popup.addInvite" @close="popup.addInvite = false">
			<p class="text-2xl text-center">Nouvel invité</p>
			<div class="grid gap-1" :class="{ 'hidden': popup.formMessages.length == 0 }">
				<p v-for="message in popup.formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="popup.formMessages.splice(popup.formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<form class="grid gap-4" @submit.prevent="AddInviteToEvent()" action="">
				<div class="grid gap-2">
					<label for="need_label">Prénom :</label>
					<input v-model="popup.form.firstName" type="text" name="need_label" id="need_label">
				</div>
				<div class="grid gap-2">
					<label for="need_number">Nom :</label>
					<input v-model="popup.form.surname" type="text" name="need_number" id="need_number">
				</div>
				<div class="grid gap-2">
					<label for="need_number">Tél :</label>
					<input v-model="popup.form.tel" type="tel" name="need_number" id="need_number">
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
			invites: '',
			formMessages: [],
			more: false,
			admin: false,
			mode: 0,
			user: 0,
			userCode: '',
			popup: {
				formMessages: [],
				addInvite: false,
				form: {
					firstName: '',
					surname: '',
					tel: '',
				}
			}
		}
	},
	methods: {
		async DeleteRow(id)  {
			try {
				const supabase = useSupabaseClient();
				const { error } = await supabase
				.from('invitations')
				.delete()
				.eq('id_invitation', id)
				if (error) throw error
				this.invites.splice(this.invites.findIndex(invite => invite.id_invitation == id), 1); 
			} catch {
				this.formMessages.push({ type: 'error', content: 'Une erreur est survenue l\'invité n\'a pas pu étre supprimé de l\'événement.' })
			}
		},
		DeleteSelect() {
			const checkeds = document.querySelectorAll('input:checked.delete-selection')
			this.formMessages = [];
			checkeds.forEach(element => {
				this.DeleteRow(element.id)
			});
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
						id_state: 1,
						code: code,
					},
				])
				const invite = {
					id_invitation: this.$route.params.id_event,
					first_name: this.popup.form.firstName,
					surname: this.popup.form.surname,
					tel: this.popup.form.tel,
					id_state: 1,
					code: code,
				}
				this.invites.push(invite);
				if (error) throw error
				this.popup.formMessages.push({ type: 'succes', content: 'L\'invité a bien été ajouté a l\'événement.' })
				this.popup.addInvite = false;
			} catch (error) {
				this.popup.formMessages.push({ type: 'error', content: 'Une erreur est survenue l\'invité n\'a pas pu étre ajouté a l\'événement.' })
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
			if (this.popup.formMessages.length == 0)
				return (0)
			return (1)
		},
		GetState(idState) {
			const State = ['non invité','invité','comfirmé','refusé']
			return State[idState - 1]
		},
		AddInviteToEvent() {
			if (this.CheckForm())
				return
			this.SaveInvite()
		},
		async GetInvites() {
			try {
				const supabase = useSupabaseClient();
				let { data: invitations, error } = await supabase
				.from('invitations')
				.select("*")
				.eq('id_evenement', this.$route.params.id_event)
				if (error) throw error
				this.invites = invitations;
			} catch (error) {
			} finally {
			}
		},
		async GetUser(){
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
		},
	},
	watch: {
		mode(newMode) {
			localStorage.mode = newMode;
		},
	},
	mounted() {
		const user = useSupabaseUser();
		this.GetUser();
		this.GetInvites();
		if (localStorage.mode) {
			this.mode = localStorage.mode;
		}
		if (localStorage.code)
			this.userCode = localStorage.code
		watchEffect(() => {
			if (user.value)
				this.admin = true;
		})
	},
}
</script>