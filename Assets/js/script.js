const apiKey = '69ebcec0396b303e1cdb5d85b9a9f627';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// cache the data for 10 minutes
// this allows us to avoid making unnecessary API calls
const cacheLimit = 1000 * 60 * 10; // 10 minutes

// majorCities object
// contains the name, latitude, and longitude of major cities
const majorCities = {
    AUSTIN: {name: "austin", lat: 30.2672, lon: -97.7431},
    DALLAS: {name: "dallas", lat: 32.7767, lon: -96.7970},
    BOSTON: {name: "boston", lat: 42.3601, lon: -71.0589},
    NEY_YORK: {name: "new_york", lat: 40.7128, lon: -74.0060},
    SAN_FRANCISCO: {name: "san_francisco", lat: 37.7749, lon: -122.4194},
    CHICAGO: {name: "chicago", lat: 41.8781, lon: -87.6298}
};

const invalidSearch = []; // array to store invalid search queries

// weatherStorage function
// checks local storage for the weather data of a major city
function weatherMajorStorage(cityName) {
    return JSON.parse(localStorage.getItem('major-' + cityName));
};

// weatherSearchStorage function
// checks local storage for the weather data of a searched city
function weatherSearchStorage(cityName) {
    return JSON.parse(localStorage.getItem('search')) || {};
};

// getWeatherStorage function
// gets the weather data of a city in local storage
function getWeatherStorage(cityName) {
    const cities = weatherSearchStorage() || {};
    return cities[cityName];
};

// setWeatherStorage function
// sets the weather data of a city in local storage
function setWeatherStorage(cityName, data) {
    const cities = weatherSearchStorage() || {};
    cities[cityName] = data;

    return localStorage.setItem('search', JSON.stringify(cities));
};

// getCityData function
// gets the latitude and longitude of a city
async function getCityData(cityName) {

    // check if the city is search was an invalid search
    if (invalidSearch.includes(cityName)) {
        return;
    }

    // check if the city exists in local storage already
    const cityData = getWeatherStorage(cityName);

    // check if the data is still fresh
    if (cityData) {
        // check if the data is still fresh
        if (Date.now() - cityData.timestamp < cacheLimit) { ///////////
            return cityData;
        }
    }

    // make the API request for the city
    const apiReq = await fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}`);
    
    // if request was not successful
    if (!apiReq.ok) {
        // mark the city as an invalid search
        invalidSearch.push(cityName);
        return;
    }

    const jsonReq = await apiReq.json(); // convert the response to JSON

    // if the response is empty
    if (jsonReq.length <= 0) {
        // mark the city as an invalid search
        invalidSearch.push(cityName);
        return;
    };

    const acceptedCity = jsonReq[0]; // get the first city in the response
    const acceptedCityData = {lat: acceptedCity.lat, lon: acceptedCity.lon}; // get the latitude and longitude of the city
    
    // save the data of the city in local storage
    setWeatherStorage(cityName, acceptedCityData);

    return acceptedCityData;
};

// getWeatherData function
// gets the weather data of a city
async function getWeatherData(cityName) {
    cityName = cityName.trim().toLowerCase(); // convert the city name to lowercase
    cityName = cityName.replace(" ", "_"); // remove spaces from the city name and replace with underscores

    // check for stored weather data of the city
    const weatherData = getWeatherStorage(cityName);

    // check if the data is still fresh
    if (weatherData && (Date.now() - cacheLimit) < weatherData.timestamp) {
        return weatherData.data;
    }

    // check if the city is a major city
    const newCity = !Object.values(majorCities).includes(cityName);

    // get the city data
    const cityData = newCity ? await getCityData(cityName) : majorCities[cityName];

    // if the city data is not available make an API request
    const apiReq = await fetch(`${apiUrl}?lat=${cityData.lat}&lon=${cityData.lon}&appid=${apiKey}`);
    // if the request was not successful
    if (!apiReq.ok) {
        alert('Error occurred while fetching the cities weather data');
        return;
    }

    const jsonReq = await apiReq.json(); // convert the response to JSON

    // store the weather data in local storage
    localStorage.setItem('major-' + cityName, JSON.stringify({data: jsonReq, timestamp: Date.now()}));

    return jsonReq;
};

// displayWeather function
async function displayWeather(cityName) {
};

// formatUnix function
// This function takes a unix timestamp and returns a formatted date string
function formatUnix(unixTimestamp) {
    const date = new Date(unixTimestamp);

    // format the date
    const dateFormatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', // 4-digit year
        month: '2-digit', // 2-digit month
        day: '2-digit', // 2-digit day
        hour: '2-digit', // 2-digit hour
        minute: '2-digit', // 2-digit minute
        second: '2-digit' // 2-digit second
    }).format(date);

    return dateFormatted;
}

// formatUnixDate function
// This function takes a unix timestamp and returns the day of the week
function formatUnixDate(unixTimestamp) {
    const date = new Date(unixTimestamp);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = date.getDay();

    return weekdays[weekday];
}

// convert kelvin to fahrenheit
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

// convert kelvin to celsius
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}
