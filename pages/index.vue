<template>
	<div class="grid gap-6">
		<h2>Rejoindre un événement</h2>
		<form class="grid gap-4" action="">
			<div class="grid gap-2">
				<label for="invitations_code">Code d'invitation :</label>
				<input type="number" name="invitations_code" id="invitations_code">
			</div>
			<input class="btn-primary" type="submit" value="Rejoindre">
		</form>
		<NuxtLink class="btn-secondary" to="Register">Créer un événement</NuxtLink>
	</div>
</template>

<script>
export default {
	mounted() {
		const user = useSupabaseUser();
		console.log(user);
		watchEffect(() => {
		if (user.value)
			navigateTo('/events');
		})
  	},
}
</script>