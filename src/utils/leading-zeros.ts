export function addLeadingZeros(num: string) {
  const numLength = num?.length;
  if (numLength === 1) {
    return '00' + num;
  } else if (numLength === 2) {
    return '0' + num;
  } else {
    return num;
  }
}