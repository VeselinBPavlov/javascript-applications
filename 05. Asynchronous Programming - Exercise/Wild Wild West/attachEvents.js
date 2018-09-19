function attachEvents() {
    // Get needed URL and authentication data.
    const BASE_URL = 'https://baas.kinvey.com/appdata/kid_rJriZpHNQ/players';
    const USERNAME = 'vesko';
    const PASSWORD = 'v';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };

    // Get jQuery containers and buttons.
    const PLAYERS = $('#players');
    const NEW_PLAYER = $('#addName');
    const ADD_PLAYER_BTN = $('#addPlayer');
    const SAVE_BTN = $('#save');
    const RELOAD_BTN = $('#reload');
    const CANVAS = $('#canvas');

    getPlayers();

    // Add event for new player.
    ADD_PLAYER_BTN.on('click', addNewPlayer);

    // Load all players.
    function getPlayers() {
        $.ajax({
            method: 'GET',
            url: `${BASE_URL}`,
            headers: AUTH_HEADERS
        }).then(renderPlayers)
            .catch(handleError);
    }

    // Render all players.
    function renderPlayers(players) {
        PLAYERS.empty();
        for (let player of players) {
            let playerTemplate = $(`<div class="player" data-id="${player["_id"]}">
                                <div class="row">
                                    <label>Name:</label>
                                    <label class="name">${player['name']}</label>
                                </div>
                                <div class="row">
                                    <label>Money:</label>
                                    <label class="money">${player['money']}</label>
                                </div>
                                <div class="row">
                                    <label>Bullets:</label>
                                    <label class="bullets">${player['bullets']}</label>
                                </div>
                                <button class="play">Play</button>
                                <button class="delete">Delete</button>
                            </div>`);

            PLAYERS.append(playerTemplate);

            // Add events for play and delete for each player.
            const PLAY_BTN = $(`div[data-id='${player["_id"]}'] .play`);
            const DELETE_BTN = $(`div[data-id='${player["_id"]}'] .delete`);

            PLAY_BTN.on('click', play);
            DELETE_BTN.on('click', deletePlayer);
        }
    }

    // Add new player to the list.
    function addNewPlayer() {
        let newPlayer = {
            name: NEW_PLAYER.val(),
            money: 500,
            bullets: 6
        };

        $.ajax({
            method: 'POST',
            url: `${BASE_URL}`,
            headers: AUTH_HEADERS,
            data: JSON.stringify(newPlayer) ,
            contentType: 'application/json'
        }).then(() => {
            NEW_PLAYER.val('');
            getPlayers();
        }).catch(handleError);
    }

    // Play Wild Wild West shooting.
    function play() {
        let parentId = $(this).parent().attr('data-id');
        let name = $(`div[data-id="${parentId}"] .name`).text();
        let money = Number($(`div[data-id="${parentId}"] .money`).text());
        let bullets = Number($(`div[data-id="${parentId}"] .bullets`).text());

        // Save players result and restart game.
        SAVE_BTN.on('click', () => {
            $.ajax({
                method: 'PUT',
                url: `${BASE_URL}/${parentId}`,
                headers: AUTH_HEADERS,
                data: JSON.stringify(player),
                contentType: 'application/json'
            }).then(() => {
                getPlayers();
                SAVE_BTN.attr('style', 'display:none');
                RELOAD_BTN.attr('style', 'display:none');
                CANVAS.attr('style', 'display:none');
                clearInterval(canvas.intervalId);
            }).catch(handleError);
        });

        // Reload the pistol with bullets.
        RELOAD_BTN.on('click', () => {
            player.money -= 60;
            player.bullets += 6;
			player.hasReloaded = true;
            $.ajax({
                method: 'PUT',
                url: `${BASE_URL}/${parentId}`,
                headers: AUTH_HEADERS,
                data: JSON.stringify(player),
                contentType: 'application/json'
            }).then(() => {
                getPlayers();
            }).catch(handleError);
        });

        SAVE_BTN.attr('style', 'display:inline');
        RELOAD_BTN.attr('style', 'display:inline');
        CANVAS.attr('style', 'display:block');

        let player = {
            name: name,
            money: money,
            bullets: bullets,
			hasReloaded: false
        };

        // Load the game for current player.
        loadCanvas(player);
    }

    // Delete player.
    function deletePlayer() {
        let parentId = $(this).parent().attr('data-id');
        $.ajax({
            method: 'DELETE',
            url: `${BASE_URL}/${parentId}`,
            headers: AUTH_HEADERS,
            contentType: 'application/json'
        }).then(getPlayers)
            .catch(handleError);
    }

    // Handle an error.
    function handleError(err) {
        console.log(err);
    }
}