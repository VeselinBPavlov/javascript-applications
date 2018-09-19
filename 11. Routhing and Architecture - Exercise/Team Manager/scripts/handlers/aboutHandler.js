handler.aboutHandler = function (ctx) {
    ctx.loggedIn = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/about/about.hbs');
    });
};