handlers.login = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    // Don't allow submission of empty forms
    if (username.length === 0 || password.length === 0) return;
    // Disable login button while working
    $(ctx.target).find('input[type="submit"]').prop('disabled', true);

    auth.login(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/feed');
    }).catch((reason) => {
        notify.handleError(reason);
    }).always(() => {
        $(ctx.target).find('input[type="submit"]').prop('disabled', false);
    });
};

handlers.register = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeat = ctx.params.repeatPass;
    // Don't allow submission of empty forms
    if (username.length < 5) {
        notify.showError('Username must be at least 5 characters long');
        return;
    }
    if (password.length === 0) {
        notify.showError('Password cannot be empty');
        return;
    }
    if (password !== repeat) {
        notify.showError("Passwords don't match");
        return;
    }

    // Disable button while working
    $(ctx.target).find('input[type="submit"]').prop('disabled', true);

    auth.register(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/feed');
        $(ctx.target).find('input[type="submit"]').prop('disabled', false);
    }).catch((reason) => {
        notify.handleError(reason);
        $(ctx.target).find('input[type="submit"]').prop('disabled', false);
    });
};