handlers.discover = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#');
        return;
    }
    ctx.currentUser = localStorage.getItem('username');
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        menu: './templates/common/menu.hbs',
        userbox: './templates/common/userbox.hbs'
    }).then(function () {
        ctx.partials = this.partials;
        service.getUsers().then((users) => {
            ctx.users = users.filter(u => u.username !== ctx.currentUser);
            ctx.partial('./templates/discover.hbs');
        }).catch(notify.handleError);
    });
};

handlers.follow = function (ctx) {
    let subs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    let target = this.params.target;
    service.subscribe(subs, target).then(res => {
        notify.showInfo('Subscribed to ' + target);
        auth.saveSession(res);
        ctx.redirect('#/feed/' + target);
    }).catch(notify.handleError);
};

handlers.unfollow = function (ctx) {
    let subs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    let target = this.params.target;
    service.unsubscribe(subs, target).then(res => {
        notify.showInfo('Unsubscribed from ' + target);
        auth.saveSession(res);
        ctx.redirect('#/feed/' + target);
    }).catch(notify.handleError);
};