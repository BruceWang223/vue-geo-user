import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA73vl3Al8yZRqQ9c6wYlP2rBZVUDysQWQ",
    authDomain: "geo-user.firebaseapp.com",
    databaseURL: "https://geo-user.firebaseio.com",
    projectId: "geo-user",
    storageBucket: "",
    messagingSenderId: "458951967038"
  };

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({timestampsInSnapshots: true});
export default firebaseApp.firestore();