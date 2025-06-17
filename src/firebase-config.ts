import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Optional, uncomment if you want to use Analytics

const firebaseConfig = {
  apiKey: "AIzaSyCAeW_GzIvQEd2P-Yvs9gV3xlDvlrmMRBc",
  authDomain: "gaminghub-9c6a9.firebaseapp.com",
  projectId: "gaminghub-9c6a9",
  storageBucket: "gaminghub-9c6a9.appspot.com", // Corrected from .firebasestorage.app to .appspot.com as per standard
  messagingSenderId: "769184708063",
  appId: "1:769184708063:web:d18bdfca7aecaa16ea806a",
  measurementId: "G-3BYJCPST5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional, uncomment if you want to use Analytics

export default app;
