// Crea referencias para el storage
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

buttonEnviar.addEventListener("click", (event) => {
    let inputEmpresa = document.getElementById("inputEmpresa");
    let inputNombreVendedor = document.getElementById("inputNombreVendedor");
    let inputOrden = document.getElementById("inputOrden");
    let inputCantidad = document.getElementById("inputCantidad");

    let comprobanteImgRef = comprobantesRef.child(file.name);

    let downloadURL;
    comprobanteImgRef.put(file).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            db.collection("registro").add({
                Empresa: inputEmpresa.value,
                NombreVendedor: inputNombreVendedor.value,
                Orden: inputOrden.value,
                Cantidad: inputCantidad.value,
                ComprobanteURL: downloadURL
            })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        });
    });
});
