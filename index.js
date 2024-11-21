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

const API_KEY = '16842961c50e7d212e5deeee97348fb2';



// When the input is focused, change background and text color
searchInput.addEventListener("focus", () => {
    searchInput.style.backgroundColor = "black";
    searchInput.style.color = "white";
});

// When the input loses focus (blurs), revert to default
searchInput.addEventListener("blur", () => {
    searchInput.style.backgroundColor = "black";
    searchInput.style.color = "white";
});

const getData = async () => {
    let city = "karachi"; // This will be the input from the user.
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
        let res = await fetch(url);
        let data = await res.json();
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        getDataFor5Days(lat, lon); // Fetch 5-day forecast
    } catch (error) {
        console.log(error);
    }
};

const getDataFor5Days = async (lat, lon) => {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
        let res = await fetch(url);
        let data = await res.json();
        console.log("Data for 5 days:", data);
        showWeatherData(data);
    } catch (error) {
        console.log(error);
    }
};

getData();

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
        getCityCoordinates(city);
    } else {
        alert("Please enter a city or country!");
    }
});

// Fetch city coordinates by city name
function getCityCoordinates(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod === 200) {
                const { lat, lon } = data.coord;
                timezone.innerHTML = data.name;
                countryEl.innerHTML = data.sys.country;
                getDataFor5Days(lat, lon); // Fetch 5-day forecast
            } else {
                alert("City not found! Please try again.");
            }
        });
}

// Display current weather and 5-day forecast
function showWeatherData(data) {
    console.log("------- data: ", data);
    const current = data.list[0]; // First entry for current weather
    const { temp, humidity, pressure, wind_speed } = current.main;
    timezone.innerHTML = data?.city?.name;
    countryEl.innerHTML = data?.city?.country;
   
    currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
        <div class="other">
          <div class="day">Today</div>
            <div class="temp">Temp: ${temp}°C</div>
        </div>
    `;

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
            <div>${wind_speed} m/s</div>
        </div>
    `;

    // Weather forecast for the next 5 days (at 12:00 PM for each day)
    weatherForeCastEl.innerHTML = data.list
        .filter((entry, idx) => idx % 8 === 0) // Getting data at 12:00 PM (4 entries per day, 3-hour intervals)
        .slice(0, 7) // Get the first 5 days only
        .map((day) => {
            const dayName = days[new Date(day.dt * 1000).getDay()];
            return `
                <div class="weather-forecast-item">
                    <div class="day">${dayName}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Min: ${day.main.temp_min}&#176;C</div>
                    <div class="temp">Max: ${day.main.temp_max}&#176;C</div>
                </div>
            `;
        })
        .join('');
}
