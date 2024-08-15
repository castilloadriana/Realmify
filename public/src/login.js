import { getFirebaseConfig } from '/src/firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getAuth, onAuthStateChanged,
  GoogleAuthProvider,signInWithPopup,
  signInWithRedirect,getRedirectResult,
  signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);

/** Function to sign in the user using the Google Authentication provider
 * and a signInWithRedirect flow. If a user is already logged in to a Google
 * account in their brower, they will be automatically authenticated.
 */
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithRedirect(getAuth(), provider);
}

// Send user to main page when signed in
getRedirectResult(getAuth()).then(function(result) {
  if (result) {
      window.location = 'index.html'; // Redirect to index.html if signed in successfully
  }
});

/* This is an observer that triggers when there is a change to the user's 
* logged in status (if the user logs in or logs out).
*/ 
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    console.log("user is signed in");
    window.location = 'index.html';
  } else {
    console.log("user is signed out");
    document.getElementById('sign-in').addEventListener('click', signIn);
  }
});

