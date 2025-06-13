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
  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    const postId = post.getAttribute("data-post-id");
    const likeCountSpan = post.querySelector(".post-rating-count");
    const likeButton = post.querySelector(".upvote");

    // Buscar os likes do post no backend
    fetch(`/api/likes/${postId}`)
      .then(res => res.json())
      .then(data => {
        likeCountSpan.textContent = data.likes;
      });

    // Adicionar evento de clique para dar like
    likeButton.addEventListener("click", () => {
      fetch(`/api/likes/${postId}`, {
        method: "POST"
      }).then(res => res.json()).then(data => {
        likeCountSpan.textContent = data.likes;
      });
    });
  });
});

