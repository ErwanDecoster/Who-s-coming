<template>
	<div>
		<h2>Événements</h2>
		<div>
			<h3>Liste de vos événements :</h3>
			<div>
				<!-- <p v-if="events.length == 0">Vous n'avez encore aucun evenement.</p> -->
				<NuxtLink 
					v-for="event in events" 
					:key="event.id"
					:to="`events/${event.id}`"
				>
					<div>
						<p>{{ event.name }} - {{ event.address }}</p>
						<p>{{ event.invites }} - {{ event.invitesConfirmed }}</p>
					</div>
					<span class="bg-orange-400">
						{{ event.nbInvitePending }}
					</span>
				</NuxtLink>
			</div>
		</div>
		<NuxtLink class="btn-primary" to="Events/NewEvent">Créer un nouvelle événement</NuxtLink>
	</div>
</template>
