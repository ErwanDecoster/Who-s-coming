<script setup lang="ts">
interface Message {
  type: string;
  content: string;
}

let messages = ref<Array<Message>>([])

let form = ref({
	image: File,
	name: "Soirée d'integration 2026",
	address: '1 Quartier Les Marettes, Andancette',
	datetime: '',
	desc: 'Cette soirée a pour objectif de mieux integret les nouveau éléves aux sein de l’école',
	rule: '',
})

const ValidForm = (() => {
  messages.value = [];
	if (!form.value.address)
		messages.value.push({type: 'error', content: 'Une adresse est requise."'})
  if (!form.value.datetime)
    messages.value.push({type: 'error', content: 'La date et l\'heure sont requise.'})
  if (!form.value.name)
  if (!form.value.desc)
    messages.value.push({type: 'error', content: 'Une description est requise.'})
  if (!form.value.name)
    messages.value.push({type: 'error', content: 'Un titre est requis.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const AddEvent = async () => {
	try {
		console.log(form.value);
		
		const data = await $fetch('/api/events/add', {
			method: 'post',
			body: {
				name: form.value.name,
				address: form.value.address,
				datetime: form.value.datetime,
				desc: form.value.desc,
				rule: form.value.rule,
			},
		}).then((data) => {
			if (data) {
				messages.value.push({
					type: 'success',
					content: "L'événement a été crée avec succès."
				})
				// console.log(data);
				// console.log(form.value.image);
				UploadImage(form.value.image, data.data[0].id_evenement, form.value.name)
			}
		})
	} catch(e) {
		console.log(e);
	}
}

const UpdateImage = (event) => {
	form.value.image = event.target.files[0]
}

const UploadImage = async (files:File, eventId, name) => {
	console.log(files);
	
	try {
		const supabase = useSupabaseClient();
		const { data, error } = await supabase.storage
			.from('event_picture')
			.upload(`${eventId.toString()}`, files)
		if (error) throw error
			if (data) {
			navigateTo(`/events/${eventId}-${toSlug(name)}`);
		}
	} catch(e) {
		messages.value.push({
			type: 'error',
			content: `L'image n'as pas pu etre ajouté.`
		})
		messages.value.push({
			type: 'error',
			content: `statusCode ${e.statusCode}, error : ${e.error}, message: ${message}`
		})
		console.log(e);
	}
}
</script>

<template>
	<div class="container">
		<form @submit.prevent="AddEvent()">
			<ul>
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
			<div class="input-container">
				<label for="image">Image :</label>
				<input 
					@change="UpdateImage($event)"
					type="file" 
					accept="image/png, image/jpeg, image/webp"
					name="image"
					id="image"
					required
				>
			</div>
			<div class="input-container">
				<label for="name">Titre :</label>
				<input 
					type="text" 
					name="name" 
					v-model="form.name" 
					id="name"
					required
				>
			</div>
			<div class="input-container">
				<label for="address">Adresse postale :</label>
				<input 
					type="text" 
					name="address" 
					v-model="form.address" 
					id="address"
					required
				>
			</div>
			<div class="input-container">
				<label for="datetime">Date et heure :</label>
				<input 
					type="datetime-local" 
					name="datetime" 
					v-model="form.datetime" 
					id="datetime"
					required
				>
			</div>
			<div class="input-container">
				<label for="desc">Description :</label>
				<div class="grow-wrap" :data-replicated-value="form.desc">
					<textarea 
						name="desc" 
						v-model="form.desc" 
						id="desc"
						required
					/>
				</div>
			</div>
			<div class="input-container">
				<label for="rule">Règlement :</label>
				<div class="grow-wrap" :data-replicated-value="form.rule">
					<textarea 
						name="rule" 
						v-model="form.rule" 
						id="rule"
					/>
				</div>
			</div>
			<button type="submit" class="primary">
				Ajouter
			</button>
		</form>
		<NuxtLink to="/events" class="tertiary">Annuler</NuxtLink>
	</div>
</template>

<!-- <script>
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
				console.log('need 1', this.form.needs);
				this.form.needs.splice(this.form.needs.indexOf(need), 1)
				console.log('need 2', this.form.needs);
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
</script> -->