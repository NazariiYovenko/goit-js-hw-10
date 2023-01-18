export function fetchCountries(name) {
  url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flag,languages`;
  return fetch(url);
}
