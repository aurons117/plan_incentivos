// Obtener datos introducidos en el formulario y guardarlos en la base de datos
const botonSalir = document.getElementById("botonSalir");
const inputCorreo = document.getElementById("inputCorreo");
const inputEmpresa = document.getElementById("inputEmpresa");
const puntajeMaximo = document.getElementById("puntajeMaximo");
const inputNombreVendedor = document.getElementById("inputNombreVendedor");
const spinner = document.getElementById("loading-spinner");
const comprobanteH = document.getElementById("historial");

const etapa1 = document.getElementById('etapa1');
const inputCliente = document.getElementById('inputCliente');
const inputProyecto = document.getElementById("inputProyecto");
const inputUbicacion = document.getElementById('inputUbicacion');
const inputCantidad = document.getElementById("inputCantidad");
const buttonEtapa1 = document.getElementById('buttonEtapa1');

const etapa2 = document.getElementById('etapa2');
const inputFileEtapa2 = document.getElementById("inputFileEtapa2");
const buttonEtapa2 = document.getElementById('buttonEtapa2');

const etapa3 = document.getElementById('etapa3');
const fechaReunion = document.getElementById('fechaReunion');
const buttonEtapa3 = document.getElementById('buttonEtapa3');

const etapa4 = document.getElementById('etapa4');
const inputFileEtapa4 = document.getElementById('inputFileEtapa4');
const buttonEtapa4Lost = document.getElementById('buttonEtapa4Lost');
const buttonEtapa4Win = document.getElementById('buttonEtapa4Win');

// Inicia SDKs de Firebase
const db = firebase.firestore();
const storage = firebase.storage();

// Crea referencias para el storage de comprobantes
const storageRef = storage.ref();
const comprobantesRef = storageRef.child('comprobantes');

// Crea variable para carga de archivos
let file;
let idSelected;

auth.onAuthStateChanged(async (user) => {
    // User is signed in.
    if (user) {
        // Se obtiene la información del usuario de la base de datos para colocarla en el dashboard
        try {
            let querySnapshot = await db.collection("users").where("uid", "==", user.uid).get();
            querySnapshot.forEach(function (doc) {
                inputNombreVendedor.innerHTML = doc.data().name;
                inputEmpresa.innerHTML = doc.data().empresa;
                inputCorreo.innerHTML = doc.data().email;
            });
        } catch (error) {
            console.log("Error getting documents: ", error);
        }

        // Se consulta la base de datos para obtener el historial de proyectos creados y mostrarlos
        // Se le asigna evento de clic a cada proyecto mostrado por su id. De acuerdo a su etapa, se muestra el formulario correcto

        await renderHistory();

    } else {
        // User is signed out.
        console.log("No autenticado");
        window.location = 'index.html';
    }
});

async function renderHistory() {
    let user = firebase.auth().currentUser;

    let puntajeTotal = 0;
    let historial = '<h1>Historial</h1>';

    try {
        let querySnapshot = await db.collection("registro").where("NombreVendedor", "==", user.displayName).get()
        querySnapshot.forEach(function (doc) {
            historial += `
            <div class="comprobante" id="${doc.id}">
                <p>Proyecto: ${doc.data().Proyecto}</p>
                <p>Nivel de proyecto: ${doc.data().Nivel}</p>
                <p>Etapa: ${doc.data().Etapa}</p>
                <p>Status: ${doc.data().Status}</p>
                <p>Puntaje actual: ${doc.data().Puntaje}</p>
            </div>`;
            puntajeTotal += parseFloat(doc.data().Puntaje);
        });
    } catch (error) {
        console.log("Error getting documents: ", error);
    }
    puntajeMaximo.innerHTML = puntajeTotal;
    comprobanteH.innerHTML = historial;

    const comprobantes = document.getElementsByClassName('comprobante');
    Array.from(comprobantes).forEach((comprobante) => {
        comprobante.addEventListener('click', async (event) => {
            idSelected = comprobante.id;
            let querySnapshot = await db.collection("registro").doc(idSelected).get();

            switch (querySnapshot.data().Etapa) {
                case '1':
                    etapa1.style.display = 'block';
                    etapa2.style.display = 'none';
                    etapa3.style.display = 'none';
                    etapa4.style.display = 'none';
                    break;
                case '2':
                    etapa1.style.display = 'none';
                    etapa2.style.display = 'block';
                    etapa3.style.display = 'none';
                    etapa4.style.display = 'none';
                    break;
                case '3':
                    etapa1.style.display = 'none';
                    etapa2.style.display = 'none';
                    etapa3.style.display = 'block';
                    etapa4.style.display = 'none';
                    break;
                case '4':
                    etapa1.style.display = 'none';
                    etapa2.style.display = 'none';
                    etapa3.style.display = 'none';
                    etapa4.style.display = 'block';
                    break;
                default:
                    etapa1.style = 'none';
                    etapa2.style = 'none';
                    etapa3.style = 'none';
                    etapa4.style = 'none';
                    break;
            }

        });
    });

    spinner.style.display = "none";
}

