// Obtener datos introducidos en el formulario y guardarlos en la base de datos
const buttonEnviar = document.getElementById("buttonEnviar");
const botonSalir = document.getElementById("botonSalir");
const inputCorreo = document.getElementById("inputCorreo");
const inputEmpresa = document.getElementById("inputEmpresa");
const puntajeMaximo = document.getElementById("puntajeMaximo");
const inputNombreVendedor = document.getElementById("inputNombreVendedor");
const inputOrden = document.getElementById("inputOrden");
const inputCantidad = document.getElementById("inputCantidad");
const spinner = document.getElementById("loading-spinner");
const comprobanteH = document.getElementById("historial");
const inputFileButton = document.getElementById("inputFile");

// Inicia SDKs de Firebase
const db = firebase.firestore();
const storage = firebase.storage();

// Crea referencias para el storage de comprobantes
const storageRef = storage.ref();
const comprobantesRef = storageRef.child('comprobantes');

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        db.collection("users").where("uid", "==", user.uid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    inputNombreVendedor.innerHTML = doc.data().name;
                    inputEmpresa.innerHTML = doc.data().empresa;
                    inputCorreo.innerHTML = doc.data().email;
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        // Rutina para mostrar las posiciones enviadas actualmente

        let cantidadTotal = 0;
        let historial = '<h1>Historial</h1>';
        db.collection("registro").where("NombreVendedor", "==", user.displayName)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    historial += `<div class="comprobante">
                    <p>Estatus: ${doc.data().Status}</p>
                    <p>Número de orden: ${doc.data().Orden}</p>
                    <p>Monto: ${doc.data().Cantidad}</p></div>`;
                    if (doc.data().Status === 'Aprobado') {
                        cantidadTotal += parseFloat(doc.data().Cantidad);
                    }
                });
                puntajeMaximo.innerHTML = cantidadTotal;
                comprobanteH.innerHTML = historial;

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

// Cargar comprobante del formulario
let file;
inputFileButton.addEventListener('change', (e) => {
    file = e.target.files[0];
});

buttonEnviar.addEventListener("click", (event) => {
    let comprobanteImgRef = comprobantesRef.child(file.name);
    spinner.style.display = "inline-block";

    comprobanteImgRef.put(file).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            db.collection("registro").add({
                Empresa: inputEmpresa.textContent,
                NombreVendedor: inputNombreVendedor.textContent,
                Orden: inputOrden.value,
                Cantidad: inputCantidad.value,
                ComprobanteURL: downloadURL,
                Email: inputCorreo.textContent,
                Fecha: new Date().toLocaleDateString(),
                Status: 'Pendiente'
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

botonSalir.addEventListener("click", (e) => {
    auth.signOut()
        .catch(function (error) {
            // An error happened.
        });
});
