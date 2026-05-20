import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnKeq3NuqdemRrK0Bud_HMfTuSnokoOIM",
  authDomain: "urbanhub1.firebaseapp.com",
  projectId: "urbanhub1",
  storageBucket: "urbanhub1.firebasestorage.app",
  messagingSenderId: "264905059920",
  appId: "1:264905059920:web:b569fe6a61778dba4b2b55",
  measurementId: "G-WDD2CQB24C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(email === "" || password === ""){
alert("Please enter email and password");
return;
}

signInWithEmailAndPassword(auth, email, password)

.then((userCredential) => {

alert("Login Successful");

window.location.href = "index.html";

})

.catch((error) => {

alert(error.message);

});

});

});