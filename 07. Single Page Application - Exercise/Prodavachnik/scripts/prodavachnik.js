const BASE_URL = 'https://baas.kinvey.com';
const APP_KEY = 'kid_Hk8hPGdN7';
const APP_SECRET = '5da28e6d13c14de9af59a2aa31b52300';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function loginUser() {
    let username = $('#formLogin input[name="username"]').val();
    let password = $('#formLogin input[name="passwd"]').val();

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/user/${APP_KEY}/login`,
        headers: AUTH_HEADERS,
        data: { username, password }
    }).then((res) => {
        signInUser(res, 'Login successful.');
    }).catch(handleAjaxError);
}

function registerUser() {
    let username = $('#formRegister input[name="username"]').val();
    let password = $('#formRegister input[name="passwd"]').val();

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/user/${APP_KEY}/`,
        headers: AUTH_HEADERS,
        data: { username, password }
    }).then((res) => {
        signInUser(res, 'Registration successful.');
    }).catch(handleAjaxError);
}

function listAds() {
    $.ajax({
        method: 'GET',
        url: `${BASE_URL}/appdata/${APP_KEY}/prodavachnik`,
        headers: {
            Authorization: `Kinvey ${sessionStorage.getItem('authToken')}`
        }
    }).then((res) => {
        displayAds(res.reverse());
    }).catch(handleAjaxError);
}


function createAd() {
    let title = $('#formCreateAd input[name="title"]').val();
    let publisher = sessionStorage.getItem('username');
    let description = $('#formCreateAd textarea[name="description"]').val();
    let datePublished = $('#formCreateAd input[name="datePublished"]').val();
    let price = $('#formCreateAd input[name="price"]').val();
    let image = $('#formCreateAd input[name="image"]').val();
    let views = 0;

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/appdata/${APP_KEY}/prodavachnik`,
        headers: {
            Authorization: `Kinvey ${sessionStorage.getItem('authToken')}`
        },
        data: { title, publisher, description, datePublished, price, image, views }
    }).then(() => {
        listAds();
        showView('viewAds');
        showInfo('Advertisement created.');
    }).catch(handleAjaxError);
}

function deleteAd(ad) {
    $.ajax({
        method: 'DELETE',
        url: `${BASE_URL}/appdata/${APP_KEY}/prodavachnik/${ad["_id"]}`,
        headers: {
            Authorization: `Kinvey ${sessionStorage.getItem('authToken')}`
        },
    }).then(() => {
        listAds();
        showInfo('Advertisement deleted.')
    }).catch(handleAjaxError);
}

function loadAdForEdit(ad) {
    showView('viewEditAd');
    $('#formEditAd input[name="title"]').val(ad['title']);
    $('#formEditAd textarea[name="description"]').val(ad['description']);
    $('#formEditAd input[name="datePublished"]').val(ad['datePublished']);
    $('#formEditAd input[name="price"]').val(ad['price']);
    $('#formEditAd input[name="publisher"]').val(sessionStorage.getItem('username'));
    $('#formEditAd input[name="id"]').val(ad['_id']);
    $('#formEditAd input[name="image"]').val(ad['image']);
    $('#formEditAd input[name="views"]').val(ad['views']);
}

function editAd() {
    let title = $('#formEditAd input[name="title"]').val();
    let publisher = $('#formEditAd input[name="publisher"]').val();
    let description = $('#formEditAd textarea[name="description"]').val();
    let datePublished = $('#formEditAd input[name="datePublished"]').val();
    let price = $('#formEditAd input[name="price"]').val();
    let adId = $('#formEditAd input[name="id"]').val();
    let image = $('#formEditAd input[name="image"]').val();
    let views = $('#formEditAd input[name="views"]').val();

    $.ajax({
        method: 'PUT',
        url: `${BASE_URL}/appdata/${APP_KEY}/prodavachnik/${adId}`,
        headers: {
            Authorization: `Kinvey ${sessionStorage.getItem('authToken')}`
        },
        data: { title, publisher, description, datePublished, price, image, views }
    }).then(() => {
        listAds();
        showInfo('Advertisement edited.')
    }).catch(handleAjaxError);
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo['_kmd']['authtoken']);
    sessionStorage.setItem('username', userInfo['username']);
    sessionStorage.setItem('userId', userInfo['_id']);
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/user/${APP_KEY}/_logout`,
        headers: {
            Authorization: `Kinvey ${sessionStorage.getItem('authToken')}`
        }
    }).then(() => {
        sessionStorage.clear();
        showHomeView();
        showHideMenuLinks();
        showInfo('Logout successful.');
    }).catch(handleAjaxError);
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showHideMenuLinks();
    showHomeView();
    showInfo(message);
}

function displayAds(ads) {
    showView('viewAds');
    $('#ads table tr').each((index, element) => {
        if (index > 0) {
            $(element).remove();
        }
    });
    for (let ad of ads) {
        let tr = $('<tr>');
        let adTemplate = $(`<td>${ad.title}</td>
							<td>${ad.publisher}</td>
						    <td>${ad.description}</td>
							<td>${ad.price}</td>
							<td>${ad.datePublished}</td>`);
        tr.append(adTemplate);

        let buttons = $('<td>');
        let readMore = $(`<a href="#">[Read More]</a>`).on('click', () => {
            displayAd(ad);
        });
        buttons.append(readMore);
        if (ad['_acl']['creator'] === sessionStorage.getItem('userId')) {
            let deleteBtn = $(`<a href="#">[Delete]</a>`).on('click', () => {
                deleteAd(ad);
            });
            let editBtn = $(`<a href="#">[Edit]</a>`).on('click', () => {
                loadAdForEdit(ad);
            });
            buttons
                .append(deleteBtn)
                .append(editBtn);
        }
        tr.append(buttons);
        $('#ads table').append(tr);
    }
}

function displayAd(ad) {
    displayDetails(ad);
    showDetails();
    showInfo('Advertisement details.')
}

function displayDetails(ad) {
    let title = $('#viewDisplayAd .titleAd');
    let description = $('#description span');
    let datePublished = $('#publishDate span');
    let price = $('#price span');
    let image = $('#viewDisplayAd img');
    let views = $('#views span');
    let publisher = $('#publisher span');

    title.text(ad['title']);
    image.attr('src', ad['image']);
    image.attr('alt', ad['title']);
    description.text(ad['description']);
    datePublished.text(ad['datePublished']);
    price.text(ad['price']);
    views.text(ad['views']);
    publisher.text(ad['publisher']);
}

function buyAd() {
    let title = $('#viewDisplayAd .titleAd').text();
    let quantity = $('#quantity input');
    let message = `You bought ${quantity.val()} pieces of ${title}!`;
    quantity.val(0);
    listAds();
    showView('viewAds');
    showInfo(message);
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg)
}