async function createOrder() {

  if (!selectedSeats || selectedSeats.length === 0) {
    alert("Please select seats first");
    return;
  }

  const token = localStorage.getItem("token");
  const showId = localStorage.getItem("showId");

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  try {

    // 1️⃣ Create order from backend
    const res = await fetch("http://127.0.0.1:5000/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
     body: JSON.stringify({
  amount: discountedTotal || totalAmount
})
    });

    const order = await res.json();

    if (!order.id) {
      alert("Order failed");
      return;
    }

    // 2️⃣ Open Razorpay payment popup
    const options = {
      key: "rzp_test_SL6ZrLgpI4gM3b",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      handler: async function (response) {

        // 3️⃣ Verify payment
        const verifyRes = await fetch("http://127.0.0.1:5000/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            showId: showId,
            seats: selectedSeats.map(s => s.code)
          })
        });

        const verifyData = await verifyRes.json();

        alert(verifyData.message);

     if (verifyData.message.includes("confirmed")) {

  // ⭐ Save booking details
  localStorage.setItem(
    "bookedSeats",
    JSON.stringify(selectedSeats.map(s => s.code))
  );

  localStorage.setItem(
"totalAmount",
discountedTotal || totalAmount
);
  localStorage.setItem("showId", showId);

  // 🔥 ADD THIS (IMPORTANT)
  localStorage.setItem("movieName", localStorage.getItem("movieName") || "Movie");
  localStorage.setItem("venue", localStorage.getItem("venue") || "PVR Cinema");
  localStorage.setItem("date", localStorage.getItem("date") || new Date().toDateString());
  localStorage.setItem("time", localStorage.getItem("time") || "7:30 PM");

  // Redirect
  window.location.href = "success.html";
}
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}
let discountedTotal = 0;

async function applyCoupon() {

try {

const code =
document
.getElementById("couponCode")
.value;

const token =
localStorage.getItem("token");

const total =
selectedSeats.reduce(
(sum, s) => sum + s.price,
0
);

const res = await fetch(

"http://127.0.0.1:5000/api/coupons/apply",

{
method: "POST",

headers: {

"Content-Type": "application/json",

Authorization:
`Bearer ${token}`

},

body: JSON.stringify({

code,
totalAmount: total

})

}

);

const data = await res.json();

if(data.success){

discountedTotal =
data.finalAmount;

document.getElementById(
"totalPrice"
).innerText =
"₹" + discountedTotal;

alert(
`Coupon Applied! ₹${data.discount} OFF`
);

}else{

alert(data.message);

}

} catch(error){

console.log(error);

alert("Coupon failed");

}

}