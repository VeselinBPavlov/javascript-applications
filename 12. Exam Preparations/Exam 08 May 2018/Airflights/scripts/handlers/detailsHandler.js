handler.flightDetailsGet = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
    let flightId = ctx.params.flightId;
    flightId = flightId.slice(1);

    flightService.loadFlightDetails(flightId)
        .then((flight) => {
            ctx._id = flight['_id'];
            ctx.creator = flight["_acl"]["creator"];
            ctx.destination = flight["destination"];
            ctx.origin = flight["origin"];
            ctx.departureDate = flight["departureDate"];
            ctx.departureTime = flight["departureTime"];
            ctx.seats = flight['seats'];
            ctx.cost = flight['cost'];
            ctx.image = flight["image"];

            ctx.isAuthor = ctx.creator === ctx.userId;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                flight: './templates/partials/flight.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/flightDetails.hbs');
            });
        })
};