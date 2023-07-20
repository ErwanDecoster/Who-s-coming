<template>
	<div class="grid gap-6">
		<h2>Nouvel événement</h2>
		<form @submit.prevent="" class="grid gap-4" action="">
			<div class="grid gap-1" :class="{ 'hidden': formMessages.length == 0 }">
				<p v-for="message in formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="formMessages.splice(formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<div class="grid gap-2">
				<label for="event_name">Nom de l'événement :</label>
				<input v-model="form.name" type="text" name="event_name" id="event_name">
			</div>
			<div class="grid gap-2">
				<label for="event_date">Date de l'événement :</label>
				<input v-model="form.date" type="date" name="event_date" id="event_date">
			</div>
			<div class="grid gap-2">
				<label for="event_time">Heure de l'événement :</label>
				<input v-model="form.time" type="time" name="event_time" id="event_time">
			</div>
			<div class="grid gap-2">
				<label for="event_address">Addresse :</label>
				<input v-model="form.address" type="text" name="event_address" id="event_address">
			</div>
			<div class="grid gap-2">
				<label for="event_desc">Description :</label>
				<textarea v-model="form.desc" name="event_desc" id="event_desc"></textarea>
			</div>
			<div class="grid gap-2">
				<label for="event_rules">Règlement :</label>
				<textarea v-model="form.rules" name="event_rules" id="event_rules"></textarea>
			</div>
			<div class="grid gap-2">
				<p>Nécessaire :</p>
				<p v-for="need in form.needs" :key="need">{{ need.label }} ({{ need.number }} manquants)</p>
				<button class="btn-secondary" @click="popup.addNeed = true">Ajouter un nécessaire a l'événement</button>
			</div>
			<input @click="AddEvent()" class="btn-primary" type="submit" value="Enregistrer">
			<NuxtLink class="btn-secondary-red" to="/events">Annuler</NuxtLink>
		</form>
		<Popup v-if="popup.addNeed" @close="popup.addNeed = false">
			<p class="text-2xl text-center">Nouveau nécessaire</p>
			<div class="grid gap-1" :class="{ 'hidden': popup.formMessages.length == 0 }">
				<p v-for="message in popup.formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="popup.formMessages.splice(popup.formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<form class="grid gap-4" @submit.prevent="AddNeedToEvent" action="">
				<div class="grid gap-2">
					<label for="need_label">Label :</label>
					<input v-model="popup.form.label" type="text" name="need_label" id="need_label">
				</div>
				<div class="grid gap-2">
					<label for="need_number">Quantité :</label>
					<input v-model="popup.form.number" type="number" name="need_number" id="need_number">
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
			user: 0,
			eventId: 0,
			popup: {
				addNeed: false,
				formMessages: [],
				form: {
					label: '',
					number: '',
				}
			},
			formMessages: [],
			form: {
				name: '',
				date: '',
				time: '',
				address: '',
				desc: '',
				rules: '',
				needs: [],
			}
		}
	},
	methods: {
		CheckPopupForm() {
			this.popup.formMessages = []
			if (!this.popup.form.label)
				this.popup.formMessages.push({ type: 'error', content: 'Le champ "Label" est requis' })
			if (!this.popup.form.number)
				this.popup.formMessages.push({ type: 'error', content: 'Le champ "Quantité" est requis' })
			if (this.popup.form.number < 1)
				this.popup.formMessages.push({ type: 'error', content: 'Le champ "Quantité" doit etre de 1 au minimun' })
			if (this.popup.formMessages.length == 0)
				return (0)
			return (1)
		},
		AddNeedToEvent() {
			if (this.CheckPopupForm())
				return (1);
			const need = {
				label: this.popup.form.label,
				number: this.popup.form.number,
			}
			this.form.needs.push(need);
			this.popup.addNeed = false;
			this.popup.form.label = '';
			this.popup.form.number = '';
		},
		CheckForm() {
			this.formMessages = []
			if (!this.form.name)
				this.formMessages.push({ type: 'error', content: 'Le champ "Nom de l\'événement" est requis' })
			if (!this.form.date)
				this.formMessages.push({ type: 'error', content: 'Le champ "Date de l\'événement" est requis' })
			if (!this.form.time)
				this.formMessages.push({ type: 'error', content: 'Le champ "Heure de l\'événement" est requis' })
			if (!this.form.address)
				this.formMessages.push({ type: 'error', content: 'Le champ "Addresse" est requis' })
			if (!this.form.desc)
				this.formMessages.push({ type: 'error', content: 'Le champ "Description" est requis' })
			if (!this.form.rules)
				this.formMessages.push({ type: 'warning', content: 'Le champ "Règlement" est recomandénuxt ' })
			if (this.formMessages.length == 0)
				return (0)
			return (1)
		},
		async SaveEvent() {
			let eventId;
			try {
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('evenements')
				.insert([
					{
						name: this.form.name,
						date: this.form.date,
						time: this.form.time,
						address: this.form.address,
						desc: this.form.desc,
						rules: this.form.rules,
						user_id: this.user.id,
					},
				]).select()
				if (error) throw error
				eventId = data[0].id_evenement;
				this.eventId = eventId;
				this.form.name = '';
				this.form.date = '';
				this.form.time = '';
				this.form.address = '';
				this.form.desc = '';
				this.form.rules = '';
				this.formMessages.push({ type: 'succes', content: 'L\'événement a bien été créé.' })
				if (this.form.needs.length == 0)
					navigateTo(`/events/${eventId}`);
				this.form.needs.forEach(need => {
					this.SaveNeeds(need, eventId);
				})
			} catch (error) {
				this.formMessages.push({ type: 'error', content: 'Une erreur est survenue l\'événement ne pas été créé.' })
			} finally {
			}
		},
		async SaveNeeds(need, eventId) {
			try {
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('needs')
				.insert([
					{ 
						id_evenement: eventId,
						label: need.label,
						number: need.number
					},
				])
				if (error) throw error
				this.form.needs.splice(this.form.needs.indexOf(need), 1)
				this.formMessages.push({ type: 'succes', content: 'Le nécessaire a bien été ajouté a l\'événement.' })
				if (this.form.needs.length == 0)
					navigateTo(`/events/${eventId}`);
			} catch (error) {
				this.formMessages.push({ type: 'error', content: 'Une erreur est survenue le nécessaire n\'a pas pu étre ajouté a l\'événement.' })
			}
		},
		AddEvent() {
			if (this.CheckForm())
				return (1);
			this.SaveEvent()
		},
		async GetUser(){
			const supabase = useSupabaseClient();
			const { data: { user } } = await supabase.auth.getUser()
			this.user = user;
		},
	},
	watch: {
		'form.name'(newName) {
			localStorage.name = newName;
		},
		'form.date'(newDate) {
			localStorage.date = newDate;
		},
		'form.time'(newTime) {
			localStorage.time = newTime;
		},
		'form.address'(newAddress) {
			localStorage.address = newAddress;
		},
		'form.desc'(newDesc) {
			localStorage.desc = newDesc;
		},
		'form.rules'(newRules) {
			localStorage.rules = newRules;
		},
	},
	mounted() {
		if (localStorage.name) {
			this.form.name = localStorage.name;
		}
		if (localStorage.date) {
			this.form.date = localStorage.date;
		}
		if (localStorage.time) {
			this.form.time = localStorage.time;
		}
		if (localStorage.address) {
			this.form.address = localStorage.address;
		}
		if (localStorage.desc) {
			this.form.desc = localStorage.desc;
		}
		if (localStorage.rules) {
			this.form.rules = localStorage.rules;
		}
		if (localStorage.message) {
			this.form.message = localStorage.message;
		}
		
		const user = useSupabaseUser();
		this.GetUser();
		watchEffect(() => {
			if (!user.value)
				navigateTo('/');
		})
	},
}
</script>