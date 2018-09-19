const handler = {};

$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        // Index page.
        this.get('index.html', handler.getHomePage);

        // Register page.
        this.get('#/register', handler.getRegisterPage);
        this.post('#/register', handler.registerUser);

       // Login page.
        this.get('#/login', handler.getLoginPage);
        this.post('#/login', handler.loginUser);

        // Logout.
        this.get('#/logout', handler.logoutUser);

        // Car list page.
        this.get('#/home', handler.getCarList);
        this.get('#/list', handler.getCarList);

        // Create listing.
        this.get('#/create', handler.getCreatePage);
        this.post('#/create', handler.createListing);

        // Edit page.
        this.get('#/edit/:carId', handler.getEditPage);
        this.post('#/edit/:carId', handler.editListing);

        //Delete listing.
        this.get('#/delete/:carId', handler.deleteListing);

        // My cars page.
        this.get('#/myListings', handler.getMyListings);

        // Details page.
        this.get('#/details/:carId', handler.getCarDetails);
    });

    app.run();
});