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
			<NuxtLink class="btn-secondary-red" to="Events">Annuler</NuxtLink>
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
				address: '',
				desc: '',
				rules: '',
				needs: [],
			}
		}
	},
	methods: {
		CheckpopupForm() {
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
			if (this.CheckpopupForm())
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
			// const supabase = useSupabaseClient();
			// let { data, error } = await supabase.auth.signUp({
			// 	email: this.form.email,
			// 	password: this.form.password
			// })
			// console.log('data', data);
			// console.log('error', error);
		},
		AddEvent() {
			if (this.CheckForm())
				return (1);
			this.SignUp();
		}
	},
	watch: {
		'form.name'(newName) {
			localStorage.name = newName;
			console.log('cc');
		},
		'form.address'(newAddress) {
			localStorage.address = newAddress;
		},
		'form.desc'(newDesc) {
			localStorage.desc = desc;
		},
		'form.rules'(newObject) {
			localStorage.rules = newObject;
		},
	},
	mounted() {
		if (localStorage.name) {
			this.form.name = localStorage.name;
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
		console.log(user);
		watchEffect(() => {
			if (!user.value)
				navigateTo('/');
		})
	},
}
</script>