handler.deletePost = function(ctx) {
    let flightId = ctx.params.flightId;
    flightId = flightId.slice(1);
    flightService.deleteFlight(flightId)
        .then(() => {
            ctx.redirect('#/myFlights');
            auth.showInfo('Flight remove.');
        }).catch(auth.handleError);
};