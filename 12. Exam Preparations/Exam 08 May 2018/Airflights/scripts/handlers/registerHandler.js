handler.registerGet = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/register.hbs');
    });
};

handler.registerPost = function (ctx) {
    let username = ctx.params.username;
    let pass = ctx.params.pass;
    let repeatPass = ctx.params.checkPass;

    let isValidUsername = validateUser(username);
    let isValidPassword = validatePass(pass, repeatPass);

    if (isValidUsername && isValidPassword) {
        auth.register(username, pass)
            .then((userData) => {
                auth.saveSession(userData);
                ctx.redirect('#/flights');
                auth.showInfo('User registration successful.');
            }).catch(auth.handleError);
    } else {
        if (isValidUsername === false) {
           auth.showError('Invalid username!');
        }
        if (isValidPassword === false) {
            auth.showError('Invalid password!');
        }
    }
};

function validateUser(username) {
    return username.length >= 5;
}

function validatePass(pass, repeatPass) {
    return pass === '' ? false : pass === repeatPass;
}