export default function (DBTel: string) {
  let tel = DBTel 
  let cc = ''
  if (DBTel.includes(" ")) {
    cc = DBTel.split(" ")[0]
    tel = DBTel.split(" ")[1] ? DBTel.split(" ")[1].padStart(10, '0') : ''
    tel = tel?.match(/.{1,2}/g)?.join(' ') ?? ''
  } else {
    tel = DBTel.split(" ") ? DBTel.padStart(10, '0') : ''
    tel = tel?.match(/.{1,2}/g)?.join(' ') ?? ''
  }
  return { cc, tel };

}