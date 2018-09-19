// Handle home page.
handler.getHomePage = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/welcome.hbs');
    });
};

// Handle register.
handler.getRegisterPage = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/register.hbs');
    });
};

handler.registerUser = function (ctx) {
    const username = ctx.params.username;
    const password = ctx.params.password;
    const repeatPass = ctx.params.repeatPass;

    if(!/^[A-Za-z]{3,}$/.test(username)){
        notify.showError('Incorrect username!');
    } else if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
        notify.showError('Incorrect password!');
    } else if (password !== repeatPass) {
        notify.showError('Both passwords must match!');
    } else {
        auth.register(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notify.showInfo('User registration successful.');
                ctx.redirect('#/home');
            })
            .catch(notify.handleError)
    }
};

// Handle login.
handler.getLoginPage = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/login.hbs');
    });
};

handler.loginUser = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    // Don't allow submission of empty forms
    if (username.length === 0 || password.length === 0) {
        return;
    }

    auth.login(username, password).then((data) => {
        auth.saveSession(data);
        notify.showInfo('Login successful.');
        ctx.redirect('#/home');
    }).catch(notify.handleError);
};

// Handle logout.
handler.logoutUser = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notify.showInfo('Logout successful.');
            ctx.redirect('index.html');
        })
};



