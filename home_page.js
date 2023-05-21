let allCountries = []; // Global Variable for storing Data
let selectedCountry = null;

// Fetch the API
const fetchApiData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const renderCards = (data) => {
  const cardContainer = document.querySelector("#card-container");
  cardContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("card");
    countryCard.href = `./detail_page.html?name=${country.name.common}`;
    countryCard.innerHTML = `
    <img src="${country.flags.png}" alt="${country.name.common} flag">
      <div class="cardBody">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString("en-IN")}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0]}</p>
      </div>
    `;
    cardContainer.append(countryCard);
  });
};

const fetchAllCountries = async () => {
  const data = await fetchApiData("https://restcountries.com/v3.1/all");
  allCountries = data;
  renderCards(data);
};

const filterCountriesByRegion = async (region) => {
  const data = await fetchApiData(
    `https://restcountries.com/v3.1/region/${region}`
  );
  renderCards(data);
};

const searchCountries = (searchString) => {
  const filteredCountries = allCountries.filter((item) => {
    const name = item.name.common.toLowerCase();
    return name.includes(searchString.toLowerCase());
  });
  renderCards(filteredCountries);
};

const resetSearchInputValue = () => {
  document.querySelector(".Search_bar input").value = "";
};

const themeChanger = document.querySelector(".theme-changer");
const toggleTheme = () => {
  document.body.classList.toggle("dark");
  const isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  themeChanger.innerHTML = `<i class="fa-regular fa-moon"></i>${isDarkMode ? "Light" : "Dark"} Mode`;
};

const themeChangerInit = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  themeChanger.innerHTML = `<i class="fa-regular fa-moon"></i>${savedTheme === "dark" ? "Light" : "Dark"} Mode`;
  themeChanger.addEventListener("click", toggleTheme);
};

const init = async () => {
  await fetchAllCountries();
  document.querySelector(".Search_bar input").addEventListener("input", (e) => {
    searchCountries(e.target.value);
  });
  document
    .querySelector(".filter-by-region")
    .addEventListener("change", (e) => {
      console.log(e.target.value);
      filterCountriesByRegion(e.target.value);
    });
  window.addEventListener("pageshow", resetSearchInputValue());
  themeChangerInit();
};

init();
