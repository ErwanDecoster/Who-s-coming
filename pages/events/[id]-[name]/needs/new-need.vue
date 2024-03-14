<script setup lang="ts">
interface Message {
	type: string;
  content: string;
}

const route = useRoute()
let messages = ref<Array<Message>>([])

let form = ref({
	label: '',
	min_required_number: 1,
	max_number: 1,
})

const ValidForm = (() => {
  messages.value = [];
	if (!form.value.label)
		messages.value.push({type: 'error', content: 'Un libellé est requis.'})
  if (!form.value.min_required_number)
    messages.value.push({type: 'error', content: 'Un nombre minimun est requis.'})
	else if (form.value.min_required_number < 1)
		messages.value.push({type: 'error', content: 'Le minimun doit étre d\'au moin 1.'})
  if (!form.value.max_number)
    messages.value.push({type: 'error', content: 'Un nombre maximun est requis.'})
  else if (form.value.max_number < form.value.min_required_number)
    messages.value.push({type: 'error', content: 'Le maximun doit étre au moin égale au minimun.'})
	if (messages.value.length)
    return (0)
  return (1)
})

const AddNeed = async () => {
	if (ValidForm()) {	
		try {
			const data = await $fetch(`/api/events/${route.params.id}/needs`, {
				method: 'post',
				body: {
					label: form.value.label,
					min_required_number: form.value.min_required_number,
					max_number: form.value.max_number,
				},
			}).then((data) => {
				console.log(data);
				
				if (data[0]) {
					messages.value.push({
						type: 'success',
						content: "Le besoin a été ajouté avec succès."
					})
					navigateTo(`/events/${route.params.id}-${toSlug(route.params.name)}`);
				}
			})
		} catch(e) {
			messages.value.push({
				type: 'error',
				content: "Le besoin n'as pas pu étre ajouté."
			})
			console.log(e);
		}
	}
}

watch(() => form.value.min_required_number, (newVal) => {
	if (newVal > form.value.max_number) {
		form.value.max_number = newVal
	}
})

</script>

<template>
	<div class="container">
		<form @submit.prevent="AddNeed()">
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
				<label for="label">Label :</label>
				<input 
					type="text" 
					name="label" 
					v-model="form.label" 
					id="label"
					required
				>
			</div>
			<div class="input-container">
				<label for="min_required_number">Minimun requis :</label>
				<input 
					type="number" 
					name="min_required_number" 
					v-model="form.min_required_number" 
					id="min_required_number"
					min="1"
					required
				>
			</div>
			<div class="input-container">
				<label for="max_number">Maximun :</label>
				<input 
					type="number" 
					name="max_number" 
					v-model="form.max_number" 
					id="max_number"
					:min="form.min_required_number"
					required
				>
			</div>
			<button type="submit" class="primary">
				Ajouter
			</button>
		</form>
		<NuxtLink :to="`/events/${$route.params.id}-${toSlug($route.params.name)}`" class="tertiary">Annuler</NuxtLink>
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
		this.GetUser();
	},
	created() {
		const metadata = {
			desc: "Créés un nouvel événement choisissez votre date, créé une description et définissez votre règlement.",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Nouvel événement - Who's coming",
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
</script> -->