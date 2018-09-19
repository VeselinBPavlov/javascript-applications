(function () {
    const KNOCK_URL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock';
    const LOGIN_URL = `https://baas.kinvey.com/user/kid_BJXTsSi-e/login`;
    const USERNAME = 'guest';
    const PASSWORD = 'guest';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };
    const RESULT = $('#result');
    let message = 'Knock Knock.';
    let authToken;

    $.ajax({
        method: 'POST',
        url: LOGIN_URL,
        headers: AUTH_HEADERS,
        data: {
            username: USERNAME,
            password: PASSWORD
        }
    }).then((data) => {
        authToken = data["_kmd"]["authtoken"];
        knockKnock();
    }).catch(handleError);

    function knockKnock() {
        if(message !== '') {
            $.ajax({
                method: 'GET',
                url: `${KNOCK_URL}?query=${message}`,
                headers: {
                    Authorization: `Kinvey ${authToken}`
                }
            }).then((data) => {
                RESULT.append($(`<li>${message}</li>`));
                message = data["message"] || '';
                RESULT.append($(`<li>${data["answer"]}</li>`));

                knockKnock();
            }).catch(handleError);
        }
    }

    function handleError(err) {
        $('body').empty();
        $('body').append($('<h1>It is nothing here</h1>'));
    }
})();