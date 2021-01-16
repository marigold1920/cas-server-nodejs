const firebase = require("firebase/app");
require("firebase/firestore");
const geofirestore = require("geofirestore");

const firebaseConfig = {
    apiKey: "AIzaSyA1akYjqm5cVgCJvcgAFVguS0sw70hv4ds",
    authDomain: "charitym-ambulance.firebaseapp.com",
    databaseURL: "https://charitym-ambulance.firebaseio.com",
    projectId: "charitym-ambulance",
    storageBucket: "charitym-ambulance.appspot.com",
    messagingSenderId: "801731513492",
    appId: "1:801731513492:web:30978d836981cb9b6d3881"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const GeoFirestore = geofirestore.initializeApp(firestore);
const driverGeoFire = GeoFirestore.collection("drivers");

exports.findDrivers = (latitude, longitude, radius, type) => {
    const result = driverGeoFire
        .near({
            center: new firebase.firestore.GeoPoint(latitude, longitude),
            radius: radius
        })
        .where(type, "==", true);

    return result
        .get()
        .then(snapshot =>
            snapshot.docs.filter(item => item.distance <= item.data().distance).map(item => item.id)
        );
};

exports.dispatchRequestToDrivers = async (requestId, drivers = []) => {
    const batch = firestore.batch();
    const driverCollectionRef = firestore.collection("confirmations");

    drivers.forEach(d => {
        const driverDocumentRef = driverCollectionRef.doc(d);

        batch.update(driverDocumentRef, {
            requestIds: firebase.firestore.FieldValue.arrayUnion(requestId)
        });
    });

    await batch.commit();
};

exports.removeRequestFromDrivers = async (requestId, drivers) => {
    const batch = firestore.batch();
    const driverCollectionRef = firestore.collection("confirmations");

    drivers.forEach(d => {
        const driverDocumentRef = driverCollectionRef.doc(d);

        batch.update(driverDocumentRef, {
            requestIds: firebase.firestore.FieldValue.arrayRemove(requestId)
        });
    });

    await batch.commit();
};

exports.acceptRequest = async (username, requestId) => {
    const driverCollectionRef = firestore.collection("requests").doc(`${requestId}`);

    await driverCollectionRef.update({
        poolId: username,
        status: "accepted"
    });
};

exports.updateRequestStatus = async (requestId, status) => {
    const requestRef = firestore.collection("requests").doc(`${requestId}`);

    await requestRef.update({ status });
};

exports.createRequest = async requestId => {
    const requestRef = firestore.collection("requests").doc(`${requestId}`);

    await requestRef.set({
        status: "processing"
    });
};
