const fetchData = async url => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Unable to fetch ${url}`);
    return (await res.json());
};

const getCountryDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    const countryName = params.get('name').toLowerCase();

    if (countryName) {
        try {
            const countryData = await fetchData(`https://restcountries.com/v3.1/name/${countryName}`);
            console.log(countryData)
            displayCountryDetails(countryData[0]);
        } catch (error) {
            console.error('Error fetching country data:', error);
            document.querySelector('.country').innerHTML = '<p>Unable to fetch country details. Please refresh page</p>';
        }
        document.querySelector('.no-country').remove()
    } else {
        document.querySelector('.country').innerHTML = '<p>No country specified.</p>';
    }
};

const displayCountryDetails = country => {
    const countryDetailsHTML = `
        <img class="col" src="${country.flags.png}" alt="${country.name.common} Flag">
        <div class="col">
            <h2>${country.name.common}</h2>
            <div class="flex items-start justify-between country-info">
                <div>
                    <p><span>Native Name:</span> ${country.name.nativeName[Object.keys(country.name.nativeName)[0]].common}</p>
                    <p><span>Population:</span> ${country.population}</p>
                    <p><span>Region:</span> ${country.region}</p>
                    <p><span>Sub Region:</span> ${country.subregion}</p>
                    <p><span>Capital:</span> ${country.capital}</p>
                </div>
                <div>
                    <p><span>Top Level Domain:</span> ${country.tld}</p>                            
                    <p><span>Currencies:</span> ${Object.values(country.currencies).map(currency => currency.name).join(', ')}</p>
                    <p><span>Languages:</span> ${Object.values(country.languages).join(', ')}</p>
                </div>
            </div>
            <div class="flex border">
                <h4>Border Countries: </h4>
                ${country.borders ? country.borders.map(border => `<a href="./country.html?name=${border}" class="btn">${border}</a>`).join('') : 'No border countries'}
            </div>
        </div>`;
    document.querySelector('.country').innerHTML = countryDetailsHTML;
};

getCountryDetails();