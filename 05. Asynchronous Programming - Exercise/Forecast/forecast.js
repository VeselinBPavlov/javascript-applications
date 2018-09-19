function attachEvents() {
    // Get needed URLs.
    const LOCATIONS_URL = 'https://judgetests.firebaseio.com/locations.json';
    const FORECAST_TODAY_URL = 'https://judgetests.firebaseio.com/forecast/today';
    const FORECAST_UPCOMING_URL = 'https://judgetests.firebaseio.com/forecast/upcoming';

    // Get needed containers.
    const FORECAST = $('#forecast');
    const CURRENT = $('#current');
    const UPCOMING = $('#upcoming');
    const LOCATION = $('#location');
    const FORECAST_BTN = $('#submit');

    // Forecast symbols.
    const SYMBOLS = {
        "Sunny": '&#x2600',
        "Partly sunny": '&#x26C5',
        "Overcast": '&#x2601',
        "Rain": '&#x2614'
    };

    // Attach event on forecast button.
    FORECAST_BTN.on('click', getForecast);

    // Get locations of forecast.
    function getForecast() {
        if (LOCATION.val().trim() === '') {
            return;
        }

        $.ajax({
            method: 'GET',
            url: LOCATIONS_URL
        }).then(getCurrentWeather)
            .catch(handleError);
    }

    // Get weather of current location.
    function getCurrentWeather(locations) {
        let isValidLocation = false;
        let forecastLocation = {};
        for (let location of locations) {
            if (location.name === LOCATION.val()){
                isValidLocation = true;
                forecastLocation = location;
                break;
            }
        }
        if (isValidLocation === false) {
            handleError('Error');
            return;
        }
        getCurrentConditions(forecastLocation);
    }

    // Get conditions  and upcoming forecast data for current location.
    function getCurrentConditions(location) {
        $.ajax({
            method: 'GET',
            url: `${FORECAST_TODAY_URL}/${location.code}.json`
        }).then(loadCurrentCondition)
            .catch(handleError);

        $.ajax({
            method: 'GET',
            url: `${FORECAST_UPCOMING_URL}/${location.code}.json`
        }).then(loadUpcomingConditions)
            .catch(handleError);
    }

    // Load current weather for location.
    function loadCurrentCondition(condition) {
        CURRENT.empty();
        CURRENT.append($('<div class="label">Current condition</div>'));
        let symbol = SYMBOLS[condition["forecast"]["condition"]];
        let weather = condition["forecast"]["condition"];
        let location = condition["name"];
        let lowTemp = condition["forecast"]["low"];
        let highTemp = condition["forecast"]["high"];
        let degreesSym = '&#176';

        let spanSymbol = $(`<span class="condition symbol">${symbol}</span>`);
        let spanCondition = $(`<span class="condition">`);
        let spanLocation = $(`<span class="forecast-data">${location}</span>`);
        let spanLowHigh = $(`<span class="forecast-data">${lowTemp}${degreesSym}/${highTemp}${degreesSym}</span>`);
        let spanWeather = $(`<span class="forecast-data">${weather}</span>`);

        spanCondition
            .append(spanLocation)
            .append(spanLowHigh)
            .append(spanWeather);

        CURRENT
            .append(spanSymbol)
            .append(spanCondition);
        FORECAST.removeAttr('style');
    }

    // Load upcoming conditions for location.
    function loadUpcomingConditions(conditions) {
        UPCOMING.empty();
        UPCOMING.append($('<div class="label">Three-day forecast</div>'));
        for (let condition of conditions["forecast"]) {
            console.log(condition);
            let symbol = SYMBOLS[condition["condition"]];
            let weather = condition["condition"];
            let lowTemp = condition["low"];
            let highTemp = condition["high"];
            let degreesSym = '&#176';

            let spanUpcoming = $(`<span class="upcoming">`);
            let spanSymbol = $(`<span class="symbol">${symbol}</span>`);
            let spanLowHigh = $(`<span class="forecast-data">${lowTemp}${degreesSym}/${highTemp}${degreesSym}</span>`);
            let spanWeather = $(`<span class="forecast-data">${weather}</span>`);

            spanUpcoming
                .append(spanSymbol)
                .append(spanLowHigh)
                .append(spanWeather);

            UPCOMING.append(spanUpcoming);
        }
        LOCATION.val('');
    }

    function handleError(err) {
        CURRENT.empty();
        UPCOMING.empty();
        FORECAST.removeAttr('style');
        CURRENT.append($(`<span>${err}</span>`));
        LOCATION.val('');
    }
}