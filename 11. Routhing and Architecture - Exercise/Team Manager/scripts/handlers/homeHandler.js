handler.homeHandler = function (ctx) {
    ctx.loggedIn = auth.isAuth();
    if (ctx.loggedIn) {
        ctx.username = sessionStorage.getItem('username');
    }
    ctx.hasTeam = auth.hasTeam();
    ctx.teamId = sessionStorage.getItem('teamId');

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/home/home.hbs');
        ctx.redirect('#/home');
    });
};