function getInfo() {
    // Get containers and database url.
    const STOP_ID = $('#stopId');
    const STOP_NAME = $('#stopName');
    const BUSES_LIST = $('#buses');
    const BASE_URL = 'https://judgetests.firebaseio.com/businfo';

    // Make request to database and show bus stops.
    let stopId = STOP_ID.val();
    if (stopId.trim() !== '') {
        $.ajax({
            method: 'GET',
            url: `${BASE_URL}/${stopId}.json`
        }).then(addBusStops)
            .catch(handleError);
    }

    // Make list of bus stops full.
    function addBusStops(stopId) {
        BUSES_LIST.empty();
        STOP_NAME.text(`${stopId.name}`);
        for (let key in stopId["buses"]) {
            let li = $(`<li>Bus ${key} arrives in ${stopId['buses'][key]} minutes</li>`);
            BUSES_LIST.append(li);
        }
    }

    // Handle error.
    function handleError(err) {
        STOP_NAME.text('Error');
    }
}