// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.APIKEY,
    authDomain: import.meta.env.AUTH_DOMAIN,
    projectId: import.meta.env.PROJECT_ID,
    storageBucket: import.meta.env.STORAGE_BUCKET,
    messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
    appId: import.meta.env.APP_ID,
};
// Connect to Storage emulator

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
