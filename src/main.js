import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD__7ULaWztR-lZfRZtBfbHE_nPTUo93cw",
//   authDomain: "airy-c2f79.firebaseapp.com",
//   projectId: "airy-c2f79",
//   storageBucket: "airy-c2f79.appspot.com",
//   messagingSenderId: "957779706012",
//   appId: "1:957779706012:web:1a49375964a5befbd0ad59",
//   measurementId: "G-VVGTQ9XVP4"
// };

// // Initialize Firebase
// initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)

app.mount('#app')
