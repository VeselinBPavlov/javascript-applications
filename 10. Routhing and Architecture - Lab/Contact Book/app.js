$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        // Index page.
        this.get('#/index.html', (ctx) => {
            ctx.isAuth = auth.isAuth();
            ctx.firstName = localStorage.getItem('firstName');
            ctx.lastName = localStorage.getItem('lastName');
            ctx.loadPartials({
                header: './templates/partials/header.hbs',
                navigation: './templates/partials/navigation.hbs',
                footer: './templates/partials/footer.hbs'
            }).then(function () {
                this.partial('./templates/title.hbs')
            });
        });

        // Register page.
        this.get('#/register', (ctx) => {
            ctx.loadPartials({
                header: './templates/partials/header.hbs',
                navigation: './templates/partials/navigation.hbs',
                footer: './templates/partials/footer.hbs'
            }).then(function () {
                this.partial('./templates/register.hbs')
            });
        });

        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let pass = ctx.params.pass;
            let repeatPass = ctx.params.repeatPass;
            let firstName = ctx.params.firstName;
            let lastName = ctx.params.lastName;
            let phone = ctx.params.phone;
            let email = ctx.params.email;

            if (pass !== repeatPass) {
                alert('Password do not match');
            } else {
                auth.register(username, pass, firstName, lastName, phone, email)
                    .then((userData) => {
                        auth.saveSession(userData);
                        ctx.redirect('#/index.html');
                    });
                ctx.redirect('#/index.html');
            }
        });

        // Login page.
        this.get('#/login', (ctx) => {
            ctx.loadPartials({
                header: './templates/partials/header.hbs',
                navigation: './templates/partials/navigation.hbs',
                footer: './templates/partials/footer.hbs'
            }).then(function () {
                this.partial('./templates/login.hbs')
            });
        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let pass = ctx.params.pass;

            auth.login(username, pass)
                .then((userData) => {
                    auth.saveSession(userData);
                    ctx.redirect('#/index.html');
                }).catch(console.error);
        });

        // Logout.
        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    localStorage.clear();
                    ctx.redirect('#/index.html');
                }).catch(console.error);
        });

        // My profile.
        this.get('#/profile', (ctx) => {
            ctx.isAuth = auth.isAuth();
            ctx.firstName = localStorage.getItem("firstName");
            ctx.lastName = localStorage.getItem("lastName");
            ctx.phone = localStorage.getItem("phone");
            ctx.email = localStorage.getItem("email");
            ctx.loadPartials({
                header: './templates/partials/header.hbs',
                navigation: './templates/partials/navigation.hbs',
                footer: './templates/partials/footer.hbs'
            }).then(function () {
                this.partial('./templates/profile.hbs')
            });
        });

        this.put('#/profile', (ctx) => {
            let username = localStorage.getItem('username');
            let id = localStorage.getItem('userId');
            let firstName = ctx.params.firstName;
            let lastName = ctx.params.lastName;
            let phone = ctx.params.phone;
            let email = ctx.params.email;

            auth.edit(username, firstName, lastName, phone, email, id)
                .then((userData) => {
                    auth.saveSession(userData);
                    ctx.redirect('#/index.html');
                }).catch(console.error);
        });

        // Contacts
        this.get('#/contacts', (ctx) => {
            ctx.isAuth = auth.isAuth();
            $.ajax('data.json')
                .then((contacts) => {
                    ctx.contacts = contacts;
                    ctx.loadPartials({
                        header: './templates/partials/header.hbs',
                        navigation: './templates/partials/navigation.hbs',
                        footer: './templates/partials/footer.hbs',
                        contact: './templates/partials/contact.hbs',
                        details: './templates/partials/details.hbs'
                    }).then(function () {
                        ctx.partials = this.partials;
                        render();
                    });
                }).catch(console.error);

            function render() {
                ctx.partial('./templates/contacts.hbs')
                    .then(attachEvents)
            }

            function attachEvents() {
                $('.contact').on('click', (e) => {
                    let index = $(e.target).closest('.contact').attr('data-id');
                    ctx.selected = ctx.contacts[index];
                    render();
                });
            }
        });
    });

    app.run();
});