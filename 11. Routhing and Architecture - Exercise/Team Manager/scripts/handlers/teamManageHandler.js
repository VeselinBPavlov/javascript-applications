handler.editTeamGet = function (ctx) {
    let currentTeamId = ctx.params.teamId;
    currentTeamId = currentTeamId.slice(1);
    ctx.teamId = currentTeamId;
    ctx.loggedIn = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        editForm: './templates/edit/editForm.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/edit/editPage.hbs');
    });
};

handler.editTeamPost = function (ctx) {
    let currentTeamId = ctx.params.teamId;
    currentTeamId = currentTeamId.slice(1);
    let teamName = ctx.params.name;
    let teamComment = ctx.params.comment;

    teamsService.edit(currentTeamId, teamName, teamComment)
        .then(() => {
            ctx.redirect('#/catalog');
            auth.showInfo('Update successful.');
        }).catch(auth.handleError);
};

handler.joinTeam = function (ctx) {
    let currentTeamId = ctx.params.teamId;
    currentTeamId = currentTeamId.slice(1);
    teamsService.joinTeam(currentTeamId)
        .then((userData) => {
            auth.saveSession(userData);
            ctx.redirect('#/catalog');
            auth.showInfo('Join team successful.');
        }).catch(auth.handleError);
};

handler.leaveTeam = function (ctx) {
    teamsService.leaveTeam()
        .then((userData) => {
            auth.saveSession(userData);
            ctx.redirect('#/catalog');
            auth.showInfo('Leave team successful.');
        }).catch(auth.handleError);
};