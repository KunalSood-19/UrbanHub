const BASE_URL = "https://grabmyshow-backend.onrender.com/api";

async function test() {

  try {

    const movieId = localStorage.getItem("movieId");

    console.log("Movie ID:", movieId);

    const city = "Ludhiana";

    const res = await fetch(
      `${BASE_URL}/shows?movieId=${movieId}&city=${city}`
    );

    const data = await res.json();

    console.log(data);

  } catch(err) {

    console.log(err);

  }

}

test();