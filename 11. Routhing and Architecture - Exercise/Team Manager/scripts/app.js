const handler = {};

$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        // Index page.
        this.get('#/index.html', handler.homeHandler);

        // About page.
        this.get('#/about', handler.aboutHandler);

        // Home page.
        this.get('#/home', handler.homeHandler);

        // Login page.
        this.get('#/login', handler.loginHandlerGet);
        this.post('#/login', handler.loginHandlerPost);

        // Register page.
        this.get('#/register', handler.registerHandlerGet);
        this.post('#/register', handler.registerHandlerPost);

        // Logout.
        this.get('#/logout', handler.logoutHandler);

        // Catalog page.
        this.get('#/catalog', handler.catalogHandler);

        // Create team.
        this.get('#/create', handler.createTeamGet);
        this.post('#/create', handler.createTeamPost);

        // Team Detail page.
        this.get('#/catalog/:teamId', handler.teamDetails);

        // Leave team.
        this.get('#/leave', handler.leaveTeam);

        // Join team.
        this.get('#/join/:teamId', handler.joinTeam);

        // Edit team.
        this.get('#/edit/:teamId', handler.editTeamGet);
        this.post('#/edit/:teamId', handler.editTeamPost);
    });

    app.run();
});