handler.createTeamGet = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        createForm: './templates/create/createForm.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/create/createPage.hbs');
    });
};

handler.createTeamPost = function (ctx) {
    let teamName = ctx.params.name;
    let teamComment = ctx.params.comment;

    teamsService.createTeam(teamName, teamComment)
        .then((data) => {
            teamsService.joinTeam(data["_id"])
                .then((userData) => {
                    auth.saveSession(userData);
                    ctx.redirect('#/catalog');
                    auth.showInfo('Create team successful.');
                }).catch(auth.handleError);
        }).catch(auth.handleError);
};

