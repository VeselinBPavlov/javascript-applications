handlers.feed = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#');
        return;
    }
    ctx.currentUser = localStorage.getItem('username');
    ctx.filter = ctx.params.filter;
    if (ctx.filter) {
        if (ctx.filter === ctx.currentUser) {
            ctx.isMe = true;
        } else {
            ctx.isFollowing = service.isFollowing(ctx.filter);
        }
    } else {
        ctx.isMe = true;
    }
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        menu: './templates/common/menu.hbs',
        chirp: './templates/common/chirp.hbs'
    }).then(function () {
        ctx.partials = this.partials;
        ctx.partial('./templates/feed.hbs');

        service.getChirps(ctx.filter).then((chirps) => {
            chirps.map(c => {
                c.time = calcTime(c._kmd.ect);
                c.isAuthor = c._acl.creator === localStorage.getItem('id')
            });
            ctx.render('./templates/common/chirpList.hbs', {chirps}).then(function () {
                this.replace('#chirps');
            });
        }).catch(notify.handleError);

        service.getStats(ctx.filter || ctx.currentUser).then(stats => {
            stats = {
                chirps: stats[0],
                following: stats[1],
                followers: stats[2].length
            };

            ctx.render('./templates/common/stats.hbs', {stats}).then(function () {
                this.replace('#userStats');
            });
        }).catch(notify.handleError);
    });
};

handlers.chirp = function (ctx) {
    let chirp = {
        text: this.params.text,
        author: localStorage.getItem('username')
    };
    if (chirp.text.length === 0) {
        notify.showError('Cannot submit empty chirp')
    }
    if (chirp.text.length > 150) {
        notify.showError('Chirp cannot be longer than 150 characters');
    }

    service.postChirp(chirp)
        .then(() => {
            notify.showInfo('Chirp published');
            ctx.redirect('#/feed/' + localStorage.getItem('username'));
        })
        .catch(() => notify.showError('Error submitting chirp'));
};

handlers.deleteChirp = function () {
    let id = this.params.id;
    service.deleteChirp(id).then(res => {
        notify.showInfo('Chirp deleted');
        this.redirect('#/feed/' + localStorage.getItem('username'));
    }).catch(notify.handleError);
};