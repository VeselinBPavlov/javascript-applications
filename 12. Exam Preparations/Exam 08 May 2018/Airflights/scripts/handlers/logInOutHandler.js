handler.loginGet = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/login.hbs');
    });
};

handler.loginPost = function (ctx) {
    let username = ctx.params.username;
    let pass = ctx.params.pass;

    auth.login(username, pass)
        .then((userData) => {
            auth.saveSession(userData);
            ctx.redirect('#/flights');
            auth.showInfo('Login successful.');
        }).catch(auth.handleError);
};

handler.logoutPost = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            ctx.redirect('#/index.html');
            auth.showInfo('Logout successful.');
        }).catch(auth.handleError);
};