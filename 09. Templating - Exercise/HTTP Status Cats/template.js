(async () => {
    const BODY = $('body');
    const CATS_HTML = await $.get('./cats.hbs');
    let catTemplate = Handlebars.compile(CATS_HTML);

    let catsObj = {catsArr: cats};

    let result = catTemplate(catsObj);
    BODY.append(result);

    $('.btn-primary').on('click', function () {
        if ($(this).text() === 'Show status code') {
            $(this).text('Hide status code');
            $(this).next().attr('style', 'display:inline');
            $(this).parent().parent().children('img').attr('style', 'height:240px');
        } else {
            $(this).text('Show status code');
            $(this).next().attr('style', 'display:none');
            $(this).parent().parent().children('img').removeAttr('style');
        }
    });
})();
