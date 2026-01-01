
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCI819H67VT3pF5ycoedn2k4qOvOhJR1Jo",
    authDomain: "tridentnova-c05a3.firebaseapp.com",
    projectId: "tridentnova-c05a3",
    storageBucket: "tridentnova-c05a3.firebasestorage.app",
    messagingSenderId: "932733572198",
    appId: "1:932733572198:web:61d019ec6c09be97b049a7",
    measurementId: "G-4YGV8E8LS6"
};

// Initialize Firebase using compat mode to avoid "no exported member" errors
const app = firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();

export const PRODUCTS_COLLECTION = 'products';
export const ADMINS_COLLECTION = 'admins';
export const CATEGORIES_COLLECTION = 'categories';

// Exporting collection references using compat API
export const productsRef = db.collection(PRODUCTS_COLLECTION);
export const adminsRef = db.collection(ADMINS_COLLECTION);
export const categoriesRef = db.collection(CATEGORIES_COLLECTION);
