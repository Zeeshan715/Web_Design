const getFlagData = async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    const cardContainer = document.getElementById('card-container');
    data.forEach(item => {
      const card = document.createElement('div');
      card.innerHTML = `
        <img src="${item.flags.png}" alt="${item.name.common} flag">
        <h2>${item.name.common}</h2>
        <p><b>Population:</b> ${item.population}</p>
        <p><b>Region:</b> ${item.region}</p>
        <p><b>Capital:</b> ${item.capital}</p>
      `;
      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
};

getFlagData();

