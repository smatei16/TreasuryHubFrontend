// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDydNaP1BfZ5G66EKYj1pkz6tibxgZVXrg",
    authDomain: "treasury-hub-b9de0.firebaseapp.com",
    projectId: "treasury-hub-b9de0",
    storageBucket: "treasury-hub-b9de0.appspot.com",
    messagingSenderId: "216616593446",
    appId: "1:216616593446:web:f07d0a63219b52d1529ee7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);