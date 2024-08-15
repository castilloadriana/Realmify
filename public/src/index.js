import { app, signOutUser } from '/src/authentication.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore, collection, addDoc, query, onSnapshot, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const db = getFirestore(app);
loadRealms();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log("currently signed in as:", user.displayName);
    document.getElementById('profile-link').setAttribute("href", "profile.html?id=" + uid);
  } else {
    window.location = 'login.html';
  }
});

/* This function creates a list of all of the existing conversations
* and adds them to the sidebar.
*/
async function loadRealms() {
  // UPDATE HERE: change the "conversations" collection for your project
  const realms = await getDocs(collection(db, "realms"));
  realms.forEach((doc) => {
    var container = document.getElementById("realm-container");

    var realmCard = `<div class="col-md-6 col-lg-4 mt-5 wow fadeInUp" data-wow-delay=".2s"
  style="visibility: visible; animation-delay: 0.2s; animation-name: fadeInUp;">
  <div class="blog-grid">
    <div class="blog-grid-img position-relative"><img alt="img"
        src="${doc.data().realmImage}">
    </div>
    <div class="blog-grid-text">
      <h3 class="h5 mb-3 go-to-realm" data-realmID="${doc.id}"><button class="realmCard-btn">${doc.data().title}</button></h3>
      <p class="display-30">${doc.data().description} </p>
      <div class="meta meta-style2">
        <ul>
          <li>Date created: ${doc.data().dateCreated}</li>
          <li><a href="profile.html?id=${doc.data().createdBy}">Created by: ${doc.data().createdByName}</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

    container.insertAdjacentHTML('beforeend', realmCard);

  });

  var realmElements = document.querySelectorAll(".go-to-realm");
  realmElements.forEach(elt => {
    elt.addEventListener('click', function () {
      let id = elt.getAttribute("data-realmID")
      localStorage.setItem("realm", id);
      window.location = 'realm_page.html';
    });
  });
}