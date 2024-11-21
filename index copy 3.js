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
const getData = async () => {
    let city = "karachi" //input from user.
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      getDatafor7days(lat, lon);
    } catch (error) {
      console.log(error);
    }
  };
  const getDatafor7days = async (lat, lon) => {
    let url =  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      console.log("data-------", data);
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
                getWeatherData(lat, lon);
            } else {
                alert("City not found! Please try again.");
            }
        });
}

// Fetch 7-day weather data using One Call API
function getWeatherData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            showWeatherData(data);
        });
}

// Display current weather and 7-day forecast
function showWeatherData(data) {
    const { humidity, pressure, wind_speed } = data.current;
    const daily = data.daily;

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

    weatherForeCastEl.innerHTML = daily
        .slice(0, 7) // Get 7-day forecast
        .map((day, idx) => {
            const dayName = days[new Date(day.dt * 1000).getDay()];
            return `
                <div class="weather-forecast-item">
                    <div class="day">${dayName}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Min: ${day.temp.min}&#176;C</div>
                    <div class="temp">Max: ${day.temp.max}&#176;C</div>
                </div>
            `;
        })
        .join('');
}
