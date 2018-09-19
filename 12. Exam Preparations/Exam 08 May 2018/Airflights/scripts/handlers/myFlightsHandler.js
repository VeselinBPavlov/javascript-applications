handler.myFlightsGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');

    flightService.myFlightsList(ctx.userId)
        .then((flights) => {
            ctx.myFlights = flights;
            ctx._id = flights["_id"];
            ctx.destination = flights["destination"];
            ctx.oriin = flights["origin"];
            ctx.departureDate = flights["departureDate"];
            ctx.departureTime = flights["departureTime"];
            ctx.image = flights["image"];

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                myFlight: './templates/partials/myFlight.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/myFlights.hbs');
            });
        }).catch(auth.handleError);
};