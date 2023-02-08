// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5EmMIQG2JEQmL4lQT_p_OiLpkiVSzq4U",
  authDomain: "snowfort-constructor.firebaseapp.com",
  databaseURL: "https://snowfort-constructor-default-rtdb.firebaseio.com",
  projectId: "snowfort-constructor",
  storageBucket: "snowfort-constructor.appspot.com",
  messagingSenderId: "619800133418",
  appId: "1:619800133418:web:dbaf6877c6e758424a2853"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;