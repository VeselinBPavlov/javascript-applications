function attachEvents() {
    // Get URL and authentication data.
    const BASE_URL = 'https://baas.kinvey.com/appdata/kid_HkcDgmQV7/biggestCatches';
    const USERNAME = 'vesko';
    const PASSWORD = 'v';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };

    // Get container and input fields.
    const CATCHES = $('#catches');
    const ANGLER = $('#addForm .angler');
    const WEIGHT = $('#addForm .weight');
    const SPECIES = $('#addForm .species');
    const LOCATION = $('#addForm .location');
    const BAIT = $('#addForm .bait');
    const CAPTURE_TIME = $('#addForm .captureTime');
    const ADD_BTN = $('#addForm .add');
    const LOAD_BTN = $('#aside .load');

    // Attach events on buttons.
    LOAD_BTN.on('click', getCatches);
    ADD_BTN.on('click', addCatch);

    // Get catches from database.
    function getCatches() {
        $.ajax({
            method: 'GET',
            url: BASE_URL,
            headers: AUTH_HEADERS
        }).then(loadCatches)
            .catch(handleError)
    }

    // Load all catches.
    function loadCatches(catches) {
        CATCHES.empty();
        for (let haul of catches) {
            let divCatch = $(`<div class="catch" data-id="${haul["_id"]}">`);
            let labelAngler = $('<label>Angler</label>');
            let inputAngler = $(`<input type="text" class="angler" value="${haul["angler"]}"/>`);
            let labelWeight = $('<label>Weight</label>');
            let inputWeight = $(`<input type="number" class="weight" value="${haul["weight"]}"/>`);
            let labelSpecies = $('<label>Species</label>');
            let inputSpecies = $(`<input type="text" class="species" value="${haul["species"]}"/>`);
            let labelLocation = $('<label>Location</label>');
            let inputLocation = $(`<input type="text" class="location" value="${haul["location"]}"/>`);
            let labelBite = $('<label>Bait</label>');
            let inputBite = $(`<input type="text" class="bait" value="${haul["bait"]}"/>`);
            let labelCaptureTime = $('<label>Capture Time</label>');
            let inputCaptureTime = $(`<input type="number" class="captureTime" value="${haul["captureTime"]}"/>`);
            let updateBtn = $('<button class="update">Update</button>');
            let deleteBtn = $('<button class="delete">Delete</button>');

            divCatch
                .append(labelAngler)
                .append(inputAngler)
                .append(labelWeight)
                .append(inputWeight)
                .append(labelSpecies)
                .append(inputSpecies)
                .append(labelLocation)
                .append(inputLocation)
                .append(labelBite)
                .append(inputBite)
                .append(labelCaptureTime)
                .append(inputCaptureTime)
                .append(updateBtn)
                .append(deleteBtn);

            CATCHES.append(divCatch);

            // Attach events on buttons and update and delete catches.
            const UPDATE_BTN = $(`div[data-id='${haul["_id"]}'] .update`);
            const DELETE_BTN = $(`div[data-id='${haul["_id"]}'] .delete`);

            UPDATE_BTN.on('click', () => {
                let angler = $(`div[data-id='${haul["_id"]}'] .angler`);
                let weight = $(`div[data-id='${haul["_id"]}'] .weight`);
                let species = $(`div[data-id='${haul["_id"]}'] .species`);
                let location = $(`div[data-id='${haul["_id"]}'] .location`);
                let bait = $(`div[data-id='${haul["_id"]}'] .bait`);
                let captureTime = $(`div[data-id='${haul["_id"]}'] .captureTime`);

                let update = {
                    angler: angler.val(),
                    weight: Number(weight.val()),
                    species: species.val(),
                    location: location.val(),
                    bait: bait.val(),
                    captureTime: Number(captureTime.val())
                };

                $.ajax({
                    method: 'PUT',
                    url: `${BASE_URL}/${haul["_id"]}`,
                    headers: AUTH_HEADERS,
                    data: JSON.stringify(update),
                    contentType: 'application/json'
                }).then(() => {
                    getCatches();
                }).catch(handleError);
            });

            DELETE_BTN.on('click', () => {
                $.ajax({
                    method: 'DELETE',
                    url: `${BASE_URL}/${haul["_id"]}`,
                    headers: AUTH_HEADERS,
                    contentType: 'application/json'
                }).then(() => {
                    divCatch.remove();
                }).catch(handleError);
            });
        }
    }

    // Add new catch in database.
    function addCatch() {
        let entityCatch = {
            angler: ANGLER.val(),
            weight: Number(WEIGHT.val()),
            species: SPECIES.val(),
            location: LOCATION.val(),
            bait: BAIT.val(),
            captureTime: Number(CAPTURE_TIME.val())
        };

        $.ajax({
            method: 'POST',
            url: BASE_URL,
            headers: AUTH_HEADERS,
            data: JSON.stringify(entityCatch),
            contentType: 'application/json'
        }).then(() => {
            getCatches();
            ANGLER.val('');
            WEIGHT.val('');
            SPECIES.val('');
            LOCATION.val('');
            BAIT.val('');
            CAPTURE_TIME.val('');
        }).catch(handleError);
    }

    // Handle an error.
    function handleError(err) {
        console.log(err);
    }
}