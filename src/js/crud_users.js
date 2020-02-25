
let inputEmpresa = document.getElementById('inputEmpresa');
let inputSucursal = document.getElementById('inputSucursal');
let inputNombre = document.getElementById('inputNombre');
let inputEmail = document.getElementById('inputEmail');
let inputPassword = document.getElementById('inputPassword');
let buttonEnviar = document.getElementById('buttonEnviar');

buttonEnviar.addEventListener("click", (e) => {
    let email = inputEmail.value;
    let password = inputPassword.value;
    let name = inputNombre.value;
    let empresa = inputEmpresa.value;
    let sucursal = inputSucursal.value;
    createUser(email, password, name, empresa, sucursal);
});
