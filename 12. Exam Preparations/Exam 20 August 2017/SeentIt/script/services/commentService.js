let comments = (() => {
    function getPostComments(postId) {
        const endpoint = `comments?query={"postId":"${postId}"}&sort={"_kmd.ect": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }
    
    function createComment(postId, content, author) {
        const endpoint = 'comments';
        let data = { postId, content, author };

        return remote.post('appdata', endpoint, 'kinvey', data);
    }

    function deleteComment(commentId) {
        const endpoint = `comments/${commentId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }



    return {
        getPostComments,
        createComment,
        deleteComment
    }

})();