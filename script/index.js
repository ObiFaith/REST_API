const CountryElement = () => `
<div class="country-card">
    <img src="https://flagcdn.com/w320/af.png" alt="Afghanistan Flag">
    <div class="country-detail">
        <h2>Afghanistan</h2>
        <p><span>Population:</span> 40218234</p>
        <p><span>Region:</span> Asia</p>
        <p><span>Capital:</span> Kabul</p>
    </div>
</div>`

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
</div>`

const fetchData = async (api) => {
    const res = await fetch(`http://localhost:${portNo}/${api}`)
    if (!res.ok) throw new Error(`Unable to fetch ${api}`)
    return (await res.json())
}