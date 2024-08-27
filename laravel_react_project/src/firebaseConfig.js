// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAk8Ku5ZQQNitZHDJd3gdTT-WsPJqlmJwA",
    authDomain: "vision-plus-frames.firebaseapp.com",
    projectId: "vision-plus-frames",
    storageBucket: "vision-plus-frames.appspot.com",
    messagingSenderId: "962820945758",
    appId: "1:962820945758:web:9e6f14f2a39f2be8c001cf",
};
// Connect to Storage emulator

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
