// Function to update the clock
function updateClock() {
    const clock = document.querySelector('.clock');
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

 // Update clock elements
    clock.querySelector('.flipper:nth-child(1) span.hours').textContent = hours;
    clock.querySelector('.flipper:nth-child(2) span.minutes').textContent = minutes;
    clock.querySelector('.flipper:nth-child(3) span.seconds').textContent = seconds;
}

// Function for toggles
function toggleActive() {
    const toggles = document.querySelectorAll('.toggle');
    const suggestions = document.querySelectorAll('.suggestion');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.contains('on');

            // Reset suggestions
            suggestions.forEach(suggestion => suggestion.style.display = 'none');

            if (isActive) {
                toggle.classList.remove('on');
                const anyActive = Array.from(toggles).some(t => t.classList.contains('on'));
                if (!anyActive) {
                    hideSuggestionsPanel();
                }
            } else {
                toggle.classList.add('on');

                 // Check if a location has been entered
                const location = document.getElementById('location-input').value;
                if (location) {
                    const weatherType = toggle.getAttribute('data-weather');
                    showSuggestionsPanel(weatherType);
                } else {
                    displayMessage("Please enter a location before selecting an option!");
                    toggle.classList.remove('on');
                }
            }
        });
    });
}

// Function to display error messages
function displayMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageContainer.textContent = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.classList.add('fade-out');
        setTimeout(() => {
            messageContainer.remove();
        }, 500);
    }, 3000);
}

// Function to show the suggestions panel
function showSuggestionsPanel(weatherType) {
    const suggestionsPanel = document.getElementById('suggestions-panel');
    suggestionsPanel.style.display = 'block';
    suggestionsPanel.style.right = '-65%';

    // Show the suggestion corresponding to the weather type
    const suggestions = document.querySelectorAll('.suggestion');
    suggestions.forEach(suggestion => {
        if (suggestion.classList.contains(weatherType)) {
            suggestion.style.display = 'block';
        } else {
            suggestion.style.display = 'none';
        }
    });
}

// Function to display moon phases
function displayMoonPhases() {
    const moonPhasesElement = document.getElementById('moon-phases');
    const today = new Date();
    const phaseIndex = Math.floor(((today.getTime() / 1000) / 86400 + 29.53) % 29.53 / 29.53 * 5);
    const moonPhases = ['Nouă', 'Crescătoare', 'Plină', 'Crescătoare', 'Decrescătoare'];

    // Update moon phases based on the current date
    moonPhasesElement.innerHTML = '';
    moonPhases.forEach((phase, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${phase} - ${index === phaseIndex ? 'Acum' : (index + 1) + ' zile'}`;
        moonPhasesElement.appendChild(listItem);
    });
}

// Function to hide the suggestions panel
function hideSuggestionsPanel() {
    const suggestionsPanel = document.getElementById('suggestions-panel');
    suggestionsPanel.style.right = '-400px';
    setTimeout(() => {
        suggestionsPanel.style.display = 'none';
    }, 300);
}

// Function to get weather based on coordinates
async function getWeather(lat, lon) {
    const apiKey = '6aedbe6e4be17e02fc6fbe92a8593c3f';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

    if (response.ok) {
        const data = await response.json();
        updateWeatherDisplay(data);
    } else {
        displayMessage("Error retrieving weather data. Please try again!");
    }
}

// Function to update the display with weather data
function updateWeatherDisplay(data) {
    const days = document.querySelectorAll('.days .day');
    const currentDate = new Date();

    function getDayName(date) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return daysOfWeek[date.getDay()];
    }

    const currentHour = currentDate.getHours();
    const forecastList = data.list;

    let todayIndex = 0;
    for (let i = 0; i < forecastList.length; i++) {
        const forecastTime = new Date(forecastList[i].dt * 1000).getHours();
        if (forecastTime >= currentHour) {
            todayIndex = i;
            break;
        }
    }

    for (let i = 0; i < 5; i++) {
        const dayElement = days[i];
        const forecastData = forecastList[todayIndex + i * 8];
        const temperature = Math.round(forecastData.main.temp);
        const visibility = forecastData.visibility / 1000;
        const humidity = forecastData.main.humidity;
        const windSpeed = forecastData.wind.speed;
        const weatherDescription = forecastData.weather[0].description;
        const iconCode = forecastData.weather[0].icon;

        const dayDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
        dayElement.innerHTML = `
            <span class="day-label">${getDayName(dayDate)}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">
            <span class="temperature">${temperature}°C</span>
            <div class="visibility">Visibility: <span class="visibility-value">${visibility} km</span></div>
            <div class="humidity">Humidity: <span class="humidity-value">${humidity}%</span></div>
            <div class="wind">Wind: <span class="wind-speed">${windSpeed} m/s</span></div>
            <div class="description">${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}</div>
        `;

        dayElement.classList.add('weather-info');
    }
}

// Function to get coordinates from a location
async function getCoordinates(location) {
    const apiKey = '6aedbe6e4be17e02fc6fbe92a8593c3f';

     // Reset suggestions before a new search
    hideSuggestionsPanel();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);

    if (response.ok) {
        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        getWeather(lat, lon);
    } else {
        displayMessage("Error retrieving coordinates. Please check the entered location!");
    }
}

// Call the function to get the location and weather
document.getElementById('search-btn').addEventListener('click', () => {
    const location = document.getElementById('location-input').value;
    if (location) {
        getCoordinates(location);
    } else {
        displayMessage("Please enter a location!");
    }
});

// Function to reset the weather display
function resetWeatherDisplay() {
    const days = document.querySelectorAll('.days .day');
    days.forEach(day => {
        day.innerHTML = '';
        day.classList.remove('weather-info');
    });
}

// Clear the search box on click
document.getElementById('location-input').addEventListener('click', () => {
    hideSuggestionsPanel();
    document.getElementById('location-input').value = '';


    // Reset the weather display
    resetWeatherDisplay();

    // Reset toggle buttons
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(t => t.classList.remove('on'));
});

// Initialization function
function init() {
    updateClock();
    toggleActive();

    // Disable all toggle buttons at the start
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(toggle => toggle.classList.remove('on'));

    setInterval(updateClock, 1000);
    setTimeout(updateClock, 1000);
}

// Call the initialization function
init();


