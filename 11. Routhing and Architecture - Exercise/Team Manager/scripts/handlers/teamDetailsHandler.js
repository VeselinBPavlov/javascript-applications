handler.teamDetails = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    let teamId = sessionStorage.getItem('teamId');
    let userId = sessionStorage.getItem('userId');
    let username = sessionStorage.getItem('username');
    let currentTeamId = ctx.params.teamId;
    currentTeamId = currentTeamId.slice(1);

    teamsService.loadTeamDetails(currentTeamId)
        .then((teamData) => {
            ctx.loggedIn = auth.isAuth();
            ctx.name = teamData.name;
            ctx.comment = teamData.comment;
            ctx.members = [];
            ctx.teamId = teamId;
            ctx.isOnTeam = false;
            ctx.teamId = currentTeamId;
            if (teamData['_acl']['creator'] === userId) {
                ctx.isAuthor = true;
            }
            teamsService.getUsers()
                .then((users) => {
                    for (let user of users) {
                        if (user["teamId"] === currentTeamId) {
                            ctx.members.push({username: user['username']});
                        }
                    }
                    if (ctx.members.length > 0) {
                        for (let user of ctx.members) {
                            if (user['username'] === username) {
                                ctx.isOnTeam = true;
                            }
                        }
                    }
                    if (ctx.isOnTeam === false) {
                        ctx.isAuthor = false;
                    }

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        teamMember: './templates/catalog/teamMember.hbs',
                        teamControls: './templates/catalog/teamControls.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function () {
                        this.partial('./templates/catalog/details.hbs');
                    });
                }).catch(auth.handleError);
        }).catch(auth.handleError);
};


