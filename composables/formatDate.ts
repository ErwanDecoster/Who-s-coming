export default function (date: Date | undefined) {
  if (date)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: "numeric", timeZone: "UTC", hour: "2-digit", weekday: "long" });
}