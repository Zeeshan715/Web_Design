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
// This function renders country cards based on the provided data
const renderCards = (data) => {
  // Get the container element for country cards
  const cardContainer = document.querySelector("#card-container");

  // Clear the existing content of the card container before rendering new cards
  cardContainer.innerHTML = "";

  // Iterate over each country in the data array
  data.forEach((country) => {
    // Create a new anchor element to represent a country card
    const countryCard = document.createElement("a");

    // Add the "card" class to the country card for styling
    countryCard.classList.add("card");

    // Set the href attribute of the country card to a detail page URL with the country name as a parameter
    // This allows users to navigate to a detail page for the selected country
    countryCard.href = `./detail_page.html?name=${country.name.common}`;

    // Set the inner HTML of the country card, including the country's flag, name, population, region, and capital
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
// This asynchronous function fetches data from a specified API endpoint and renders country cards based on the fetched data
const fetchAllCountries = async () => {
  // Fetch data from the REST API endpoint using the custom fetchApiData function
  const data = await fetchApiData("https://restcountries.com/v3.1/all");

  // Assign the fetched data to a variable named allCountries
  // This variable can be used for further processing or caching the data
  allCountries = data;

  // Render country cards based on the fetched data
  renderCards(data);
};

// This asynchronous function filters countries based on a specified region and renders country cards with the filtered data
// const filterCountriesByRegion = async (region) => {
//   // Fetch data from the REST API endpoint by appending the region parameter to the URL
//   const data = await fetchApiData(`https://restcountries.com/v3.1/region/${region}`);

//   // Render country cards based on the filtered data
//   renderCards(data);
// };

// This function filters countries based on a search string and renders country cards with the filtered data
const searchCountries = (searchString) => {
  // Filter countries from the allCountries array based on the search string
  // The filter condition checks if the lowercase name of a country includes the lowercase search string
  const filteredCountries = allCountries.filter((item) => {
    const name = item.name.common.toLowerCase();
    return name.includes(searchString.toLowerCase());
  });

  // Render country cards based on the filtered data
  renderCards(filteredCountries);
};

// This function clears the value of the search input field
const resetSearchInputValue = () => {
  // Select the search input field using the query selector
  const searchInput = document.querySelector(".Search_bar input");

  // Set the value of the search input field to an empty string,
  // effectively clearing its contents
  searchInput.value = "";
};

// Select the theme changer element using the query selector
const themeChanger = document.querySelector(".theme-changer");

// This function toggles the theme between light and dark modes
const toggleTheme = () => {
  // Toggle the "dark" class on the body element to switch between light and dark modes
  document.body.classList.toggle("dark");

  // Check if the dark mode is currently active
  const isDarkMode = document.body.classList.contains("dark");

  // Store the current theme ("dark" or "light") in the localStorage
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

  // Update the theme changer's HTML to reflect the current theme
  themeChanger.innerHTML = `
    <i class="fa-${isDarkMode ? "solid" : "regular"} fa-moon"></i>
    ${isDarkMode ? "Light" : "Dark"} Mode
  `;
};

// This function initializes the theme changer functionality
const themeChangerInit = () => {
  // Retrieve the saved theme from localStorage or default to "light"
  const savedTheme = localStorage.getItem("theme") || "light";

  // Add the saved theme class ("dark" or "light") to the body element
  document.body.classList.add(savedTheme);

  // Update the theme changer's HTML to reflect the saved theme
  themeChanger.innerHTML = `
    <i class="fa-${savedTheme === "dark" ? "solid" : "regular"} fa-moon"></i>
    ${savedTheme === "dark" ? "Light" : "Dark"} Mode
  `;

  // Attach a click event listener to the theme changer to toggle the theme
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
    const optionListDiv = customSelects[i].getElementsByClassName(
      "select-items"
    )[0];
    const selectedItemDiv = customSelects[i].getElementsByClassName(
      "select-selected"
    )[0];

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
      const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
      const data = await response.json();
      
      if (response.ok) {
        renderCards(data);
      } else {
        console.log("Error:", data.error);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }
};


// Update init function to call createCustomSelects
const init = async () => {
  await fetchAllCountries();
  createCustomSelects();

  const searchInput = document.querySelector(".Search_bar input");
  searchInput.addEventListener("input", (e) => {
    searchCountries(e.target.value);
  });

  window.addEventListener("pageshow", resetSearchInputValue);
  themeChangerInit();
};

init();




