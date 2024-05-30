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
            const countryData = await fetchData(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            await displayCountryDetails(countryData[0]);
        } catch (error) {
            console.error('Error fetching country data:', error);
            document.querySelector('.country').innerHTML = '<p>Unable to fetch country details.</p>';
        }
    } else {
        document.querySelector('.country').innerHTML = '<p>No country specified.</p>';
    }

    document.querySelector('.no-country').remove()
};

const fetchBorderCountryNames = async (borders) => {
    if (!borders || borders.length === 0) return 'No border countries';

    const borderCountries = await fetchData(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`);
    return borderCountries.map(borderCountry => `<a href="./country.html?name=${borderCountry.name.common}" class="btn">${borderCountry.name.common}</a>`).join('');
};

const displayCountryDetails = async country => {
    const borderCountriesHTML = await fetchBorderCountryNames(country.borders);

    const countryDetailsHTML = `
        <img class="col" src="${country.flags.png}" alt="${country.name.common} Flag">
        <div class="col">
            <h2>${country.name.common}</h2>
            <div class="flex items-start justify-between country-info">
                <div>
                    <p><span>Native Name:</span> ${country.name.nativeName ? country.name.nativeName[Object.keys(country.name.nativeName)[0]].common : country.name.common}</p>                            
                    <p><span>Population:</span> ${country.population.toLocaleString()}</p>
                    <p><span>Region:</span> ${country.region}</p>
                    <p><span>Sub Region:</span> ${country.subregion}</p>
                    <p><span>Capital:</span> ${country.capital}</p>
                </div>
                <div>
                    <p><span>Top Level Domain:</span> ${country.tld.join(', ')}</p>                            
                    <p><span>Currencies:</span> ${Object.values(country.currencies).map(currency => currency.name).join(', ')}</p>
                    <p><span>Languages:</span> ${Object.values(country.languages).join(', ')}</p>
                </div>
            </div>
            <div class="flex border">
                <h4>Border Countries: </h4>
                ${borderCountriesHTML}
            </div>
        </div>`;
    document.querySelector('.country').innerHTML = countryDetailsHTML;
};

getCountryDetails();