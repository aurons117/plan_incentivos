crud_users_auth();

// Inicia SDKs de Firebase
let db = firebase.firestore();
let storage = firebase.storage();

let inputEmpresa = document.getElementById('inputEmpresa');
let inputSucursal = document.getElementById('inputSucursal');
let inputNombre = document.getElementById('inputNombre');
let inputEmail = document.getElementById('inputEmail');
let inputPassword = document.getElementById('inputPassword');
let buttonEnviar = document.getElementById('buttonEnviar');
let buttonReporte = document.getElementById('buttonReport');

buttonEnviar.addEventListener("click", (e) => {
    let email = inputEmail.value;
    let password = inputPassword.value;
    let name = inputNombre.value;
    let empresa = inputEmpresa.value;
    let sucursal = inputSucursal.value;
    createUser(email, password, name, empresa, sucursal);
});

let botonSalir = document.getElementById("botonSalir");
botonSalir.addEventListener("click", (e) => {
    signOut();
});

let prueba;

buttonReporte.addEventListener("click", (e) => {

    db.collection("registro")
        .get()
        .then(function (querySnapshot) {
            
            let csvContent = 'data:text/csv;charset=utf-8,';
            let titulos;
            let csvContentRow = '';
            let fila;
            querySnapshot.forEach(function (doc) {
                titulos = Object.keys(doc.data());
                
                fila = Object.values(doc.data());
                fila = fila.join(',');
                csvContentRow += fila + '\r\n';
                
            });
            // console.log(titulos);
            // console.log(csvContentRow);

            csvContent += titulos.join(',') + '\r\n' + csvContentRow;
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

});