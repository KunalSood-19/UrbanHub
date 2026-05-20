// Wait until page loads (important)
window.onload = function () {

    const params = new URLSearchParams(window.location.search);
    const serviceName = params.get("service");

    if (serviceName) {
        document.getElementById("service").value = serviceName;
    }

    document.getElementById("bookingForm").addEventListener("submit", (e) => {

        e.preventDefault();

        const bookingData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            service: document.getElementById("service").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        };

        fetch("http://127.0.0.1:7000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        })
        .then(res => res.json())
        .then(data => {
            alert("Booking confirmed!");
            
            // 🔥 IMPORTANT CHANGE
           window.location.href = "index.html";
        })
        .catch(err => console.log(err));

    });

};