const inputEmpresa = document.getElementById('inputEmpresa');
const inputSucursal = document.getElementById('inputSucursal');
const inputNombre = document.getElementById('inputNombre');
const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const buttonEnviar = document.getElementById('buttonEnviar');
const botonSalir = document.getElementById('botonSalir');

// Validación de autenticación como administrador
let logged = false;

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        if (firebase.auth().currentUser.email === 'siemens_admin@siemens.com') {
            logged = true;
        } else if (logged === true) {
            console.log("Usuario creado");
        } else {
            window.location = 'users.html';
        }
        // ...
    } else {
        // User is signed out.
        console.log("No autenticado");
        window.location = 'index.html';
    }
});

buttonEnviar.addEventListener("click", (e) => {
    let email = inputEmail.value;
    let password = inputPassword.value;
    let name = inputNombre.value;
    let empresa = inputEmpresa.value;
    let sucursal = inputSucursal.value;

    // Se crea usuario y contraseña
    auth.createUserWithEmailAndPassword(email, password)
        .then(info => {
            let user = firebase.auth().currentUser;

            user.updateProfile({        // Actualiza el nombre
                displayName: name
            })
                .then(function () {
                    // Update successful.
                    let uid = user.uid;

                    let db = firebase.firestore();  // Se repite

                    db.collection("users").add({
                        uid: uid,
                        sucursal: sucursal,
                        empresa: empresa,
                        name: name,
                        email: email
                    })
                        .then(function (docRef) {
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch(function (error) {
                            console.error("Error adding document: ", error);
                        });

                });
        })
        .catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
        });

});

botonSalir.addEventListener("click", (e) => {
    console.log('salir');

    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        console.log('Error');

    });
});