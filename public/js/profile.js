$(document).ready(() => {
    loadPosts();
});

function loadPosts() {   //load posts...
    $.get("/api/posts", { postedBy: profileUserId }, results => {
        outputPosts(results, $(".postsContainer"));
    })
}