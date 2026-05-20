fetch("http://localhost:7000/api/bookings")
.then(res => res.json())
.then(data => {

const container = document.getElementById("bookingList");

if(data.length === 0){
container.innerHTML = "<p style='text-align:center;'>No bookings yet</p>";
return;
}

data.forEach(b => {

const card = `
<div class="card" style="margin:15px;">
<h3>${b.service}</h3>
<p><b>Name:</b> ${b.name}</p>
<p><b>Email:</b> ${b.email}</p>
<p><b>Date:</b> ${b.date}</p>
<p><b>Time:</b> ${b.time}</p>
</div>
`;

container.innerHTML += card;

});

});