const firebaseConfig = {
  apiKey: "AIzaSyD9HOzLDSqvHidKp_sF4_MXzU0BaOJEqCg",
  projectId: "pruebafirebase-e4b09",
  authDomain: "pruebafirebase-e4b09.firebaseapp.com",
  databaseURL: "https://pruebafirebase-e4b09.firebaseio.com",
  storageBucket: "pruebafirebase-e4b09.appspot.com"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Carga el perfil actual
const auth = firebase.auth();