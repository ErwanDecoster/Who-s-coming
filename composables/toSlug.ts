export default function (str: string) {
  if (str) {
    str = str.toLowerCase() 
    str = str.replace(/é|ê|è/gm, 'e')
    str = str.replace(/à/gm, 'a')
    str = str.replaceAll(' ', '-')
    str = str.replaceAll('_', '-')
    str = str.replaceAll('\'', '-')
  }
  return str;
}