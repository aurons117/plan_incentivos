home_auth();

// Inicia SDKs de Firebase
let db = firebase.firestore();
let storage = firebase.storage();

// Crea referencias para el storage de comprobantes
let storageRef = storage.ref();
let comprobantesRef = storageRef.child('comprobantes');

// Cargar comprobante del formulario
let inputFileButton = document.getElementById("inputFile");

let file;
inputFileButton.addEventListener('change', (e) => {
    file = e.target.files[0];
})

// Obtener datos introducidos en el formulario y guardarlos en la base de datos
let buttonEnviar = document.getElementById("buttonEnviar");

let inputEmpresa = document.getElementById("inputEmpresa");
let inputNombreVendedor = document.getElementById("inputNombreVendedor");
let inputOrden = document.getElementById("inputOrden");
let inputCantidad = document.getElementById("inputCantidad");
let spinner = document.getElementById("loading-spinner");

buttonEnviar.addEventListener("click", (event) => {

    let comprobanteImgRef = comprobantesRef.child(file.name);
    spinner.style.display = "inline-block"
    
    comprobanteImgRef.put(file).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            db.collection("registro").add({
                Empresa: inputEmpresa.value,
                NombreVendedor: inputNombreVendedor.value,
                Orden: inputOrden.value,
                Cantidad: inputCantidad.value,
                ComprobanteURL: downloadURL,
                Email: firebase.auth().currentUser.email,
                Fecha: new Date().toLocaleDateString()
            })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    inputOrden.value = null;
                    inputCantidad.value = null;
                    inputFileButton.value = null;
                    spinner.style.display = "none";
                    alert("Información guardada con éxito");
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                    spinner.style.display = "none"
                    alert("Error al guardar la información");
                });
        });
    });
});

let botonSalir = document.getElementById("botonSalir");

botonSalir.addEventListener("click", (e) => {
    signOut();
});

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("Página cargada");
// })

// db.collection("empresa").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         // console.log(`${doc.id} => ${doc.data().nombre}`);
//         inputEmpresa.innerHTML += `<option>${doc.data().nombre}</option>`;
//     });
// });

// inputNombreVendedor.value = firebase.auth().currentUser.displayName;

// document.onload     // Agregar el retraso en la carga de la página para llenar la lista de empresas