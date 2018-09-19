handler.logoutHandler = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            ctx.redirect('#/home');
            auth.showInfo('Logout successful.');
        }).catch(auth.handleError);
};