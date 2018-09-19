handler.catalogHandler = function (ctx) {
    ctx.loggedIn = auth.isAuth();
    ctx.hasNoTeam = !auth.hasTeam();
    ctx.username = sessionStorage.getItem('username');

    teamsService.loadTeams()
        .then((teams) => {
            ctx.teams = teams;
            ctx._id = teams["_id"];
            ctx.name = teams["name"];
            ctx.comment = teams["comment"];
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                team: './templates/catalog/team.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/catalog/teamCatalog.hbs');
            });
        }).catch(auth.handleError);
};