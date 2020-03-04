
index_auth()

let botonEnviar = document.getElementById("submitButton");
let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let spinner = document.getElementById("loading-spinner");

botonEnviar.addEventListener("click", (e) => {

    let email = inputEmail.value;
    let password = inputPassword.value;

    singIn(email, password, spinner);

    inputEmail.value = null;
    inputPassword.value = null;
});

