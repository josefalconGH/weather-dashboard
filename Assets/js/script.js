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

function formatUnixDate(unixTimestamp) {
    const date = new Date(unixTimestamp);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = date.getDay();

    return weekdays[weekday];
}