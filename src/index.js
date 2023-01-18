import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  let name = e.target.value.trim().toLowerCase();
  if (name === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(createMarkup)
    .catch(hendler404);
}

function hendler404() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function createMarkup(countries) {
  if (countries.length > 10) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1 && countries.length < 10) {
    const markup = countries
      .map(
        country =>
          `<li class="country-item__info">
                  <img class="country-item__flag"src="${country.flag}" alt="flag ${country.name}">
                   <h1 class="country-item__name">${country.name}</h1>
                   </li>
               `
      )
      .join('');
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = markup;
  } else if (countries.length == 1) {
    const markup = countries.map(
      country =>
        `
             <div class="country-item__info">
             <img class="country-item__flag"src="${country.flag}" alt="flag ${
          country.name
        }">
             <h1 class="country-item__name-header">${country.name}</h1>
             </div>
             <p class="country-item__capital"><span class="country-item__capital--bold">Capital:</span> ${
               country.capital
             }</p>
             <p class="country-item__population"><span class="country-item__population--bold">Population:</span> ${
               country.population
             }</p>
             <p class="country-item__languages"><span class="country-item__languages--bold">Languages:</span> ${Object.values(
               country.languages
             )
               .map(language => language.name)
               .join(', ')}</p>`
    );
    refs.countryInfo.innerHTML = markup;
    refs.countryList.innerHTML = '';
  }
}
