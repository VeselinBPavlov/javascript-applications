(async () => {
    const DATA = await $.get('./data.json');
    const CONTACT_HTML = await $.get('./templates/contacts.hbs');
    let contactTemplate = Handlebars.compile(CONTACT_HTML);
    let finalData = {contacts: DATA};
    let resultHTML = contactTemplate(finalData);
    $('#list').append(resultHTML);

    const PARTIAL_CONTACTS = await $.get('./templates/partials/personalContacts.hbs');
    const PARTIAL_INFO = await $.get('./templates/partials/personalInfo.hbs');
    Handlebars.registerPartial('personalContacts', PARTIAL_CONTACTS);
    Handlebars.registerPartial('personalInfo', PARTIAL_INFO);

    const DETAILS_HTML = await $.get('./templates/details.hbs');
    let detailsTemplate = Handlebars.compile(DETAILS_HTML);

    $('.contact').on('click', function () {
        $('.content > div').removeClass('contactSelected');
        $(this).addClass('contactSelected');
        let index = $(this).attr('data-id');
        let result = detailsTemplate(DATA[index]);
        $('#details > div').remove();
        $('#details').append(result);
    });
})();