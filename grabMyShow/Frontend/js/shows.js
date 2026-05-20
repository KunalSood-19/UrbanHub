

let selectedDate = null;
let allShows = [];

// ================= LOAD MOVIE DETAILS =================
async function loadMovieDetails() {

  const movieId = localStorage.getItem("movieId");

  if (!movieId) {
    console.error("No movieId found");
    return;
  }

  try {

    // ✅ CORRECT API
    const res = await fetch(`${BASE_URL}/movies/${movieId}`);

    const movie = await res.json();

    console.log(movie);

    // 🎬 Set title
    document.getElementById("movieTitle").innerText =
      movie.title || "Movie";

    // 🎬 Set meta
    document.getElementById("movieMeta").innerText =
      `${movie.duration || "2h"} • ${
        movie.genre?.join(", ") || "Genre"
      } • ${movie.rating || "UA 7+"} • ${
        movie.year || "2026"
      }`;

    // 🎬 Poster
    let poster = movie.poster;

    if (movie.title?.toLowerCase() === "animal") {
      poster = "animal.webp";
    } 
    else if (movie.title?.toLowerCase() === "jawan") {
      poster = "jawan.png";
    } 
    else if (movie.title?.toLowerCase() === "pathaan") {
      poster = "pathan.webp";
    }

    document.getElementById("posterImage").src = poster;

  } catch (err) {
    console.error("Movie load error:", err);
  }
}

// ================= LOAD SHOWS =================
async function loadShows() {

  const movieId = localStorage.getItem("movieId");

  const city = "Delhi";

  try {

    // ✅ CORRECT API
    const res = await fetch(
      `${BASE_URL}/shows?movieId=${movieId}&city=${city}`
    );

    allShows = await res.json();

    console.log(allShows);

    if (!allShows.length) {

      document.getElementById("showsContainer").innerHTML =
        "<p style='padding:20px'>No shows available.</p>";

      return;
    }

    loadDates();

  } catch (err) {

    console.error("Shows load error:", err);

  }
}

// ================= LOAD DATES =================
function loadDates() {

  const uniqueDates = [
    ...new Set(
      allShows.map(s => s.showDate.split("T")[0])
    )
  ];

  const dateTabs = document.getElementById("dateTabs");

  dateTabs.innerHTML = "";

  uniqueDates.forEach((date, index) => {

    const tab = document.createElement("div");

    tab.className = "date-tab";

    if (index === 0) {

      tab.classList.add("active");

      selectedDate = date;
    }

    const d = new Date(date);

    tab.innerHTML = `
      <span>
        ${d.toLocaleString("en-US", {
          weekday: "short"
        }).toUpperCase()}
      </span>

      <strong>${d.getDate()}</strong>

      <small>
        ${d.toLocaleString("en-US", {
          month: "short"
        }).toUpperCase()}
      </small>
    `;

    tab.addEventListener("click", () => {

      document
        .querySelectorAll(".date-tab")
        .forEach(el =>
          el.classList.remove("active")
        );

      tab.classList.add("active");

      selectedDate = date;

      renderShows();

    });

    dateTabs.appendChild(tab);

  });

  renderShows();
}

// ================= RENDER SHOWS =================
function renderShows() {

  const container =
    document.getElementById("showsContainer");

  container.innerHTML = "";

  const filtered =
    allShows.filter(show =>
      show.showDate.split("T")[0] === selectedDate
    );

  if (filtered.length === 0) {

    container.innerHTML =
      "<p style='padding:20px'>No shows on this date.</p>";

    return;
  }

  const groupedByTheatre = {};

  filtered.forEach(show => {

    const theatreId =
      show.theatre?._id || show.theatre;

    if (!groupedByTheatre[theatreId]) {

      groupedByTheatre[theatreId] = {

        name:
          show.theatre?.name ||
          "Unknown Theatre",

        shows: []

      };
    }

    groupedByTheatre[theatreId]
      .shows
      .push(show);

  });

  Object.keys(groupedByTheatre)
    .forEach(theatreId => {

      const { name, shows } =
        groupedByTheatre[theatreId];

      const theatreCard =
        document.createElement("div");

      theatreCard.className =
        "theatre-card";

      theatreCard.style.cssText = `
        background:#1e293b;
        padding:20px;
        border-radius:10px;
        margin-bottom:15px;
      `;

      theatreCard.innerHTML = `
        <div class="theatre-info"
          style="margin-bottom:12px">

          <h3 style="color:white">
            ${name}
          </h3>

          <p style="
            color:#94a3b8;
            font-size:13px
          ">
            M-Ticket • Food & Beverage
          </p>

        </div>

        <div class="show-times"
          style="
            display:flex;
            gap:10px;
            flex-wrap:wrap
          ">
        </div>
      `;

      const timesContainer =
        theatreCard.querySelector(".show-times");

      shows.forEach(show => {

        const btn =
          document.createElement("button");

        btn.style.cssText = `
          padding:10px 18px;
          border-radius:6px;
          border:1px solid #38bdf8;
          background:transparent;
          color:#38bdf8;
          cursor:pointer;
          font-size:14px;
        `;

        btn.innerText = show.showTime;

        btn.addEventListener("click", () => {

          localStorage.setItem(
            "showId",
            show._id
          );

          window.location.href =
            "seats.html";

        });

        timesContainer.appendChild(btn);

      });

      container.appendChild(theatreCard);

    });
}

// ================= INIT =================
loadMovieDetails();
loadShows();