function attachEvents() {
    // Get needed URLs and authentication info.
    const CALENDAR_URL = 'https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg';
    const VENUES_URL = 'https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg'
    const USERNAME = 'guest';
    const PASSWORD = 'pass';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };

    // Get elements from HTML.
    const DATE = $('#venueDate');
    const GET_VENUES_BTN = $('#getVenues');
    const VENUE_INFO = $('#venue-info');

    // Add event to get venues for the date.
    GET_VENUES_BTN.on('click', getVenues);

    // Get venues for the date.
    function getVenues() {
        let date = DATE.val();
        $.ajax({
            method: 'POST',
            url: `${CALENDAR_URL}/custom/calendar?query=${date}`,
            headers: AUTH_HEADERS
        }).then(loadVenues)
            .catch(handleError);
    }

    // Load all venues for this date.
    function loadVenues(ids) {
        VENUE_INFO.empty();
        for (let id of ids) {
            $.ajax({
                method: 'GET',
                url: `${VENUES_URL}/venues/${id}`,
                headers: AUTH_HEADERS
            }).then(renderVenue)
                .catch(handleError)
        }
    }

    // Create more info about current venue.
    function renderVenue(venue) {
        let venueTemplate = $(`<div class="venue" id="${venue["_id"]}">
  <span class="venue-name"><input class="info" type="button" value="More info">${venue["name"]}</span>
  <div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${venue["price"]} lv</td>
        <td><select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></td>
        <td><input class="purchase" type="button" value="Purchase"></td>
      </tr>
    </table>
    <span class="head">Venue description:</span>
    <p class="description">${venue['description']}</p>
    <p class="description">Starting time: ${venue["startingHour"]}</p>
  </div>
</div>`);

        VENUE_INFO.append(venueTemplate);

        const MORE_INFO_BTN = $(`#${venue['_id']} .info`);

        MORE_INFO_BTN.on('click', renderInfo)
    }

    // Show information about the show.
    function renderInfo() {
        let parentId = $(this).parent().parent().attr('id');
        let venueInfo = $(`#${parentId} .venue-details`);
        venueInfo.attr('style', 'display:block');

        const PURCHASE_BTN = $(`#${parentId} .purchase`);
        PURCHASE_BTN.on('click', purchaseTickets);
    }

    // Purchase tickets for the show.
    function purchaseTickets() {
        let parentId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
        let venueName = $(`#${parentId} .venue-name`).text();
        let venuePriceLv = $(`#${parentId} .venue-price`).text();
        let venuePrice = venuePriceLv.slice(0, 2);
        let venueQuantity = $(`#${parentId} .quantity option:selected`).text();

        let totalSum = Number(venueQuantity) * Number(venuePrice);

        let confirmTemplate = $(`<span class="head">Confirm purchase</span>
                                <div class="purchase-info">
                                    <span>${venueName}</span>
                                    <span>${venueQuantity} x ${venuePrice} lv</span>
                                    <span>Total: ${totalSum} lv</span>
                                    <input type="button" value="Confirm">
                                </div>`);
        VENUE_INFO.empty();
        VENUE_INFO.append(confirmTemplate);

        const CONFIRM_BTN = $(`.purchase-info input`);

        CONFIRM_BTN.on('click', () => {
            $.ajax({
                method: 'POST',
                url: `${CALENDAR_URL}/custom/purchase?venue=${parentId}&qty=${venueQuantity}`,
                headers: AUTH_HEADERS
            }).then(confirmTickets)
                .catch(handleError);
        });
    }

    // Confirm order of tickets.
    function confirmTickets(confirm) {
        let confirmTemplate = $(`${confirm["html"]}`);
        VENUE_INFO.empty();
        VENUE_INFO.append($('<p>You may print this page as your ticket</p>'))
        VENUE_INFO.append(confirmTemplate);
    }

    // Display error if date is invalid.
    function handleError(err) {
        VENUE_INFO.empty();
        VENUE_INFO.append($('<h1>Invalid Date!</h1>'));
    }
}