async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://grabmyshow-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",   // 🔥 ADD THIS

      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      alert("Login Successful");

window.location.href = "../../../landing-page/index.html";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}