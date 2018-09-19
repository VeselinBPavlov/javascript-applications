function loadCommits() {
    // Get URL and elements from HTML.
    const BASE_URL = 'https://api.github.com/repos';
    const COMMITS = $('#commits');
    const USERNAME = $('#username');
    const REPO = $('#repo');

    let username = USERNAME.val();
    let repo = REPO.val();

    if (username.length === 0 || repo.length === 0) {
        return;
    }

    // List Git Commits from selected Repo.
    COMMITS.empty();
    $.ajax({
        method: 'GET',
        url: `${BASE_URL}/${username}/${repo}/commits`
    }).then((commits) => {
        for (let id in commits) {
            let li = $(`<li>${commits[id]["commit"]["author"].name}: ${commits[id]["commit"].message}</li>`);
            COMMITS.append(li);
            USERNAME.val('');
            REPO.val('');
        }
    }).catch((err) => {
        let li = $(`<li>Error: ${err.status} (${err.statusText})</li>`);
        COMMITS.append(li);
    })
}