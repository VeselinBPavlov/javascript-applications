handler.homeGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    if (ctx.isAuth) {
        ctx.username = sessionStorage.getItem('username');
    }

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/listFlights.hbs');
    });
};