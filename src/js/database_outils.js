
function addUserInfo(uid, empresa, sucursal, name, email) {
    let db = firebase.firestore();  // Se repite
    
    db.collection("users").add({
        uid: uid,
        sucursal: sucursal,
        empresa: empresa,
        name: name,
        email: email
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}