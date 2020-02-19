// Configuración de los SDK para firebase
let firebaseConfig = {
  apiKey: "AIzaSyD9HOzLDSqvHidKp_sF4_MXzU0BaOJEqCg",
  projectId: "pruebafirebase-e4b09",
  authDomain: "pruebafirebase-e4b09.firebaseapp.com",
  databaseURL: "https://pruebafirebase-e4b09.firebaseio.com",
  storageBucket: "pruebafirebase-e4b09.appspot.com"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Inicia SDKs de Firebase
let db = firebase.firestore();
let storage = firebase.storage();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());


