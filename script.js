let contName = document.querySelector(".contName");
let capital = document.querySelector(".capital span");
let region = document.querySelector(".region span");
let population = document.querySelector(".population span");
let currency = document.querySelector(".currency span");
let temp = document.querySelector(".temp span");
let humidity = document.querySelector(".humidity span");
let pressure = document.querySelector(".pressure span");
let wind = document.querySelector(".wind span");
let timezoneSpan = document.querySelector(".time span");
let sunriseSpan = document.querySelector(".sunrise span");
let sunsetSpan = document.querySelector(".sunset span");
let flag = document.querySelector(".flag");
let code;

let input = document.querySelector("#input");
let btn = document.querySelector("#btn");


let loader = document.getElementById("loader");

function showLoader() {
    loader.style.display = "block";
}

// Hide loader
function hideLoader() {
    loader.style.display = "none";
}


btn.addEventListener("click", async () => {
    showLoader();
    try {
        await renderCard();
        await fetchCont(input.value);
        await fetchFlag(code);
        await fetchWeather(capital.innerText);
    } catch (error) {
        alert("Something went wrong!");
        console.error(error);
    }
    hideLoader();
    input.value = "";
});




function renderCard() {
    let card = document.querySelector(".card");
    card.style.display = "flex";
}

async function fetchCont(input) {
    let response = await fetch(`https://api.api-ninjas.com/v1/country?name=${input}`, {
        method: 'GET',
        headers: { "X-Api-Key": "sSaDDWZzcjgsdxqZNq9aQA==uy0fWi4irry9BDHV" }
    })
    let data = await response.json();
    if (data.length === 0) {
        alert("Location not found!");
        return;
    }
    contName.innerText = data[0].name;
    capital.innerText = data[0].capital;
    region.innerText = data[0].region;
    population.innerText = data[0].population;
    currency.innerText = `${data[0].currency.code} (${data[0].currency.name})`;
    code = data[0].iso2;
}


async function fetchWeather(input) {
    let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=2bdf2700ada2189397424c40aefd7453`)
    let data = await response.json();
    if (data.length === 0) {
        alert("Location not found!");
        return;
    }
    fetchWeather2(data[0].lon, data[0].lat);
}


async function fetchWeather2(lon, lat) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2bdf2700ada2189397424c40aefd7453&units=metric`);
    let data = await response.json();
    if (!data || !data.main) {
        alert("Weather data not found!");
        return;
    }
    temp.innerText = data.main.temp + " °C";
    humidity.innerText = data.main.humidity + " %";
    pressure.innerText = data.main.pressure + " hPa";
    wind.innerText = data.wind.speed + " m/s";

    const timezoneOffset = data.timezone;
    const nowUTC = Math.floor(Date.now() / 1000);
    const localTime = new Date((nowUTC + timezoneOffset) * 1000);

    const sunriseUTC = data.sys.sunrise;
    const sunsetUTC = data.sys.sunset;
    const sunriseLocal = new Date((sunriseUTC + timezoneOffset) * 1000);
    const sunsetLocal = new Date((sunsetUTC + timezoneOffset) * 1000);

    const formatTime = date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    timezoneSpan.innerText = formatTime(localTime);
    sunriseSpan.innerText = formatTime(sunriseLocal);
    sunsetSpan.innerText = formatTime(sunsetLocal);
}


async function fetchFlag(input) {
    const response = await fetch(`https://flagcdn.com/w320/${input.toLowerCase()}.png`);
    let data = await response.blob();
    let imageUrl = URL.createObjectURL(data);
    flag.innerHTML = `<img src="${imageUrl}" crossorigin="anonymous">`;

    const flagImg = document.querySelector('.flag img');

    flagImg.onload = function () {
        setBG(flagImg);
    };
}

const colorThief = new ColorThief();

function setBG(flagImg) {
    if (!flagImg || !flagImg.complete) {
        console.error("Flag image not loaded yet!");
        return;
    }

    const dominantColor = colorThief.getColor(flagImg);
    const rgb = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
    const darkerShade = `rgb(${dominantColor[0] * 0.6}, ${dominantColor[1] * 0.6}, ${dominantColor[2] * 0.6})`;
    document.querySelector('.card .left').style.background = `linear-gradient(to bottom right, ${rgb}, ${darkerShade})`;
}

