// Get car list.
handler.getCarList = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let userId = sessionStorage.getItem('userId');

    carService.getAllCars()
        .then((cars) => {
            ctx.anyCar = cars.length !== 0;
            cars.forEach((c, i) => {
               if (userId === c['_acl']['creator']) {
                   c.isAuthor = true;
               } else {
                   c.isAuthor = false;
               }
            });
            ctx.cars = cars;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                car: './templates/partials/car.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/car-list.hbs');
            });
        }).catch(notify.handleAjaxError);
};

handler.getCreatePage = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/create-car.hbs');
    });
};

handler.createListing = function (ctx) {
    let brand = ctx.params.brand;
    let description = ctx.params.description;
    let fuel = ctx.params.fuelType;
    let image = ctx.params.imageUrl;
    let model = ctx.params.model;
    let price = ctx.params.price;
    let seller = sessionStorage.getItem('username');
    let title = ctx.params.title;
    let year = ctx.params.year;

    let isValidData = listingValidation(title, description, brand, fuel, model, year, price, image);

    if (isValidData) {
        carService.createCar(brand, description, fuel, image, model, price, seller, title, year)
            .then(() => {
                notify.showInfo('Listing created.');
                ctx.redirect('#/home');
            }).catch(notify.handleAjaxError);
    }
};

// Delete listing.
handler.deleteListing = function (ctx) {
    let carId = ctx.params.carId;
    carId = carId.slice(1);
    carService.removeListing(carId)
        .then(() => {
            ctx.redirect('#/home');
            notify.showInfo('Listing deleted.');
        }).catch(auth.handleError);
};

// Edit listing.
handler.getEditPage = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let carId = ctx.params.carId;
    carId = carId.slice(1);

    carService.getCar(carId)
        .then((car) => {
           ctx.title = car.title;
           ctx.description = car.description;
           ctx.brand = car.brand;
           ctx.model = car.model;
           ctx.year = car.year;
           ctx.imageUrl = car.imageUrl;
           ctx.fuel = car.fuel;
           ctx.price = car.price;
           ctx._id = carId;


            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/edit-car.hbs');
            });
        });
};

handler.editListing = function (ctx) {
    let brand = ctx.params.brand;
    let description = ctx.params.description;
    let fuel = ctx.params.fuelType;
    let image = ctx.params.imageUrl;
    let model = ctx.params.model;
    let price = ctx.params.price;
    let seller = sessionStorage.getItem('username');
    let title = ctx.params.title;
    let year = ctx.params.year;
    let carId = ctx.params.carId;
    carId = carId.slice(1);

    let isValidData = listingValidation(title, description, brand, fuel, model, year, price, image);

    if (isValidData) {
        carService.editCar(brand, description, fuel, image, model, price, seller, title, year, carId)
            .then(() => {
                notify.showInfo(`Listing ${title} updated.`);
                ctx.redirect('#/home');
            }).catch(notify.handleAjaxError);
    }
};

// My listings page.
handler.getMyListings = function (ctx) {
    ctx.isAuth = auth.isAuth();
    let username = sessionStorage.getItem('username');
    ctx.username = username;
    let userId = sessionStorage.getItem('userId');
    carService.getMyCars(username)
        .then((cars) => {
            console.log(cars);
            ctx.anyCar = cars.length !== 0;
            cars.forEach((c, i) => {
                if (userId === c['_acl']['creator']) {
                    c.isAuthor = true;
                } else {
                    c.isAuthor = false;
                }
            });
            ctx.myCars = cars;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                myCar: './templates/partials/my-car.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/my-cars.hbs');
            });

    }).catch(notify.handleAjaxError);
};

// Get Car Details.
handler.getCarDetails = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let carId = ctx.params.carId;
    carId = carId.slice(1);

    carService.getCar(carId)
        .then((car) => {
            ctx.isAuthor = ctx.username === car.seller;
            ctx.title = car.title;
            ctx.imageUrl = car.imageUrl;
            ctx.brand = car.brand;
            ctx.model = car.model;
            ctx.year = car.year;
            ctx.fuel = car.fuel;
            ctx.price = car.price;
            ctx._id = carId;
            ctx.description = car.description;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/car-details.hbs');
            });
        }).catch(notify.handleAjaxError);
};


function listingValidation (title, description, brand, fuel, model, year, price, image) {
    if (title.length === 0 || title.length > 33) {
        notify.showError('Title should be between 1 and 33 characters long!');
        return false;
    } else if (description.length < 30 || description > 450) {
        notify.showError('Description should be between 30 and 450 characters long!');
        return false;
    } else if (brand.length === 0 || brand.length > 11) {
        notify.showError('Brand should be between 1 and 11 characters long!');
        return false;
    } else if (fuel.length === 0 || fuel.length > 11) {
        notify.showError('Fuel type should be between 1 and 11 characters long!');
        return false;
    } else if (model.length === 0 || model.length > 11) {
        notify.showError('Model should be between 1 and 11 characters long!');
        return false;
    } else if (year.length !== 4) {
        notify.showError('Year should be exactly 4 characters long!');
        return false;
    } else if (Number(price) < 0 || Number(price) > 1000000) {
        notify.showError('Price should be between 1 and 1000000 dollars!');
        return false;
    } else if (!/^http*/.test(image)) {
        notify.showError(`Image link should start with "http"!`);
        return false;
    } else {
        return true;
    }
}