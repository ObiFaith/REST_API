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

const CountryPage = () => `<div class="flex">
<img class="col" src="https://flagcdn.com/w320/af.png" alt="Afghanistan Flag">
<div class="col">
    <h2>Afghanistan</h2>
    <div class="flex items-start justify-between country-info">
        <div>
            <p><span>Native Name:</span> افغانستان</p>                            
            <p><span>Population:</span> 40218234</p>
            <p><span>Region:</span> Asia</p>
            <p><span>Sub Region:</span> Southern Asia</p>
            <p><span>Capital:</span> Kabul</p>
        </div>
        <div>
            <p><span>Top Level Domain:</span> .af</p>                            
            <p><span>Currencies:</span> Afghan afghani</p>
            <p><span>Language:</span> Pashto, Uzbek, Turkmen</p>
        </div>
    </div>
    <div class="flex border">
        <h4>Border Countries: </h4>
        <a href="#" class="btn">France</a>
        <a href="#" class="btn">Germany</a>
        <a href="#" class="btn">Netherlands</a>
    </div>
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

displayContent();