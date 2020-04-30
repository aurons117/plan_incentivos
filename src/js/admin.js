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
    let registers = document.getElementsByClassName('register');
    Array.from(registers).forEach(async (register) => {
        let nivel = document.getElementById(`nivel_${register.id}`).innerHTML;
        let etapa = document.getElementById(`etapa_${register.id}`).innerHTML;
        let selector = document.getElementById(`selector_${register.id}`).value;
        let success = document.getElementById(`success_${register.id}`).innerHTML;
        let docRef = db.collection("registro").doc(register.id);

        if (selector === 'Rechazado') {
            try {
                await docRef.update({
                    Status: 'Rechazado'
                });
                alert('Cambios guardados');
            } catch (error) {
                alert(error);
            }
        }

        else if (selector === 'Aprobado') {
            switch (etapa) {
                case '1':
                    try {
                        await docRef.update({
                            Status: 'Pendiente',
                            Puntaje: '50',
                            Etapa: '2'
                        });
                        alert('Cambios guardados');
                    } catch (error) {
                        alert(error);
                    }
                    break;
                case '2':
                    try {
                        await docRef.update({
                            Status: 'Pendiente',
                            Puntaje: '100',
                            Etapa: '3'
                        });
                        alert('Cambios guardados');
                    } catch (error) {
                        alert(error);
                    }
                    break;
                case '3':
                    try {
                        await docRef.update({
                            Status: 'Pendiente',
                            Puntaje: '150',
                            Etapa: '4'
                        });
                        alert('Cambios guardados');
                    } catch (error) {
                        alert(error);
                    }
                    break;
                case '4':
                    let puntaje = '150';
                    if (success === 'Ganado') {
                        if (nivel === '2') {
                            puntaje = '250';
                        } else if (nivel == '3') {
                            puntaje = '300'
                        } else if (nivel == '4') {
                            puntaje = '350'
                        }
                    }
                    try {
                        await docRef.update({
                            Status: 'Finalizado',
                            Etapa: '4',
                            Puntaje: puntaje
                        });
                        alert('Cambios guardados');
                    } catch (error) {
                        alert(error);
                    }
                    break;
                default:
                    console.log('Error en la etapa');
                    break;
            }
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
                if (doc.data().Status === 'En revisión') {
                    registersText +=
                        `<div class="register" id="${doc.id}">
                            <div class="datos1">
                                <p>Proyecto ${doc.data().Proyecto}</p>
                                <p>Nivel: <span id="nivel_${doc.id}">${doc.data().Nivel}</span></p>
                                <p>Cantidad: $${doc.data().Cantidad}</p>
                                <p>Status: <span id="status_${doc.id}">${doc.data().Status}</span></p>
                                <p>Etapa: <span id="etapa_${doc.id}">${doc.data().Etapa}</span></p>
                                <p>Puntaje obtenido: <span id="puntaje_${doc.id}">${doc.data().Puntaje}</span></p>
                            </div>
                            <div class="datos2">
                                <a href="${doc.data().ComprobanteEtapa2}" target="_blank">
                                    <p>Comprobante Etapa 2</p>
                                </a>
                                <p>Fecha Etapa 3: ${doc.data().FechaEtapa3}</p>
                                <a href="${doc.data().ComprobanteEtapa4}" target="_blank">
                                    <p>Comprobante Etapa 4</p>
                                </a>
                                <p>Resultado: <span id="success_${doc.id}">${doc.data().Success}</span></p>
                                <select name="approbation" id="selector_${doc.id}">
                                    <option value="En Revisión">En Revisión</option>
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
