
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcUxhxbvZEwgP3K6WQFGLXpYji4OnEGYU",
  authDomain: "cs323-s24-team1.firebaseapp.com",
  projectId: "cs323-s24-team1",
  storageBucket: "cs323-s24-team1.appspot.com",
  messagingSenderId: "516873716978",
  appId: "1:516873716978:web:8a750762dd878fd3d6bc6b",
  measurementId: "G-8SPPR4DYPM"
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return firebaseConfig;
  }
}