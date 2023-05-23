const countryName = new URLSearchParams(location.search).get("name");
const borderCountries = document.querySelector(".border-countries");
const themeChanger = document.querySelector(".theme-changer");
const body = document.body;
const API = `https://restcountries.com/v3.1/all`;

// Fetch the API
const fetchApiData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const showLoader = () => {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
};

const hideLoader = () => {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
};
// This function fetches detailed information about a country from an API and updates the HTML elements on the country detail page accordingly
const showCardDetail = async () => {
  try {
    showLoader(); // Show a loader or loading state indicator while fetching and updating data

    // Fetch detailed information about the country
    const response = await fetch(`${API}/name/${countryName}?fullText=true`);
    const [country] = await response.json();

    // Update HTML elements with the fetched country data
    const flagImage = document.querySelector(".country-details img");
    flagImage.src = country.flags.png;
    const countryNameH1 = document.querySelector(".country-details h1");
    countryNameH1.innerText = country.name.common;
    const population = document.querySelector(".population");
    population.innerText = country.population.toLocaleString("en-IN");
    const region = document.querySelector(".region");
    region.innerText = country.region;
    const topLevelDomain = document.querySelector(".top-level-domain");
    topLevelDomain.innerText = country.tld;

    // Check if the country has a capital and update the corresponding HTML element
    if (country.capital) {
      const capital = document.querySelector(".capital");
      capital.innerText = country.capital?.[0];
    }

    // Check if the country has a subregion and update the corresponding HTML element
    if (country.subregion) {
      const subRegion = document.querySelector(".sub-region");
      subRegion.innerText = country.subregion;
    }

    // Check if the country has a native name and update the corresponding HTML element
    if (country.name.nativeName) {
      const nativeName = document.querySelector(".native-name");
      nativeName.innerText = Object.values(country.name.nativeName)[0].common;
    } else {
      nativeName.innerText = country.name.common;
    }

    // Check if the country has currencies and update the corresponding HTML element
    if (country.currencies) {
      const currencies = document.querySelector(".currencies");
      currencies.innerText = Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ");
    }

    // Check if the country has languages and update the corresponding HTML element
    if (country.languages) {
      const languages = document.querySelector(".languages");
      languages.innerText = Object.values(country.languages).sort().join(", ");
    }

    // Check if the country has borders and fetch information about the border countries
    if (country.borders) {
      const countries = [];

      // Fetch information about each border country
      for (const border of country.borders) {
        try {
          const response = await fetch(`${API}/alpha/${border}`);
          const [borderCountry] = await response.json();
          countries.push(borderCountry.name.common);
        } catch (error) {
          console.log(error);
        }
      }

      countries.sort();

      // Update HTML element with border countries' links
      for (const border of countries) {
        const borderCountryTag = document.createElement("a");
        borderCountryTag.innerText = border;
        borderCountryTag.href = `detail_page.html?name=${border}`;
        borderCountries.append(borderCountryTag);
      }
    } else {
      borderCountries.innerHTML = `<p class="no-border">No Border Countries</p>`;
    }

    hideLoader(); // Hide the loader or loading state indicator after data has been fetched and updated
  } catch (error) {
    console.log(error); // Log any errors that occur during the fetch and update process
  }
};

const themeGetter = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  
  // Check if the saved theme is "dark" and apply corresponding styles and button text
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeChanger.innerHTML = '<i class="fa-solid fa-moon"></i>Light Mode';
  }
};


const toggleTheme = () => {
  body.classList.toggle("dark");

  // Determine the current theme and save it to localStorage
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);

  // Update the HTML content of the themeChanger element based on the current theme
  const buttonHtml = body.classList.contains("dark")
    ? '<i class="fa-solid fa-moon"></i>Light Mode'
    : '<i class="fa-regular fa-moon"></i>Dark Mode';
  themeChanger.innerHTML = buttonHtml;
};

themeGetter();
themeChanger.addEventListener("click", toggleTheme);
showCardDetail();
