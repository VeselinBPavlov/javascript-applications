function attachEvents() {
    const BASE_URL = 'https://messenger-91d95.firebaseio.com/messenger';
    const TEXT_AREA = $('#messages');
    const AUTHOR = $('#author');
    const MESSAGE = $('#content');
    const SEND_BTN = $('#submit');
    const REFRESH_BTN = $('#refresh');

    SEND_BTN.on('click', addNewMessage);
    REFRESH_BTN.on('click', showMessagesHistory);

    function addNewMessage() {
        let message = MESSAGE.val();
        let author = AUTHOR.val();

        if (author.length === 0 || message.length === 0) {
            return;
        }
        let entityMessage = {
            author: author,
            content: message,
            timestamp: Date.now()
        };
        $.ajax({
            method: 'POST',
            url: `${BASE_URL}.json`,
            data: JSON.stringify(entityMessage)
        }).then(() => {
            AUTHOR.val('');
            MESSAGE.val('');
        }).catch(handleError);
    }

    function showMessagesHistory() {
        $.ajax({
            method: 'GET',
            url: `${BASE_URL}.json`
        }).then((messages) => {
            let chat = '';
            let keys = Object.keys(messages);
            keys.sort((a, b) => messages[a].timestamp - messages[b].timestamp);
            for (let key of keys) {
                chat += `${messages[key].author}: ${messages[key].content}\n`;
            }
            TEXT_AREA.text(chat);
        }).catch(handleError);
    }

    function handleError(err) {
        console.log(err);
    }
}