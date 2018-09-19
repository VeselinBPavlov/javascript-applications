handler.createFlightGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/addNewFlight.hbs');
    });
};

handler.createFlightPost = function (ctx) {
    let destination = ctx.params.destination;
    let origin = ctx.params.origin;
    let departureDate = ctx.params.departureDate;
    let departureTime = ctx.params.departureTime;
    let seats = ctx.params.seats;
    let cost = ctx.params.cost;
    let image = ctx.params.img;
    let isPublished = ctx.params.public;

    let isFlightValid = validationFlight(destination, origin, seats, cost);

    if (isPublished === 'on') {
        isPublished = true;
    } else {
        isPublished = false;
    }

    if (isFlightValid) {
        flightService.createFlight(destination, origin, departureDate, departureTime, seats, cost, image, isPublished)
            .then(() => {
                ctx.redirect('#/flights');
                auth.showInfo('Created flight.');
            }).catch(auth.handleError);
    } else {
        auth.showError('Invalid flight data!');
    }
};

function validationFlight(destination, origin, seats, cost) {
    if (typeof destination !== 'string' || destination === '') {
        return false;
    }
    if (typeof origin !== 'string' || origin === '') {
        return false;
    }
    if (typeof seats !== 'number' && seats < 1) {
        return false;
    }
    if (typeof cost !== 'number' && cost < 1) {
        return false;
    }
    return true;
}