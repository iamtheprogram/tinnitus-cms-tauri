// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: 'AIzaSyAxQgn_RMnFrNsVVKZv0k3xqpk1ew8t658',
    authDomain: 'tinnitus-50627.firebaseapp.com',
    projectId: 'tinnitus-50627',
    storageBucket: 'tinnitus-50627.appspot.com',
    messagingSenderId: '371499167559',
    appId: '1:371499167559:web:ae404c753697d072cb6662',
    measurementId: 'G-MCNS03CL7X',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
