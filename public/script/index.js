let navItem = document.querySelector('.nav-item')

function openHomePage() {
    window.location.href = "/"
}

function openContactPage() {
    window.location.href = "/contact"
}

function openAboutPage() {
    window.location.href = "/about"
}

function openLoginPage() {
    window.location.href = "/login"
}

function searchOpen() {

}

function showPostsSidebar() {
    window.location.href = "/posts"
}

function selectPageNavMenu() {
    
}

window.onload = function() {
    console.log("teste");
};

//posts counter

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".post").forEach(post => {
        const postId = post.getAttribute("data-post-id");
        const upvoteButton = post.querySelector(".upvote");
        const downvoteButton = post.querySelector(".downvote");
        const upvoteCount = document.getElementById(`upvote-count-${postId}`);
        const downvoteCount = document.getElementById(`downvote-count-${postId}`);

        let savedVotes = JSON.parse(localStorage.getItem(`votes-${postId}`)) || { up: 0, down: 0, userVote: null };
        upvoteCount.textContent = savedVotes.up;
        downvoteCount.textContent = savedVotes.down;
        
        if (savedVotes.userVote === "upvote") upvoteButton.classList.add("selected");
        if (savedVotes.userVote === "downvote") downvoteButton.classList.add("selected");

        function vote(type) {
            if (savedVotes.userVote === type) return; 

            if (savedVotes.userVote === "upvote") savedVotes.up--;
            if (savedVotes.userVote === "downvote") savedVotes.down--;

            if (type === "upvote") savedVotes.up++;
            if (type === "downvote") savedVotes.down++;

            savedVotes.userVote = type; 
            upvoteCount.textContent = savedVotes.up;
            downvoteCount.textContent = savedVotes.down;

            localStorage.setItem(`votes-${postId}`, JSON.stringify(savedVotes));

            upvoteButton.classList.remove("selected");
            downvoteButton.classList.remove("selected");
            post.querySelector(`.${type}`).classList.add("selected");
        }

        upvoteButton.addEventListener("click", () => vote("upvote"));
        downvoteButton.addEventListener("click", () => vote("downvote"));
    });
});
