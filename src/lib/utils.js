export function isPositiveNumber(number) {
  if (number === "") return false;
  const positiveNumberRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;
  return positiveNumberRegex.test(number);
}

export function sanitizeNumber(val) {
  return isPositiveNumber(val) ? val : 0;
}
