const BASE_URL = 'https://phonebook-770ef.firebaseio.com/phonebook';
const TABLE = $('#phonebook');
const PERSON = $('#person');
const PHONE = $('#phone');

// Add events to buttons.
$('#btnCreate').on('click', createContact);
$('#btnLoad').on('click', loadContact);

// Create new contact in database and put it into phone book.
function createContact() {
    let name = PERSON.val();
    let phone = PHONE.val();

    if (name.trim() !== '' && phone.trim() !== '') {
        $.ajax({
            method: 'POST',
            url: BASE_URL + '.json',
            data: JSON.stringify({ name, phone })
        }).then(function () {
            addContact(name, phone);
            PERSON.val('');
            PHONE.val('');
        })
            .catch(handleError);
    }
}

// Add contacts to the phone book.
function appendContacts(contacts) {
    TABLE.empty();
    let keys = Object.keys(contacts);
    keys.sort((a, b) => contacts[a].name.localeCompare(contacts[b].name));
    for (let id of keys) {
        addContact(contacts[id].name, contacts[id].phone, id);
    }
}

// Throw error.
function handleError(err) {
    console.log(err);
}

// Add contact to the list.
function addContact(name, phone, id) {
    let li = $(`<li>${name}: ${phone} </li>`);
    let deleteBTN = $('<button id="btnDelete"> Delete</button>');
    deleteBTN.on('click', () => {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + '/' + id + '.json'
        }).then(function () {
            li.remove();
        }).catch(handleError);
    });
    li.append(deleteBTN);
    TABLE.append(li);
}

// Load all created contacts from database.
function loadContact() {
    $.ajax({
        method: "GET",
        url: BASE_URL + '.json'
    }).then(appendContacts)
        .catch(handleError);
}



