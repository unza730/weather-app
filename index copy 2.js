const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatheritemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForeCastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const API_KEY = 'a802cd7df68c16b0149e57f12b29879f';

// Update time and date
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Format = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12Format < 10 ? '0' + hoursIn12Format : hoursIn12Format) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

// Event listener for search button
searchButton.addEventListener("click", () => {
    const city = searchInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert("Please enter a city or country!");
    }
});

// Fetch weather data by city name
function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.cod === 200) {
                showWeatherData(data);
            } else {
                alert("City not found! Please try again.");
            }
        });
}

// Display weather data
function showWeatherData(data) {
    console.log("Weather data: " + JSON.stringify(data.main));
    const { humidity, pressure, temp, temp_min, temp_max } = data.main;
    const { icon } = data.weather[0];
    const { speed } = data.wind;

    timezone.innerHTML = data.name;
    countryEl.innerHTML = data.sys.country;

    currentWeatheritemsEl.innerHTML = `
        <div class="weather-items">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-items">
            <div>Pressure</div>
            <div>${pressure} hPa</div>
        </div>
        <div class="weather-items">
            <div>Wind Speed</div>
            <div>${speed} m/s</div>
        </div>
    `;

    currentTempEl.innerHTML = `
    <div class="today" id="current-temp">
                <img src=" http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">Monday</div>
                    <div class="temp">Night - 25.6&#176; C</div>
                    <div class="temp">Day - 35.6&#176; C</div>    
                </div>
               </div>
         <div class="other">
            <div class="temp">Temperature: ${temp}&#176;C</div>
            <div class="temp">Min: ${temp_min}&#176;C</div>
            <div class="temp">Max: ${temp_max}&#176;C</div>
        </div>
    `;
}
