function attachEvents() {
    // Get needed URLs and authorization data.
    const POSTS_URL = 'https://baas.kinvey.com/appdata/kid_rJ9OMKWE7/posts';
    const COMMENTS_URL = 'https://baas.kinvey.com/appdata/kid_rJ9OMKWE7/comments/?query=';
    const USERNAME = 'peter';
    const PASSWORD = 'p';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };

    // Get needed elements from HTML.
    const POST_TITLE = $('#post-title');
    const POSTS = $('#posts');
    const POST_COMMENTS = $('#post-comments');
    const POST_BODY = $('#post-body');
    const LOAD_BTN = $('#btnLoadPosts');
    const VIEW_BTN = $('#btnViewPost');
    let postsContent = {};

    // Attach events on the buttons.
    LOAD_BTN.on('click', loadPosts);
    VIEW_BTN.on('click', loadComments);

    // Load posts from database.
    function loadPosts() {
        $.ajax({
            method: 'GET',
            url: POSTS_URL,
            headers: AUTH_HEADERS
        }).then((posts) => {
            for (let post of posts) {
                let option = $(`<option value="${post["_id"]}">${post["title"]}</option>`);
                postsContent[post["_id"]] = post["body"];
                POSTS.append(option);
            }
        }).catch(handleError);
    }

    // Load comments for selected post from database.
    function loadComments() {
        POST_BODY.empty();
        POST_COMMENTS.empty();
        let selectedPost = $('#posts option:selected');
        $.ajax({
            method: 'GET',
            url: `${COMMENTS_URL}{"post_id":"${selectedPost.val()}"}`,
            headers: AUTH_HEADERS
        }).then((comments) => {
            POST_TITLE.text(selectedPost.text());
            POST_BODY.append($(`<li>${postsContent[selectedPost.val()]}</li>`));
            for (let comment of comments) {
                let li = $(`<li>${comment["text"]}</li>`);
                POST_COMMENTS.append(li);
            }
        }).catch(handleError);
    }

    // Handle an error.
    function handleError(err) {
        console.log(err);
    }
}