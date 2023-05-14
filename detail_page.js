const countryName = new URLSearchParams(location.search).get("name");
const flagImage = document.querySelector(".country-details img");
const countryNameH1 = document.querySelector(".country-details h1");
const nativeName = document.querySelector(".native-name");
const population = document.querySelector(".population");
const region = document.querySelector(".region");
const subRegion = document.querySelector(".sub-region");
const capital = document.querySelector(".capital");
const topLevelDomain = document.querySelector(".top-level-domain");
const currencies = document.querySelector(".currencies");
const languages = document.querySelector(".languages");
const borderCountries = document.querySelector(".border-countries");
const themeChanger = document.querySelector(".theme-changer");
const body = document.body;
const API = `https://restcountries.com/v3.1`;

const fetchApiData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const showCardDetail = () => {
  fetch(`${API}/name/${countryName}?fullText=true`)
    .then((res) => res.json())
    .then(([country]) => {
      flagImage.src = country.flags.png;
      flagImage.style.width = "300";
      flagImage.style.height = "150";
      countryNameH1.innerText = country.name.common;
      population.innerText = country.population.toLocaleString("en-IN");
      region.innerText = country.region;
      topLevelDomain.innerText = country.tld.join(", ");
      if (country.capital) {
        capital.innerText = country.capital?.[0];
      }

      if (country.subregion) {
        subRegion.innerText = country.subregion;
      }

      if (country.name.nativeName) {
        nativeName.innerText = Object.values(country.name.nativeName)[0].common;
      } else {
        nativeName.innerText = country.name.common;
      }

      if (country.currencies) {
        currencies.innerText = Object.values(country.currencies)
          .map((currency) => currency.name)
          .join(", ");
      }

      if (country.languages) {
        languages.innerText = Object.values(country.languages)
          .sort()
          .join(", ");
      }

      if (country.borders) {
        const countries = [];
        country.borders.map(async (border) => {
          try {
            const [borderCountry] = await fetchApiData(
              `${API}/alpha/${border}`
            );
            countries.push(borderCountry.name.common);
          } catch (error) {
            console.log(error);
          }
        });
        setTimeout(() => {
          countries.sort();
          for (border of countries) {
            const borderCountryTag = document.createElement("a");
            borderCountryTag.innerText = border;
            borderCountryTag.href = `detail_page.html?name=${border}`;
            borderCountries.append(borderCountryTag);
          }
        }, 1000);
      } else {
        borderCountries.innerHTML += `<p class="no-border">No Border Countries</p>`;
      }
    });
};

const themeGetter = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeChanger.innerHTML =
      '<i class="fa-solid fa-moon"></i>&nbsp;&nbsp;Light Mode';
  }
};

const toggleTheme = () => {
  // Toggle the body class
  body.classList.toggle("dark");
  // Update the theme preference in local storage
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  // Update the button text from dark to light OR Vice Versa
  const buttonHtml = body.classList.contains("dark")
    ? '<i class="fa-solid fa-moon"></i>&nbsp;&nbsp;Light Mode'
    : '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
  themeChanger.innerHTML = buttonHtml;
};

/*Functions are being called here*/
themeGetter();
themeChanger.addEventListener("click", toggleTheme);
showCardDetail();
