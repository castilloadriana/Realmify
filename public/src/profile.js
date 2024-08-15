import { app, signOutUser} from '/src/authentication.js';
import { getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore,doc,getDoc,} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const db = getFirestore(app);
document.getElementById('sign-out').addEventListener('click', signOutUser);
var uid = null;
var userName = null;

/* This is an observer that triggers when there is a change to the user's 
* logged in status (if the user logs in or logs out).
*/ 
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    // if the user is logged in, then load the user profile information
    uid = user.uid;
    userName = user.displayName;
    document.getElementById('profile-link').setAttribute("href", "profile.html?id=" + uid);
    loadProfile(uid);
  } else {
    // otherwise, if the user is logged out then don't show any profile 
    // information and take them back to the homepage
    window.location = 'login.html';
  }
});

// Loads the profile for the user that was selected, this may not be 
// the same as the current user.
async function loadProfile(currentUser) {
  console.log("updating profile");
  var vals = window.location.search.split("=");

  const docRef = doc(db, "users", vals[1]);
  const docSnap =  await getDoc(docRef);

  if(docSnap.exists()){
    document.getElementById("profile-name").innerHTML = docSnap.data().name;
    document.getElementById("profile-contact").innerHTML = docSnap.data().email;
    document.getElementById("profile-picture").src = docSnap.data().photo;
    document.getElementById("profile-upvotes").innerHTML = "<p> Lifetime upvotes: " + docSnap.data().lifetimeUpvotes + "</p>";
  }

  // if showing another user's profile, delete sign out button.
  if (currentUser != docSnap.data().id) {
    document.getElementById('sign-out').remove();
  }
}