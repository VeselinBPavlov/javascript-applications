const handlers = {};

$(() => {
    let app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', function () {
            if (auth.isAuthed()) {
                this.redirect('#/feed');
                return;
            }
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/welcome.hbs');
            });
        });

        this.get('#/feed', handlers.feed);
        this.get('#/feed/:filter', handlers.feed);

        this.get('#/users', handlers.discover);

        this.get('#/register', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/register.hbs');
            });
        });

        // User session
        this.post('#/login', handlers.login);
        this.post('#/register', handlers.register);
        this.get('#/logout', function () {
            auth.logout().then((res) => {
                localStorage.clear();
                this.redirect('#');
            }).catch(notify.handleError);
        });

        // Content
        this.post('#/chirp', handlers.chirp);
        this.get('#/follow/:target', handlers.follow);
        this.get('#/unfollow/:target', handlers.unfollow);
        this.get('#/delete/:id', handlers.deleteChirp);

    }).run();
});

function calcTime(time) {
    let diff = new Date - (new Date(time));
    diff = Math.floor(diff / 60000);
    if (diff < 1) return 'now';
    if (diff < 60) return diff + ' minute' + pluralize(diff);
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + ' hour' + pluralize(diff);
    diff = Math.floor(diff / 24);
    if (diff < 30) return diff + ' day' + pluralize(diff);
    diff = Math.floor(diff / 30);
    if (diff < 12) return diff + ' month' + pluralize(diff);
    diff = Math.floor(diff / 12);
    return diff + ' year' + pluralize(diff);

    function pluralize(value) {
        if (value !== 1) return 's';
        else return '';
    }
}