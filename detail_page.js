const countryName = new URLSearchParams(location.search).get("name");
const borderCountries = document.querySelector(".border-countries");
const themeChanger = document.querySelector(".theme-changer");
const body = document.body;
const API = `https://restcountries.com/v3.1`;

const fetchApiData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const showLoader = () => {
  // const detail = document.querySelector(".country-details");
  // detail.innerHTML = "";
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
};

const hideLoader = () => {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
};

const showCardDetail = async () => {
  showLoader();
  //  setTimeout(async () => {
  try {
    const response = await fetch(`${API}/name/${countryName}?fullText=true`);
    // const done = await new Promise((res) => setTimeout(res, 1000)); // wait
    const [country] = await response.json();
    const flagImage = document.querySelector(".country-details img");
    flagImage.src = country.flags.png;
    const countryNameH1 = document.querySelector(".country-details h1");
    countryNameH1.innerText = country.name.common;
    const population = document.querySelector(".population");
    population.innerText = country.population.toLocaleString("en-IN");
    const region = document.querySelector(".region");
    region.innerText = country.region;
    const topLevelDomain = document.querySelector(".top-level-domain");
    topLevelDomain.innerText = country.tld.join(", ");
    if (country.capital) {
      const capital = document.querySelector(".capital");
      capital.innerText = country.capital?.[0];
    }
    if (country.subregion) {
      const subRegion = document.querySelector(".sub-region");
      subRegion.innerText = country.subregion;
    }
    if (country.name.nativeName) {
      const nativeName = document.querySelector(".native-name");
      nativeName.innerText = Object.values(country.name.nativeName)[0].common;
    } else {
      nativeName.innerText = country.name.common;
    }
    if (country.currencies) {
      const currencies = document.querySelector(".currencies");
      currencies.innerText = Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ");
    }
    if (country.languages) {
      const languages = document.querySelector(".languages");
      languages.innerText = Object.values(country.languages).sort().join(", ");
    }
    if (country.borders) {
      const countries = [];
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
      for (const border of countries) {
        const borderCountryTag = document.createElement("a");
        borderCountryTag.innerText = border;
        borderCountryTag.href = `detail_page.html?name=${border}`;
        borderCountries.append(borderCountryTag);
      }
    } else {
      borderCountries.innerHTML = `<p class="no-border">No Border Countries</p>`;
    }
  } catch (error) {
    console.log(error);
  }
  hideLoader();
};
//   }, 1000);
// };

const themeGetter = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeChanger.innerHTML = '<i class="fa-solid fa-moon"></i>Light Mode';
  }
};

const toggleTheme = () => {
  body.classList.toggle("dark");

  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);

  const buttonHtml = body.classList.contains("dark")
    ? '<i class="fa-solid fa-moon"></i>Light Mode'
    : '<i class="fa-regular fa-moon"></i>Dark Mode';
  themeChanger.innerHTML = buttonHtml;
};

themeGetter();
themeChanger.addEventListener("click", toggleTheme);
showCardDetail();
