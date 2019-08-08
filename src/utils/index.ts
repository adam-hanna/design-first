// Thanks!
// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
