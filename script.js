"use strict";

const btnMode = document.querySelector(".btn-mode");
const body = document.getElementsByTagName("body")[0];
const countriesContainer = document.querySelector(".countries-container");
const selectContinent = document.getElementById('continents');
const search = document.getElementById("search-input");
const main = document.querySelector(".main");
// let frontPage = document.querySelector('.front_page').innerHTML;
let frontPage;
let continent;
let countriesArray;
let srchval='';

console.log(main);

const spinner = `
<div class="spin">
<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
</div>  `;

function generateCountryMarkup(countryData, borderMarkup) {
  return `
    <div class="back-page">
       <div class="form">
            <a href="#Home"><button class="btn back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back</button></a>
       </div>
    <div class="display-country">
        <div class="display-country-flag">
        <img src="${countryData.flags.svg}" alt="Loading Image">
        </div>
        <div class="display-country-details">
            <p class="country-name">${countryData.name.common}</p>
            <div class="country-info">

            <ul class="left">
              <li><span>Native Name : </span>${Object.values(countryData.name.nativeName)[0].common}</li>
              <li><span>Population : </span>${countryData.population}</li>
              <li><span>Region : </span>${countryData.region}</li>
              <li><span>Sub Region : </span>${countryData.subregion}</li>
              <li><span>Capital : </span>${countryData.capital[0]}</li>
            </ul>
            <ul class="right">
              <li><span>Top Level Domain : </span>${countryData.tld.map((domain) => domain).join(",")}</li>
              <li><span>Currencies : </span>${Object.values(countryData.currencies).map((curr) => curr.name).join(",")}</li>
              <li><span>Languages : </span>${Object.values(countryData.languages).join(",")}</li>
            </ul>
            </div>
            <div class="country-borders">
              <span>Border Countries : </span>
              ${borderMarkup}
            </div>
            </div>
    </div>
  </div> `;
}


function renderCountriesMarkup(data){
  let markup = '';
  data.forEach((item) => {
    markup += `
    <div class="country-card">
    <a href="#${item.name.common}">
    <div class="country-flag"><img src="${item.flags.svg}" alt="Loading Image"></div>
    <div class="country-details">
    <h2 class="country-name">${item.name.common}</h2>
    <p class="population"><span>Population</span> : ${item.population}</p>
    <p class="region"><span>Region</span> : ${item.region}</p>
    <p class="capital"><span>Capital</span> : ${item.capital}</p>
    </div>
    </a>
    </div>`;
  });
  return markup;
}


// function getJSONBorderCountries(code) {
//   return fetch(`https://restcountries.com/v3.1/alpha/${code}`)
//     .then((res) => res.json())
//     .then((data) => data[0].name.common);

// }
// function dot(arr) {
//   const temp = arr.map(async(item) => {
//     return await getJSONBorderCountries(item).then((a) => { return `<li><a href="#${a}">${a}</a></li>`});
//   });
//   Promise.all(temp).then(val=>console.log(val));
//   temp[temp.length-1].then(data=>console.log(data))
// }



async function getBorderCountries(borders) {
  const api = `https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`;
  const res = await fetch(api);
  return res.json();
}

async function getCountry(name) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!response.ok) throw new Error("Not found");
    const [countryData] = await response.json();

    const { borders } = countryData;
    const data = borders?.length ? await getBorderCountries(borders) : null;
    const val = data?.map((item) => item?.name?.common);

    const borderMarkup = val ? val.map((key) => {return `<li><a href="#${key}">${key}</a></li>`}).join(' ') : "";
    console.log(borderMarkup);
    main.innerHTML = generateCountryMarkup(countryData, borderMarkup);
  } catch (err) {
    alert("Not found.Reload");
  }
}


async function getCountries(continent) {
 try{
   const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`);
   console.log(response);
   // if (!response.ok) throw new Error("Not found");
   const responseData = await response.json();
   
   countriesArray = [...responseData];
   document.querySelector(".countries-container").innerHTML =  renderCountriesMarkup(responseData);
   frontPage = document.querySelector(".main").innerHTML;
 }catch(err){
   // alert('Reload');
   console.log('You are at home page');
 }
}

function darkMode(){
  body.classList.toggle('dark');
}

async function getAllCountries() {
  try{
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) throw new Error("Not found");
      const responseData = await response.json();
      countriesArray = [...responseData];
      countriesContainer.innerHTML= renderCountriesMarkup(responseData);
      frontPage = document.querySelector(".main").innerHTML;
    }catch(err){
      alert('Not able to retrive data');
    }
}  

function handleSelect(ev) {
  continent = ev.target.value;
  if(continent ==='default') {getAllCountries();return;}
  document.querySelector(".countries-container").innerHTML = spinner;
  setTimeout(() => {getCountries(continent)}, 1000);
}


function onHashChange(){
  const name = window.location.hash.slice(1);
  console.log(name);
  if (name === "Home") {
    main.innerHTML = frontPage;
    document.getElementById('search-input').value = srchval;
    if (continent){

      document.getElementById("continents").value = continent;
      // getCountries(continent);
    } 
    document.getElementById("search-input").addEventListener("keyup", updateValue);
    document.getElementById("continents").addEventListener("input", handleSelect);
    return;
  }
  
  main.innerHTML = spinner;
  setTimeout(() => {getCountry(name)}, 300);
}


function updateValue(e) {
  srchval = e.target.value;
  console.log(srchval);
    const reg = new RegExp(e.target.value, "gi");
    const temp = countriesArray.filter((cnt) => cnt.name.common.match(reg));
    
    if (temp.length == 0) {
      alert("No countires found");
    return;
  }
  
  document.querySelector(".countries-container").innerHTML = renderCountriesMarkup(temp);
  frontPage = document.querySelector(".main").innerHTML;
  // console.log(frontPage);
}


selectContinent.addEventListener("input", handleSelect);
window.addEventListener("load", getAllCountries());
window.addEventListener("hashchange", onHashChange);
search.addEventListener("keyup", updateValue);
btnMode.addEventListener("click" , darkMode);