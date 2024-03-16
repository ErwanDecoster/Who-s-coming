export default function (tel: string, cc: string) {
  let formated = tel.replace(/^0/, '')
	formated = cc + ' ' + formated.replace(/[ _-]/g, '')
	return formated;
}