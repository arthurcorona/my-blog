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
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("post-rating-button")) {
        const button = event.target;
        const post = button.closest(".post");
        const postId = post.getAttribute("data-post-id");

        if (!postId) {
            console.error("Erro: Post sem ID!");
            return;
        }

        const ratingContainer = button.closest(".post-rating");
        const isUpvote = button.classList.contains("upvote");
        const countSpan = ratingContainer.querySelector(".post-rating-count");

        if (!countSpan) {
            console.error("Erro: Contador de votos não encontrado.");
            return;
        }

        try {
            const response = await fetch(`/posts/${postId}/${isUpvote ? "upvote" : "downvote"}`, {
                method: "POST"
            });

            const data = await response.json();

            if (data.success) {
                countSpan.textContent = data.newCount;
            } else {
                console.error("Erro ao votar:", data);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }
});
});

