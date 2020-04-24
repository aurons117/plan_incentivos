
const botonEnviar = document.getElementById("submitButton");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const spinner = document.getElementById("loading-spinner");

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        if (auth.currentUser.email === 'siemens_admin@siemens.com') {
            window.location = 'admin.html';
        } else {
            window.location = 'users.html';
        }
        // ...
    } else {
        // User is signed out.
        console.log("No autenticado");
    }
});

botonEnviar.addEventListener("click", (e) => {
    signIndex();
});

inputPassword.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        signIndex();
    }
});

function signIndex() {
    const email = inputEmail.value;
    const password = inputPassword.value;

    spinner.style.display = 'inline-block';

    auth.signInWithEmailAndPassword(email, password)
        .catch(function (error) {
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

    inputEmail.value = null;
    inputPassword.value = null;
}
