import { app, signOutUser } from '/src/authentication.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore, collection, addDoc, query, onSnapshot, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const db = getFirestore(app);
var uid = null;
var userName = null;

// Get the current user so that they can be saved as the author. 
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    uid = user.uid;
    userName = user.displayName;
    console.log("currently signed in as:", userName);
    document.getElementById('profile-link').setAttribute("href", "profile.html?id=" + uid);
    document.getElementById('submit-realm').addEventListener("click", addRealm);
  } else {
    console.log("User is not logged in. ")
  }
});


/* This function is attached to the send element eventListeners and updates
* the chat history with the new messages posted by the current user. 
* At the moment, nothing gets updated to the database so these messages 
* will disappear when the page changes.
*/
async function addRealm(event) {
  event.preventDefault();
  let textVal = document.getElementById('title-input').value;
  let descVal = document.getElementById("description-input").value;
  let img = document.getElementById("image-input").value;

  // get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;

  console.log(userName, "is creating a new realm. ");
  var newDoc = await addDoc(collection(db, "realms"), {
    createdBy: uid,
    createdByName: userName,
    dateCreated: today,
    title: textVal,
    description: descVal,
    realmImage: img,
  });
  console.log("Document written with ID:", newDoc.id);
  window.location.assign("index.html")
}