// Etapa 1

buttonEtapa1.addEventListener('click', async (event) => {
    spinner.style.display = "inline-block";
    let nivel;
    if (parseFloat(inputCantidad.value) <= 200000) {
        nivel = '1';
    } else if (parseFloat(inputCantidad.value) <= 500000) {
        nivel = '2';
    } else if (parseFloat(inputCantidad.value) <= 1000000) {
        nivel = '3';
    } else {
        nivel = '4';
    }

    try {
        let docRef = await db.collection("registro").add({
            NombreVendedor: inputNombreVendedor.textContent,
            Cliente: inputCliente.value,
            Proyecto: inputProyecto.value,
            Ubicacion: inputProyecto.value,
            Cantidad: inputCantidad.value,
            Status: 'En revisión',
            Etapa: '1',
            Puntaje: '0',
            Nivel: nivel,
            Fecha: new Date().toLocaleDateString()
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Información guardada con éxito");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error al guardar la información");
    }
    renderHistory();
});

// Etapa 2

inputFileEtapa2.addEventListener('change', (e) => {
    file = e.target.files[0];
    if (file.size > (2.2 * 1024 * 1024)) {
        alert('Tamaño máximo excedido (2mb)');
        inputFileEtapa2.value = null;
    }
});

buttonEtapa2.addEventListener('click', async (event) => {
    spinner.style.display = "inline-block";
    let comprobanteImgRef = await comprobantesRef.child(file.name);

    let snapshot = await comprobanteImgRef.put(file);
    let downloadURL = await snapshot.ref.getDownloadURL();
    console.log('File available at', downloadURL);

    let docRef = db.collection("registro").doc(idSelected);     // Falta obtener el id del proyecto seleccionado
    try {
        await docRef.update({
            ComprobanteEtapa2: downloadURL,
            Status: 'En revisión'
        });
        alert('Comprobante guardado.');
    } catch (error) {
        alert(error);
    }
    renderHistory();
});

// Etapa 3

buttonEtapa3.addEventListener('click', async (event) => {
    spinner.style.display = "inline-block";

    let docRef = db.collection("registro").doc(idSelected);     // Falta obtener el id del proyecto seleccionado
    try {
        await docRef.update({
            FechaEtapa3: fechaReunion.value,
            Status: 'En revisión'
        });
        alert('Guardado.');
    } catch (error) {
        alert(error);
    }
    renderHistory();
});

// Etapa 4. Dividido en 2 partes, cuando se gana o se pierde el proyecto

inputFileEtapa4.addEventListener('change', (e) => {
    file = e.target.files[0];
    if (file.size > (2.2 * 1024 * 1024)) {
        alert('Tamaño máximo excedido (2mb)');
        inputFileEtapa4.value = null;
    }
});

buttonEtapa4Lost.addEventListener('click', async (event) => {
    spinner.style.display = "inline-block";
    let comprobanteImgRef = await comprobantesRef.child(file.name);

    let snapshot = await comprobanteImgRef.put(file);
    let downloadURL = await snapshot.ref.getDownloadURL();
    console.log('File available at', downloadURL);

    let docRef = db.collection("registro").doc(idSelected);     // Falta obtener el id del proyecto seleccionado
    try {
        await docRef.update({
            Status: 'En revisión',
            Success: 'Perdido',
            ComprobanteEtapa4: downloadURL
        });
        alert('Proceso finalizado');
    } catch (error) {
        alert(error);
    }
    renderHistory();
});

buttonEtapa4Win.addEventListener('click', async (event) => {
    spinner.style.display = "inline-block";
    let comprobanteImgRef = await comprobantesRef.child(file.name);

    let snapshot = await comprobanteImgRef.put(file);
    let downloadURL = await snapshot.ref.getDownloadURL();
    console.log('File available at', downloadURL);

    let docRef = db.collection("registro").doc(idSelected);     // Falta obtener el id del proyecto seleccionado
    try {
        await docRef.update({
            Status: 'En revisión',
            Success: 'Ganado',
            ComprobanteEtapa4: downloadURL
        });
        alert('Proceso en revisión');
    } catch (error) {
        alert(error);
    }
    renderHistory();
});

botonSalir.addEventListener("click", (e) => {
    auth.signOut()
        .catch(function (error) {
            // An error happened.
        });
});
