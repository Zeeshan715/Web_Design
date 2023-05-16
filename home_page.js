let allCountries = []; // Global Variable for storing Data
var selectedCountry = null;

// Fetch the API
const getFlagData = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    allCountries = data;
    const cardContainer = document.getElementById("card-container");
    data.forEach((item) => {
      const a = document.createElement("a");
      a.href = "detail_page.html";

      a.onclick = () => {
        selectedCountry = item;
        console.log(selectedCountry);
      };

      const card = document.createElement("div");
      card.classList.add("card");
      card.insertAdjacentHTML(
        "afterbegin",
        ` <img src="${item.flags.png}" alt="${item.name.common} flag">
        <div class=cardBody>
          <h2>${item.name.common}</h2>
          <p><b>Population:</b> ${item.population}</p>
          <p><b>Region:</b> ${item.region}</p>
          <p><b>Capital:</b> ${item.capital}</p>
        </div>
      `
      );
      a.appendChild(card);
      cardContainer.appendChild(a);
    });
  } catch (error) {
    console.log(error);
  }
};

// Apply the Serch Bar Functionality
const searchCountries = (searchString) => {
  const filteredCountries = allCountries.filter((item) => {
    const name = item.name.common.toLowerCase();
    return name.includes(searchString.toLowerCase());
  });
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  filteredCountries.map((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.insertAdjacentHTML(
      "afterbegin",
      `
        <img src="${item.flags.png}" alt="${item.name.common} flag">
        <div class=cardBody>
          <h2>${item.name.common}</h2>
          <p><b>Population:</b> ${item.population}</p>
          <p><b>Region:</b> ${item.region}</p>
          <p><b>Capital:</b> ${item.capital}</p>
        </div>
      `
    );
    cardContainer.appendChild(card);
  });
};

const searchInput = document.querySelector(".Search_bar");
searchInput.addEventListener("input", (e) => {
  const searchString = e.target.value;
  searchCountries(searchString);
});

// Apply the Filter Functionality
const searchByregion = (region) => {
  const filteredbyregion = allCountries.filter((item) => {
    const regions = item.region.toLowerCase();
    return regions.includes(region.toLowerCase());
  });
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  filteredbyregion.map((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.insertAdjacentHTML(
      "afterbegin",
      `
        <img src="${item.flags.png}" alt="${item.name.common} flag">
        <div class=cardBody>
          <h2>${item.name.common}</h2>
          <p><b>Population:</b> ${item.population}</p>
          <p><b>Region:</b> ${item.region}</p>
          <p><b>Capital:</b> ${item.capital}</p>
        </div>
      `
    );
    cardContainer.appendChild(card);
  });
};

const searchRegion = document.querySelector(".filter");
searchRegion.addEventListener("input", (e) => {
  const region = e.target.value;
  searchByregion(region);
});

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

getFlagData();
