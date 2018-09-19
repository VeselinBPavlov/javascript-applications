handler.registerHandlerGet = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        registerForm: './templates/register/registerForm.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/register/registerPage.hbs');
    });
};

handler.registerHandlerPost = function (ctx) {
    let username = ctx.params.username;
    let pass = ctx.params.password;
    let repeatPass = ctx.params.repeatPassword;

    if (pass !== repeatPass) {
        auth.handleError('Password do not match');
    } else {
        auth.register(username, pass)
            .then((userData) => {
                auth.saveSession(userData);
                ctx.redirect('#/home');
                auth.showInfo('Registration successful.');
            }).catch(auth.handleError);
    }
};