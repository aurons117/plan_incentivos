let auth = firebase.auth()

function signOut() {
    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}

function singIn(email, password, spinner) {
    // Corroborar datos en firebase para autenticar
    spinner.style.display = 'inline-block';

    auth.signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        spinner.style.display = 'none';
        let errorCode = error.code;
        let errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            alert('Password Incorrecto.');
        } else if (errorCode === 'auth/user-not-found') {
            alert('Mail incorrecto.');
        } else if (errorCode === 'auth/invalid-email') {
            alert('Formato de mail incorrecto.')
        }
    });
}

function createUser(email, password, name, empresa, sucursal) {
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
                    addUserInfo(uid, empresa, sucursal, name, email)
                });
        })
        .catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
        });

}


function index_auth() {
    // Observador para autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            console.log("Autenticado");

            if (firebase.auth().currentUser.email === 'siemens_admin@siemens.com') {
                window.location = 'crud_users.html';
            } else {
                window.location = 'home.html';
            }
            // ...
        } else {
            // User is signed out.
            console.log("No autenticado");
        }
    });
}

function crud_users_auth() {
    // Observador para autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            console.log("Autenticado");

            if (firebase.auth().currentUser.email != 'siemens_admin@siemens.com') {
                window.location = 'home.html';
            }
            // ...
        } else {
            // User is signed out.
            console.log("No autenticado");
            window.location = 'index.html';
        }
    });
}

function home_auth() {
    // Observador para autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            console.log("Autenticado");

            db.collection("users").where("uid", "==", user.uid)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        inputNombreVendedor.value = doc.data().name;
                        inputEmpresa.value = doc.data().empresa;
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
            // Rutina para mostrar las posiciones enviadas actualmente INCOMPLETA
            db.collection("registro").where("Email", "==", user.email)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.data());
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
            // ...
        } else {
            // User is signed out.
            console.log("No autenticado");
            window.location = 'index.html';
        }
    });
}
