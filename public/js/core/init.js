/**
 * @fileoverview Módulo de inicialización de Firebase y variables globales
 * @module core/init
 */

// Firebase
let auth, db;

try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  console.log('Firebase initialized successfully');
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Usando Firebase Emulators');
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', 8080);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  alert('Error: Firebase no está configurado correctamente. Revisa la configuración en app.js');
}

export {
  auth,
  db
};
