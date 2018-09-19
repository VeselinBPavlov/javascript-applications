handler.editFlightGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let flightId = ctx.params.flightId;
    flightId = flightId.slice(1);
    ctx.flightId = flightId;

    flightService.loadFlightDetails(flightId)
        .then((flight) => {
            ctx._id = flight['_id'];
            ctx.destination = flight["destination"];
            ctx.origin = flight["origin"];
            ctx.departureDate = flight["departureDate"];
            ctx.departureTime = flight["departureTime"];
            ctx.seats = flight['seats'];
            ctx.cost = flight['cost'];
            ctx.image = flight["image"];

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/editFlight.hbs');
            });
        })
};

handler.editFlightPost = function (ctx) {
    let flightId = ctx.params.flightId;
    flightId = flightId.slice(1);
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
        flightService.editFlight(flightId, destination, origin, departureDate, departureTime, seats, cost, image, isPublished)
            .then(() => {
                ctx.redirect(`#/flights/:${flightId}`);
                auth.showInfo('Successfully edited flight');
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