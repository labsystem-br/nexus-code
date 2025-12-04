// **firebase-init.js**
// Replace the firebaseConfig object with your project's config from Firebase Console
// Example: https://console.firebase.google.com/ -> Project Settings -> SDK snippet (Config)
(function(){
  // PASTE YOUR FIREBASE CONFIG BELOW
  const firebaseConfig = {
  apiKey: "AIzaSyAKgRmQDLp_oQhXqgIdbqEP1CzW5gH2eA8",
  authDomain: "climede-endoscopia.firebaseapp.com",
  projectId: "climede-endoscopia",
  storageBucket: "climede-endoscopia.firebasestorage.app",
  messagingSenderId: "136041011059",
  appId: "1:136041011059:web:84b450dabf5d4d3904d706"
};

  if(window.firebase && firebase.initializeApp) {
    firebase.initializeApp(firebaseConfig);
    window.NEXUS_FIREBASE = {
      auth: firebase.auth(),
      db: firebase.firestore()
    };
    console.log('Firebase initialized (replace config values in /scripts/firebase-init.js)');
  } else {
    console.warn('Firebase SDK not loaded');
    window.NEXUS_FIREBASE = { auth: null, db: null };
  }
})();
