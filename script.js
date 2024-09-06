const API_KEY = 'c42209cba0f5da75289f045af389f4bd';

document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        await fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (response.ok) {
            updateWeatherInfo(data);
        } else {
            alert('City not found. Please enter a valid city name.');
        }
    } catch (error) {
        alert('Failed to fetch weather data.');
        console.error(error);
    }
}

function updateWeatherInfo(data) {
    // Display current weather
    const cityName = data.city.name;
    const timezoneOffset = data.city.timezone;
    const currentWeather = data.list[0];
    const temperature = currentWeather.main.temp;
    const humidity = currentWeather.main.humidity;
    const conditions = currentWeather.weather[0].description;
    const weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    
    document.getElementById('city-name').innerText = `${cityName}`;
    document.getElementById('timezone').innerText = `Timezone: GMT ${timezoneOffset / 3600}`;
    document.getElementById('temperature').innerText = `Temperature: ${temperature}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
    document.getElementById('conditions').innerText = `Conditions: ${conditions}`;
    document.getElementById('weather-icon').src = weatherIcon;

    // Update forecast
    updateForecast(data.list);

    // Show the weather info
    document.getElementById('weather-info').classList.remove('hidden');

    // Update time
    updateTime(timezoneOffset);
}

function updateForecast(weatherList) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';  // Clear previous forecast
    
    // Get a forecast for the next 6 days (skip every 8th entry for 3-hour intervals)
    for (let i = 8; i < weatherList.length; i += 8) {
        const dayWeather = weatherList[i];
        const date = new Date(dayWeather.dt_txt);
        const temperature = dayWeather.main.temp;
        const conditions = dayWeather.weather[0].description;
        const weatherIcon = `https://openweathermap.org/img/wn/${dayWeather.weather[0].icon}@2x.png`;

        const forecastElement = document.createElement('div');
        forecastElement.innerHTML = `
            <h4>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h4>
            <img src="${weatherIcon}" alt="Weather icon">
            <p>${temperature}°C</p>
            <p>${conditions}</p>
        `;

        forecastContainer.appendChild(forecastElement);
    }
}

function updateTime(timezoneOffset) {
    const currentTime = new Date(Date.now() + timezoneOffset * 1000);
    document.getElementById('current-time').innerText = `Current Time: ${currentTime.toLocaleTimeString()}`;
}