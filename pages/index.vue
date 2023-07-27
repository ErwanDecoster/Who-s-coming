<template>
	<div class="grid gap-6">
		<h2>Rejoindre un événement</h2>
		<form class="grid gap-4" @submit.prevent="RedirectToInvite()" action="">
			<div v-if="formMessages" class="grid gap-1">
				<p v-for="message in formMessages" :key="message.type" class="px-4 py-0.5 rounded-xl"
					:class="{ 'bg-red': message.type == 'error', 'bg-green': message.type == 'succes', 'bg-orange': message.type == 'warning' }"
					@click="formMessages.splice(formMessages.indexOf(message), 1)">
					{{ message.content }}
				</p>
			</div>
			<div class="grid gap-2">
				<label for="invitations_code">Code d'invitation :</label>
				<input class="uppercase" maxlength="6" v-model="form.code" type="text" name="invitations_code" id="invitations_code">
			</div>
			<input class="btn-primary" type="submit" value="Rejoindre">
		</form>
		<NuxtLink class="btn-secondary" to="/register">Créer un événement</NuxtLink>
	</div>
</template>

<script>
// definePageMeta({
// 	middleware: 'auth'
// })
export default {
	data() {
		return {
			formMessages: [],
			form: {
				code: '',
			},
		};
	},
	methods: {
		CheckForm() {
			this.formMessages = [];
			if (!this.form.code)
				this.formMessages.push({type: 'error', content: 'Le champ "Code d\'invitation" est requis'})
			else if (this.form.code.length != 6)
				this.formMessages.push({type: 'error', content: 'Le champ "Code d\'invitation" doit etre de 6 caracteres'})
			if (this.formMessages.length == 0)
				return (0)
			return (1)
		},
		async GetInvite() {
			try {
				this.formMessages = [];
				const supabase = useSupabaseClient();
				const { data, error } = await supabase
				.from('invitations')
				.select('id_evenement')
				.eq('code', this.form.code.toLowerCase())
				if (error) throw error
				if (data.length)
       				navigateTo(`/events/${data[0].id_evenement}/invites/${this.form.code}`);
				else 
					this.formMessages.push({ type: 'error', content: 'Le code n\'est pas valide.' })
			} catch (error) {
				this.formMessages.push({ type: 'error', content: 'Une erreur est survenue.' })
			} finally {
			}
		},
		RedirectToInvite() {
			if (this.CheckForm())
				return (1)
			this.GetInvite()
		},
	},
	created() {
		const metadata = {
			desc: "Who's coming, créé et organisée vos événements, gérer vos invites..",
			url: "https://who-s-coming.vercel.app/",
			pageName: "Who's coming",
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