export default function (event: Event) {
  const target = (event.target as HTMLInputElement).nextSibling;
	if (target?.type) {
		if (target.type === "password")
			target.type = "text";
		else
			target.type = "password";
	}
}
