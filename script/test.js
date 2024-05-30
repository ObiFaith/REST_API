const CountryElement = country => `
<div class="country-card">
    <img width='280' height='140' src=${country.flags.png} alt=${country.name + ' Flag'}>
    <div class="country-detail">
        <h2><a href="./country.html">${country.name.common}</a></h2>
        <p><span>Population:</span> ${country.population}</p>
        <p><span>Region:</span> ${country.region}</p>
        <p><span>Capital:</span> ${country.capital}</p>
    </div>
</div>`;

const fetchData = async url => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Unable to fetch ${url}`);
	return await res.json();
};

const updateContent = (countries, search, region, pageNo, countriesPerPage) => {
    // Filter countries based on search query and region
    const filteredCountries = countries.filter(country => 
        country.name.common.toLowerCase().includes(search) &&
        (region === '' || country.region === region)
    );
    
    const startIndex = (pageNo - 1) * countriesPerPage;
    const endIndex = startIndex + countriesPerPage;
    const currentCountries = filteredCountries.slice(startIndex, endIndex);

    const countriesHTML = document.querySelector('div.countries');
    countriesHTML.innerHTML = currentCountries.length > 0 ? currentCountries.map(country => CountryElement(country)).join('') : '<div class="no-country col text-center">No such country</div>';

    // Update pagination based on filtered countries
    const maxPageNo = Math.ceil(filteredCountries.length / countriesPerPage);
    const pagination = document.querySelector('div.pagination');
    pagination.innerHTML = maxPageNo > 1 ? [...Array(maxPageNo)].map((_, index) => `<div ${index + 1 === pageNo ? `class='active'` : ''}>${index + 1}</div>`).join('') : '';
};
        
const displayContent = async (pageNo = 1, countriesPerPage = 27) => {
    try {
        // Fetch countries data: http://localhost:3000/countries or https://rest-api-754c.onrender.com
        const countries = await fetchData('https://restcountries.com/v3.1/all');
        // Initial display with no filters
        let search = '';
        let selectedRegion = '';

        const form = document.querySelector('.search-filter').firstElementChild;
        const searchInput = form.querySelector('input');
        searchInput.value = ''; // Clear previous value

        // Update content initially
        updateContent(countries, search, selectedRegion, pageNo, countriesPerPage);

        form.addEventListener('submit', e => {
            e.preventDefault(); // Prevent page refresh
            search = searchInput.value.toLowerCase().trim();
            updateContent(countries, search, selectedRegion, 1, countriesPerPage); // Reset to first page on search
        });

        searchInput.addEventListener('input', () => {
            search = searchInput.value.toLowerCase().trim();
            updateContent(countries, search, selectedRegion, 1, countriesPerPage); // Reset to first page on search
        });

        // Handle region selection
        const selectElement = document.querySelector('.select select');
        selectElement.addEventListener('change', (event) => {
            selectedRegion = event.target.value;
            updateContent(countries, search, selectedRegion, 1, countriesPerPage); // Reset to first page on region change
        });

        // Handle pagination clicks
        document.querySelector('div.pagination').addEventListener('click', e => {
            if (e.target.tagName === 'DIV') {
                const selectedPageNo = Number(e.target.textContent);
                updateContent(countries, search, selectedRegion, selectedPageNo, countriesPerPage);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

//displayContent();

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
            document.querySelector('.country').innerHTML = '<p>Unable to fetch country details</p>';
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