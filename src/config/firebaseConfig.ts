import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Importa o módulo Storage

const firebaseConfig = {
  apiKey: "AIzaSyCQvM8jfMfBEOyvaaGcn_xbLoRK6QCvato",
  authDomain: "controlevendas-3ba69.firebaseapp.com",
  projectId: "controlevendas-3ba69",
  storageBucket: "gs://controlevendas-3ba69.firebasestorage.app", // Corrige o domínio do Storage Bucket
  messagingSenderId: "41529672736",
  appId: "1:41529672736:web:e1bdc4e918658305162845"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = getFirestore(app);

// Inicializar o Storage
const storage = getStorage(app);

export { db, storage };
