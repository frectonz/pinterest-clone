// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8Jwxim8hC9PQ2tfk0LnBWxOrEGk7DOj8",
  authDomain: "pinterest-clone-3cb86.firebaseapp.com",
  projectId: "pinterest-clone-3cb86",
  storageBucket: "pinterest-clone-3cb86.appspot.com",
  messagingSenderId: "1024140803706",
  appId: "1:1024140803706:web:a194c22ce850b9534e45c3",
  measurementId: "G-6LQKFX1W7B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
