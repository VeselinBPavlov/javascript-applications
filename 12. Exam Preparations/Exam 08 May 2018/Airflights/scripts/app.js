const handler = {};

$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        // Index page.
        this.get('#/index.html', handler.homeGet);

        // Register page.
        this.get('#/register', handler.registerGet);
        this.post('#/register', handler.registerPost);

        // Login page.
        this.get('#/login', handler.loginGet);
        this.post('#/login', handler.loginPost);

        // Logout.
        this.get('#/logout', handler.logoutPost);

        // Flights page.
        this.get('#/flights', handler.flightsListGet);

        // Add flight.
        this.get('#/create', handler.createFlightGet);
        this.post('#/create', handler.createFlightPost);

        // My Flights List.
        this.get('#/myFlights', handler.myFlightsGet);

        // Delete flight.
        this.get('#/remove/:flightId', handler.deletePost);

        // Flight Detail page.
        this.get('#/flights/:flightId', handler.flightDetailsGet);

       // Edit flight.
        this.get('#/edit/:flightId', handler.editFlightGet);
        this.post('#/edit/:flightId', handler.editFlightPost);
    });

    app.run();
});