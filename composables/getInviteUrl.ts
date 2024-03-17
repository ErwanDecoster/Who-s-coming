export default function (routeParams, invite: invite, isEdit: boolean = false) {
  if (isEdit)
		return `/events/${routeParams.id}-${toSlug(routeParams.name)}/invites/${invite.id_invitation}/edit`
	return `/events/${routeParams.id}-${toSlug(routeParams.name)}/invites/${invite.id_invitation}`
}