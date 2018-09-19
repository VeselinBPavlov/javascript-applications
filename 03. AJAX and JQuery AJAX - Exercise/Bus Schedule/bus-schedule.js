let result = (function solve() {
    // Get buttons, bus stop and database url.
    const BASE_URL = 'https://judgetests.firebaseio.com/schedule';
    const INFO = $('.info');
    const DEPART_BTN = $('#depart');
    const ARRIVE_BTN = $('#arrive');

    // Set current and next bus stops.
    let currentId = '';
    let nextId = 'depot';

    // Depart the bus with params from get request.
    function depart() {
        $.ajax({
            method: 'GET',
            url: `${BASE_URL}/${nextId}.json`
        }).then((params) => {
            currentId = params["name"];
            INFO.text(`Next stop ${currentId}`);
            DEPART_BTN.attr('disabled', 'disabled');
            ARRIVE_BTN.removeAttr('disabled');
            nextId = params["next"];
        }).catch(handleError);
    }

    // Bus arrive at the current stop.
    function arrive() {
        INFO.text(`Arriving at ${currentId}`);
        ARRIVE_BTN.attr('disabled', 'disabled');
        DEPART_BTN.removeAttr('disabled');
    }

    // Handle error.
    function handleError(err) {
        console.log(err);
    }

    return { depart, arrive };
})();
