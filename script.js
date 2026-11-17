const API_KEY = "1349cf2287ee70f2f33014d2b64d9070";


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const forecast = document.getElementById("forecast");

const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");

const themeBtn = document.getElementById("themeBtn");


let currentCity = "";




async function getWeather(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

    return {
        city: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
    };
}





async function searchWeather(city) {

    if (city.trim() === "") {
        showError("Please enter a city name");
        return;
    }

    try {

        

        loading.style.display = "block";
        errorMsg.style.display = "none";
        weatherCard.style.display = "none";

        

        const weather = await getWeather(city);

    

        currentCity = weather.city;


        document.getElementById("cityName").textContent =
            weather.city;

        document.getElementById("temperature").textContent =
            weather.temp;

        document.getElementById("feelsLike").textContent =
            weather.feelsLike;

        document.getElementById("description").textContent =
            weather.description;

        document.getElementById("humidity").textContent =
            weather.humidity;

        document.getElementById("windSpeed").textContent =
            weather.windSpeed;

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

        weatherCard.style.display = "block";


    } catch (error) {

        showError(error.message);

    } finally {


        loading.style.display = "none";
    }
}




function showError(message) {

    errorMsg.textContent = message;

    errorMsg.style.display = "block";

    weatherCard.style.display = "none";
}



function addFavorite() {

    if (currentCity === "") {
        return;
    }

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];



    if (favorites.includes(currentCity)) {

        alert("City already in favorites");

        return;
    }


    favorites.push(currentCity);


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    loadFavorites();
}



function loadFavorites() {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];


    favoritesList.innerHTML = "";


    favorites.forEach(function(city) {

        const item = document.createElement("div");

        item.className = "favorite-item";


        item.innerHTML = `
            <span>${city}</span>

            <div>
                <button onclick="searchWeather('${city}')">
                    Search
                </button>

                <button
                    class="remove-btn"
                    onclick="removeFavorite('${city}')">
                    Remove
                </button>
            </div>
        `;


        favoritesList.appendChild(item);

    });
}



function removeFavorite(city) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];


    favorites = favorites.filter(function(item) {

        return item !== city;

    });


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    loadFavorites();
}



let timer;


function debounceSearch() {

    clearTimeout(timer);


    timer = setTimeout(function() {

        const city = cityInput.value;

        if (city.trim() !== "") {

            searchWeather(city);

        }

    }, 1000);
}



searchBtn.addEventListener("click", function() {

    searchWeather(cityInput.value);

});



cityInput.addEventListener("input", function() {

    debounceSearch();

});



favoriteBtn.addEventListener("click", function() {

    addFavorite();

});



themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️ Light";

    } else {

        themeBtn.textContent = "🌙 Dark";

    }

});




document.addEventListener("DOMContentLoaded", function() {

    loadFavorites();

});