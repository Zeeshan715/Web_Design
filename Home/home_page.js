let allCountries = []; // Global Variable for storing Data
let selectedCountry = null;

// Fetch the API
const fetchApiData = async (url) => {
  try {
    const response = await fetch(url);
    const Cuntry_data = await response.json();
    return Cuntry_data;
  } catch (error) {
    console.log(error);
  }
};
// This function renders country cards based on the provided data
const renderCards = (Cuntry_data) => {
  const cardContainer = document.querySelector("#card-container");
  cardContainer.innerHTML = "";

  Cuntry_data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("card");
    countryCard.href = `../Details/detail_page.html?name=${country.name.common}`;
    countryCard.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag">
      <div class="cardBody">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString("en-IN")}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0] || "No Capital"}</p>
      </div>
    `;

    // Append the country card to the card container, adding it to the DOM
    cardContainer.append(countryCard);
  });
};
const fetchAllCountries = async () => {
  const Cuntry_data = await fetchApiData("https://restcountries.com/v3.1/all");
  allCountries = Cuntry_data;
  renderCards(Cuntry_data);
};

const searchCountries = (searchString) => {
  const filteredCountries = allCountries.filter((item) => {
    const name = item.name.common.toLowerCase();
    return name.includes(searchString.toLowerCase());
  });
  renderCards(filteredCountries);
};

// This function clears the value of the search input field
const resetSearchInputValue = () => {
  const searchInput = document.querySelector(".Search_bar input");
  searchInput.value = "";
};

// Select the theme changer element using the query selector
const themeChanger = document.querySelector(".theme-changer");

// This function toggles the theme between light and dark modes
const toggleTheme = () => {
  document.body.classList.toggle("dark");
  const isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  themeChanger.innerHTML = `
    <i class="fa-${isDarkMode ? "solid" : "regular"} fa-moon"></i>
    ${isDarkMode ? "Light" : "Dark"} Mode
  `;
};

const themeChangerInit = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  themeChanger.innerHTML = `
    <i class="fa-${savedTheme === "dark" ? "solid" : "regular"} fa-moon"></i>
    ${savedTheme === "dark" ? "Light" : "Dark"} Mode
  `;
  themeChanger.addEventListener("click", toggleTheme);
};

// Function to create custom select elements
const createCustomSelects = () => {
  const customSelects = document.getElementsByClassName("custom-select");

  // Iterate over each custom select element
  for (let i = 0; i < customSelects.length; i++) {
    const selectElement = customSelects[i].getElementsByTagName("select")[0];
    const options = selectElement.getElementsByTagName("option");
    const selectedOption = options[selectElement.selectedIndex];

    // Create a new div for the selected item
    const selectedItemDiv = document.createElement("div");
    selectedItemDiv.setAttribute("class", "select-selected");
    selectedItemDiv.innerHTML = selectedOption.innerHTML;
    customSelects[i].appendChild(selectedItemDiv);

    // Create a new div for the option list
    const optionListDiv = document.createElement("div");
    optionListDiv.setAttribute("class", "select-items select-hide");

    // Iterate over each option and create divs for option items
    for (let j = 0; j < options.length; j++) {
      if (j === selectElement.selectedIndex) {
        continue; // Skip the selected option
      }
      const option = options[j];
      const optionItemDiv = document.createElement("div");
      optionItemDiv.innerHTML = option.innerHTML;
      optionItemDiv.addEventListener("click", function () {
        // Update the selected item and close the option list
        selectElement.selectedIndex = j;
        selectedItemDiv.innerHTML = this.innerHTML;
        closeAllSelect(this);
        filterCountriesByRegion(option.value); // Pass the region value to filter function
        resetSearchInputValue();
      });
      optionListDiv.appendChild(optionItemDiv);
    }

    customSelects[i].appendChild(optionListDiv);

    // Add event listener to toggle the option list
    selectedItemDiv.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllSelect(this);
      optionListDiv.classList.toggle("select-hide");
      selectedItemDiv.classList.toggle("select-arrow-active");
    });
  }
};

// Function to close all select boxes
const closeAllSelect = (elmnt) => {
  const customSelects = document.getElementsByClassName("custom-select");
  for (let i = 0; i < customSelects.length; i++) {
    const optionListDiv =
      customSelects[i].getElementsByClassName("select-items")[0];
    const selectedItemDiv =
      customSelects[i].getElementsByClassName("select-selected")[0];

    if (elmnt !== selectedItemDiv) {
      optionListDiv.classList.add("select-hide");
      selectedItemDiv.classList.remove("select-arrow-active");
    }
  }
};

// Updated function to filter countries by region
const filterCountriesByRegion = async (region) => {
  if (region === "filter by Region") {
    renderCards(allCountries);
  } else {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
      const Cuntry_data = await response.json();

      if (response.ok) {
        renderCards(Cuntry_data);
      } else {
        console.log("Error:", Cuntry_data.error);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }
};

// const init = async () => {
//   await fetchAllCountries();
//   createCustomSelects();

//   const searchInput = document.querySelector(".Search_bar input");
//   searchInput.addEventListener("input", (e) => {
//     searchCountries(e.target.value);
//   });

//   window.addEventListener("pageshow", resetSearchInputValue);
//   themeChangerInit();
// };

// init();
fetchAllCountries();
createCustomSelects();

const searchInput = document.querySelector(".Search_bar input");
searchInput.addEventListener("input", (e) => {
  searchCountries(e.target.value);
});

window.addEventListener("pageshow", resetSearchInputValue);
themeChangerInit();

// Update init function to call createCustomSelects
