handler.flightsListGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    flightService.flightsList()
        .then((flights) => {
            ctx.flights = flights;
            ctx._id = flights["_id"];
            ctx.destination = flights["destination"];
            ctx.oriin = flights["origin"];
            ctx.departureDate = flights["departureDate"];
            ctx.image = flights["image"];
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                flight: './templates/partials/flight.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/listFlights.hbs');
            });
        }).catch(auth.handleError);
};