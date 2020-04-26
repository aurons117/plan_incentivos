const buttonReporte = document.getElementById('buttonReport');
const botonSalir = document.getElementById('botonSalir');
const buttonSave = document.getElementById('saveChanges');
const usersContainer = document.getElementById('usersContainer');
const registersContainer = document.getElementById('registersContainer');

// Inicia SDKs de Firebase
const db = firebase.firestore();
const storage = firebase.storage();

init();

botonSalir.addEventListener("click", (e) => {
    console.log('salir');

    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        console.log('Error');

    });
});

buttonReporte.addEventListener("click", (e) => {
    db.collection("registro").get()
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

buttonSave.addEventListener('click', (e) => {
    let selects = document.getElementsByTagName("SELECT");
    Array.from(selects).forEach(async (select) => {
        let docRef = db.collection("registro").doc(select.id);
        try {
            await docRef.update({ Status: select.value });
        } catch (error) {
            alert(error);
        }
        location.reload();
    });
});

async function init() {
    // Validación de autenticación como administrador
    let logged = false;

    await auth.onAuthStateChanged((user) => {
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

    let usersText = usersContainer.innerHTML;
    let querySnapshot = await db.collection("users").get();
    querySnapshot.forEach((doc) => {
        usersText +=
            `<div class="user">
            <div class="datos1">
                <p>${doc.data().name}</p>
                <p>${doc.data().email}</p>
                <p>${doc.data().empresa}</p>
            </div>
        </div>`;
    });
    usersContainer.innerHTML = usersText;

    let usersRegistered = document.getElementsByClassName('user');
    Array.from(usersRegistered).forEach((user) => {
        user.addEventListener('click', async (e) => {
            let name = user.firstElementChild.firstElementChild.innerText;
            let querySnapshot;
            try {
                querySnapshot = await db.collection("registro").where("NombreVendedor", "==", name).get();
            } catch (error) {
                console.log("Error getting documents: ", error);
            }

            let registersText = `<h2>Registros</h2>`;
            let contador = 0;
            querySnapshot.forEach((doc) => {
                if (doc.data().Status === 'Pendiente') {
                    registersText +=
                        `<div class="register">
                        <div class="datos1">
                            <p>Orden ${doc.data().Orden}</p>
                            <p>Fecha ${doc.data().Fecha}</p>
                            <p>Cantidad $${doc.data().Cantidad}</p>
                        </div>
                        <div class="datos2">
                            <a href="${doc.data().ComprobanteURL}">
                                <p>Comprobante</p>
                            </a>
                            <select name="approbation" id="${doc.id}">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </div>
                    </div>`;
                    contador++;
                }
            });
            if (contador === 0) {
                registersText += `<p>No hay registros pendientes</p>`;
            }
            registersContainer.innerHTML = registersText;
        });
    });
}
