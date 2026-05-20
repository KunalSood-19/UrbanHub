async function loadMovies() {
  const res = await fetch(`${BASE_URL}/movies`);
  const movies = await res.json();

  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");

  let posterUrl = movie.poster;

// 🔥 LOCAL FILE FIX
if (movie.title.toLowerCase() === "animal") {
  posterUrl = "animal.webp";
}
else if (movie.title.toLowerCase() === "jawan") {
  posterUrl = "jawan.png";
}
else if (movie.title.toLowerCase() === "pathaan") {
  posterUrl = "pathan.webp";
}
else if (!posterUrl || !posterUrl.startsWith("http")) {
  posterUrl = "https://via.placeholder.com/200x300";
}

    div.innerHTML = `
      <img src="${posterUrl}" 
           style="width:100%;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.6);">
      <p style="margin-top:8px;font-size:14px;color:#cbd5f5;text-align:center;">${movie.title}</p>
      <p style="font-size:12px;color:#64748b;text-align:center;">${movie.genre?.join(", ")}</p>
    `;

    // fallback
    const img = div.querySelector("img");
    img.onerror = () => {
      img.src = "https://via.placeholder.com/200x300";
    };

    div.addEventListener("mouseover", () => div.style.transform = "scale(1.05)");
    div.addEventListener("mouseout", () => div.style.transform = "scale(1)");

    div.addEventListener("click", () => {
      localStorage.setItem("movieId", movie._id);
      window.location.href = "shows.html";
    });

    container.appendChild(div);
  });
}

loadMovies();