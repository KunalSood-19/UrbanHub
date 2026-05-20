let selectedSeats = [];
let primePrice = 0;
let classicPrice = 0;

/* ===============================
   SOCKET.IO CONNECT
================================= */
const socket = io("https://grabmyshow-backend.onrender.com");

async function loadSeats() {
  const showId = localStorage.getItem("showId");

  if (!showId) {
    alert("Show not selected properly");
    return;
  }

  /* Join show room for realtime updates */
  socket.emit("joinShow", showId);

  try {
    const res = await fetch(`${BASE_URL}/shows/seat-availability/${showId}`);
    const data = await res.json();

    const bookedSeats = data.bookedSeats || [];

    /* Prices */
    classicPrice = data.price;
    primePrice = data.price + 40;

    /* Update Titles */
    document.getElementById("classicTitle").innerText =
      `₹${classicPrice} CLASSIC`;

    document.getElementById("primeTitle").innerText =
      `₹${primePrice} PRIME`;

    /* Render Seats */
    renderSection(
      "primeSection",
      ["F", "E"],
      14,
      primePrice,
      bookedSeats
    );

    renderSection(
      "classicSection",
      ["D", "C", "B", "A"],
      14,
      classicPrice,
      bookedSeats
    );

  } catch (error) {
    console.error(error);
    alert("Failed to load seats");
  }
}

/* ===============================
   RENDER SEAT SECTION
================================= */
function renderSection(
  sectionId,
  rows,
  seatCount,
  price,
  bookedSeats
) {
  const container = document.getElementById(sectionId);
  container.innerHTML = "";

  rows.forEach(row => {

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const label = document.createElement("div");
    label.classList.add("row-label");
    label.innerText = row;

    rowDiv.appendChild(label);

    for (let i = 1; i <= seatCount; i++) {

      const seatCode =
        row + String(i).padStart(2, "0");

      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.innerText = String(i).padStart(2, "0");

      /* Important for realtime updates */
      seat.setAttribute("data-seat", seatCode);

      if (bookedSeats.includes(seatCode)) {

        seat.classList.add("booked");

      } else {

        seat.classList.add("available");

        seat.onclick = () =>
          toggleSeat(seatCode, price, seat);
      }

      rowDiv.appendChild(seat);
    }

    container.appendChild(rowDiv);
  });
}

/* ===============================
   SELECT / UNSELECT
================================= */
function toggleSeat(code, price, element) {

  if (element.classList.contains("booked")) return;

  const existing =
    selectedSeats.find(s => s.code === code);

  if (existing) {

    selectedSeats =
      selectedSeats.filter(s => s.code !== code);

    element.classList.remove("selected");

  } else {

    selectedSeats.push({
      code,
      price
    });

    element.classList.add("selected");
  }

  updateSummary();
}

/* ===============================
   SUMMARY
================================= */
function updateSummary() {

  const total =
    selectedSeats.reduce(
      (sum, seat) => sum + seat.price,
      0
    );

  document.getElementById("summary").innerText =
    `${selectedSeats.length} Seats Selected`;

  document.getElementById("totalPrice").innerText =
    `₹${total}`;
}

/* ===============================
   REALTIME UPDATE
================================= */
socket.on("seatUpdate", (bookedSeats) => {

  bookedSeats.forEach(code => {

    const seat =
      document.querySelector(
        `[data-seat="${code}"]`
      );

    if (seat) {

      seat.classList.remove("selected");
      seat.classList.remove("available");
      seat.classList.add("booked");

      seat.onclick = null;

      selectedSeats =
        selectedSeats.filter(
          s => s.code !== code
        );
    }
  });

  updateSummary();
});

/* ===============================
   PAYMENT SUCCESS KE BAAD CALL KARNA
================================= */
function emitBookedSeats() {

  const showId =
    localStorage.getItem("showId");

  socket.emit("seatBooked", {
    showId,
    seats: selectedSeats.map(s => s.code)
  });
}

/* ===============================
   START
================================= */
loadSeats();