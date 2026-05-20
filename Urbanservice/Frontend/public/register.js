import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword
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

document.getElementById("registerBtn").addEventListener("click", () => {

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

if(name === "" || email === "" || password === ""){
alert("Please fill all fields");
return;
}

if(password !== confirmPassword){
alert("Passwords do not match");
return;
}

createUserWithEmailAndPassword(auth, email, password)

.then((userCredential)=>{

alert("Account Created Successfully!");

window.location.href="login.html";

})

.catch((error)=>{

alert(error.message);

});

});