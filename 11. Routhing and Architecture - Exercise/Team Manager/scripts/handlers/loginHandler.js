handler.loginHandlerGet = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        loginForm: './templates/login/loginForm.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/login/loginPage.hbs');
    });
};

handler.loginHandlerPost = function (ctx) {
    let username = ctx.params.username;
    let pass = ctx.params.password;

    auth.login(username, pass)
        .then((userData) => {
            auth.saveSession(userData);
            ctx.redirect('#/home');
            auth.showInfo('Login successful.');
        }).catch(auth.handleError);
};
