const CountryElement = country => `
<div class="country-card">
    <img width='280' height='140' src=${country.flags.png} alt='${country.name.common} Flag'>
    <div class="country-detail">
        <h2><a href="./country.html?name=${country.name.common}">${country.name.common}</a></h2>
        <p><span>Population:</span> ${country.population.toLocaleString()}</p>
        <p><span>Region:</span> ${country.region}</p>
        <p><span>Capital:</span> ${country.capital}</p>
    </div>
</div>`;

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
        const res = await fetch('https://restcountries.com/v3.1/all');
        if (!res.ok) throw new Error(`Unable to fetch ${url}`);        

        let search = '';
        let selectedRegion = '';
        const countries = await res.json()
        const form = document.querySelector('.search-filter').firstElementChild;
        const searchInput = form.querySelector('input');
        const selectElement = document.querySelector('.select select');

        // Initial display with no filters
        updateContent(countries, search, selectedRegion, pageNo, countriesPerPage);

        form.addEventListener('submit', async e => {
            e.preventDefault(); 
            search = searchInput.value.toLowerCase().trim();
            updateContent(countries, search, selectedRegion, pageNo, countriesPerPage);
        });

        searchInput.addEventListener('input', () => {
            search = searchInput.value.toLowerCase().trim();
            updateContent(countries, search, selectedRegion, pageNo, countriesPerPage);
        });

        selectElement.addEventListener('change', () => {
            selectedRegion = selectElement.value;
            updateContent(countries, search, selectedRegion, pageNo, countriesPerPage);
        });

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

displayContent();