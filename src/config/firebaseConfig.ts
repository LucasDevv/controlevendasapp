import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Importa o módulo Storage

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket", // Corrige o domínio do Storage Bucket
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = getFirestore(app);

// Inicializar o Storage
const storage = getStorage(app);

export { db, storage };
