<template>
	<div class="grid gap-6">
		<h2>Se connecter</h2>
		<form class="grid gap-4" action="">
			<div class="grid gap-2">
				<label for="email">E-mail :</label>
				<input type="email" name="email" id="email">
			</div>
			<div class="grid gap-2">
				<label for="password">Mot de passe :</label>
				<input type="text" name="password" id="password">
			</div>
			<input class="btn-primary" type="submit" value="Connection">
		</form>
		<NuxtLink class="btn-secondary" to="Register">S'inscrire</NuxtLink>
	</div>
</template>