// Splash animation delay
setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}, 2000);

// Navigation
function goToMovies() {
  window.location.href = "./grabmyshow/movies.html";
}

function goToServices() {
  alert("Services page will be built next.");
}

movieCard.innerHTML = `
  <div class="movie-card" data-title="${movie.title}">
    <img src="${movie.image}">
    <h3>${movie.title}</h3>
  </div>
`;