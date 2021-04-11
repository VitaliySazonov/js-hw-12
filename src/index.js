import './styles.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, Stack } from "@pnotify/core";
import _ from 'lodash'


// Refs
const input = document.getElementById('country');
const country_single = document.getElementById('country_single')
const country_list = document.getElementById('country_list');

// Configure and insert Pnotify to the block (#notice)
function alertMessage(text, type) {
  const stackBottomModal = new Stack({
    dir1: "up",
    push: "bottom",
    modal: false,
    context: document.getElementById("notice")
  });
  alert({
    text: text,
    width: "auto",
    type: type,
    hide: true,
    delay: 300,
    animateSpeed: 'fast',
    shadow: true,
    animation: 'fade',
    addClass: 'active_notice',
    stack: stackBottomModal
  });
}

// Append country items to the list
const countryList = data => data.map(country => country_list.innerHTML += `<li>${country.name}</li>`);

// Build the one country block
const countryBlock = ({flag, name, capital, population, languages}) => {
  let langList = languages.map(lang => lang.name).join(', ');
  country_single.innerHTML =
    `
      <img src="${flag}" alt="Flag">
      <ul class="country_single_items">
        <li><span>Country: </span><p>${name}</p></li>
        <li><span>Capital: </span><p>${capital}</p></li>
        <li><span>Population: </span><p>${population}</p></li>
        <li><span>Languages: </span><p>${langList}</p></li>
      </ul>
    `
}

// Search the country
async function getAllFavorites(url) {
  try {
    let res = await fetch(`https://restcountries.eu/rest/v2/name/${url}`);
    let data = await res.json();
    console.log('DATA => ', data);
    if (data.status === 404) {
      country_single.style.display = 'none';
      country_list.style.display = 'none';
      return alertMessage('Wrong country', 'error');
    }
    if (data.length > 1) {
      countryList(data);
      country_list.style.display = 'block';
      country_single.style.display = 'none';
      return alertMessage('Need to make the request more specific', 'notice');
    }
    if (data.length === 1) {
      country_list.style.display = 'none';
      countryBlock(data[0])
      country_single.style.display = 'flex';
    }
  } catch (err) {
    console.log('Error ==> ', err);
  }
}

// Monitor the input using lodash.debounce, 500ms
input.addEventListener('input', _.debounce(evt => {
  if (!evt.target.value.length) {
    country_single.style.display = 'none';
    country_list.style.display = 'none';
    return;
  }
  getAllFavorites(evt.target.value)
}, 500));


