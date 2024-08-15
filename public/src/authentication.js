// Add Firebase products that you want to use
import { getFirebaseConfig } from '/src/firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore,setDoc,doc,updateDoc} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const firebaseAppConfig = getFirebaseConfig();
export const app = initializeApp(firebaseAppConfig);
const db = getFirestore(app);

/* This is an observer that triggers when there is a change to the user's 
* logged in status (if the user logs in or logs out).
*/ 
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    console.log("user is signed in");
    synchronizeUser(user);
  } else {
    window.location = 'login.html';
  }
});

/* This function updates the user collection with the information about the
* new user that just logged in.
*/
async function synchronizeUser(user){
  // Create the arconym for the user from their names
  let name = user.displayName;
  let splitName = name.split(' ');
  let acronym = splitName[0].charAt(0).toUpperCase()+splitName[1].charAt(0).toUpperCase();
      
  // UPDATE HERE: change the "users" collection for your project
  await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      id: user.uid,
      email: user.email,
      photo: user.photoURL,
      acronym: acronym,
      status: "online",
      lifetimeUpvotes: 0,
      realms: []
  }, {merge: true});
}

/* Sign-out function
*/
export async function signOutUser() {
  // Sign out of Firebase.
  console.log("sign out");
  
  // UPDATE HERE: change the "users" collection for your project
  await updateDoc(doc(db, "users", getAuth().currentUser.uid), {
    status: "offline",
  });

  signOut(getAuth());
  window.location='login.html';
}

/* Function to get the current logged in user
*/
export function getUser(){
  return getAuth().currentUser;
}
