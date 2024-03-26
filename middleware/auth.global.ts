export default defineNuxtRouteMiddleware((to, from) => {
	const user = useSupabaseUser();
	
	const path = to.path.toLowerCase()
	if (user.value && (path == '/' || path == '/login' || path == '/register'))
		return navigateTo('/events');
	if (!user.value && (path == '/events' || path == '/events/new-event' || to.name == 'events-id'))
		return navigateTo('/');
});