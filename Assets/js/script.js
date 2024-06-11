const apiKey = '69ebcec0396b303e1cdb5d85b9a9f627';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// cache the data for 10 minutes
// this allows us to avoid making unnecessary API calls
const maxCacheAge = 1000 * 60 * 10; // 10 minutes

const majorCities = {
    AUSTIN: {name: "austin", lat: 30.2672, lon: -97.7431},
    DALLAS: {name: "dallas", lat: 32.7767, lon: -96.7970},
    BOSTON: {name: "boston", lat: 42.3601, lon: -71.0589},
    NEY_YORK: {name: "new_york", lat: 40.7128, lon: -74.0060},
    SAN_FRANCISCO: {name: "san_francisco", lat: 37.7749, lon: -122.4194},
    CHICAGO: {name: "chicago", lat: 41.8781, lon: -87.6298}
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
