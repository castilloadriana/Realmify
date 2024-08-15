import { app, signOutUser } from '/src/authentication.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, increment, updateDoc, query, onSnapshot, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// AI generation
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js';
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js"

const db = getFirestore(app);
const functions = getFunctions();
const storage = getStorage();
document.getElementById('send').addEventListener("click", addMessage);

var convId = localStorage.getItem("realm");
getMessages(convId);
listenToUpvotes(convId);

// listen to all posts for upvote changes
function listenToUpvotes(convId) {
  const q = query(collection(db, "realms", convId, "posts"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log("updating with Snapshot", doc.data().upvotes);
      var upspan = $(`.upvote-button[data-id=${doc.id}]`);
      upspan.text($("<div>").html("&#9650; ").text() + doc.data().upvotes);
      var downspan = $(`.downvote-button[data-id=${doc.id}]`);
      downspan.html($("<div>").html("&#9660; ").text() + doc.data().downvotes);
    });
  });
}

const getAIresponse = httpsCallable(functions, 'getAIimage');
var uid = null;
var userName = null;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    uid = user.uid;
    userName = user.displayName;
    console.log("currently signed in as:", userName);
    document.getElementById('profile-link').setAttribute("href", "profile.html?id=" + uid);
  } else {
    window.location = 'login.html';
  }
});

/* This function is attached to the send element eventListeners and updates
* the chat history with the new messages posted by the current user. 
* At the moment, nothing gets updated to the database so these messages 
* will disappear when the page changes.
*/
async function addMessage() {
  let div = document.createElement('div');
  let textVal = document.getElementById('chat-input').value;
  let msg = `<p>Image inspiration: ${textVal}</p><br>`;
  let waitMsg = "<p>Image processing... Please wait until this window reloads.</p>"
  waitMsg += "<p>Image generation may take up to one minute.</p>";
  div.className = 'message';
  div.innerHTML = msg + waitMsg
  document.getElementById("chat-history").appendChild(div);
  document.getElementById('chat-input').value = "";

  let convId = localStorage.getItem("realm");
  console.log(userName, "is contributing to realm: ", convId);

  // get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;

  var newDoc = await addDoc(collection(db, "realms", convId, "posts"), {
    downvotes: 0,
    upvotes: 0,
    prompt: textVal,
    isRemix: false,
    remixedFrom: null,
    authorId: uid,
    authorName: userName,
    url: null,
    dateCreated: today,
  });
  var newID = newDoc.id
  console.log("Document written with ID:", newID);

  // FROM CS 343 GROUP
  // redundant, just for testing
  // console.log("try cs 343");
  // const setDoc343 = httpsCallable(functions, 'setDoc');
  // setDoc343({ ip: "10.140.3.130:5566", params: [{ DocName: './78346.json' },{ ItemID: 'prompt' }, { ItemValue: textVal }] })
  //   .then((result) => {
  //     console.log("CS 343 function setDoc got called " + result.data);
  //   });

  // (async () => {
  //   console.log("Getting CS 343 setDoc")
  //   rawResponse = await fetch('10.140.3.130:5566', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //       "method": "set.SetDocs",
  //       "params": [{'DocName': './78346.json', 'ItemID': 'prompt', 'ItemValue': textVal}],
  //       "jsonrpc": "2.0",
  //       "id": 1})
  //     });
  //     const content = await rawResponse.json();
    
  //     console.log("DONE!" + content);
  //   })();

  getAIresponse({ text: textVal }).then((result) => {
    console.log("got AI response", result);
    var imageData = result.data.image_data;
    console.log(imageData);
    return imageData;
  }).then((image) => {
    const storageRef = ref(storage, 'AIimages/' + newID);
    uploadString(storageRef, image, "base64").then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        updateDoc(doc(db, "realms", convId, "posts", newID), {
          url: url
        });
        console.log("saved url for doc with ID", newID);
        window.location = 'realm_page.html';
      });
    });
  });
}

/* When a user selects a conversation, then the chat-history element gets
* cleared and replaced with all the conversations from the selected
* conversation.
*/
async function getMessages(conversationID) {
  const realm = await getDoc(doc(db, "realms", conversationID));
  console.log("getting messages for ", realm.data().title)
  document.getElementById("chat-history").innerHTML = "";
  document.getElementById("realm-title").innerHTML = "Realm: " + realm.data().title;
  document.getElementById("realm-desc").innerHTML = "Description: " + realm.data().description;

  // UPDATE HERE: change the "conversations" collection for your project
  const qConversations = await getDocs(collection(db, "realms", conversationID, "posts"));

  qConversations.forEach((doc) => {
    let div = document.createElement('div');
    // add text prompt that generated the image
    let postText = `<p><strong>Image inspiration:</strong> ${doc.data().prompt}</p>
    <p class="post-meta">Prompted by: ${doc.data().authorName}</p>
    <p class="post-meta">Created on: ${doc.data().dateCreated}</p>
    <button class="upvote-button" data-id="${doc.id}"> &#9650; ${doc.data().upvotes}</button> 
    <button class="downvote-button" data-id="${doc.id}"> &#9660; ${doc.data().downvotes}</button>
    <button class="remix-button" data-id="${doc.id}">Remix this post</button> <br>`

    div.insertAdjacentHTML('beforeend', postText);
    // add the generated image
    var imageURL = doc.data().url;
    if (imageURL != null) {
      let image = document.createElement('img')
      image.setAttribute("class", "generated-image");
      image.setAttribute("src", imageURL);
      div.appendChild(image);
    } else {
      let errorMsg = document.createElement('p');
      errorMsg.textContent = "Image unavailable."
      errorMsg.style.color = "red";
      div.appendChild(errorMsg);
    }
    div.className = 'message user-message';
    document.getElementById("chat-history").appendChild(div);
  });

  // add event listeners to the upvote buttons
  $('#chat-history').on("click", ".upvote-button", async function (event) {
    var thisPost = event.target;
    console.log(thisPost)
    var thisID = await thisPost.getAttribute("data-id");
    console.log("upvoting post with ID:", thisID);
    var thisDoc = await doc(db, "realms", conversationID, "posts", thisID);
    await updateDoc(thisDoc, {
      upvotes: increment(1)
    })
  });

  // add event listeners to the down buttons
  $('#chat-history').on("click", ".downvote-button", async function (event) {
    var thisPost = event.target;
    var thisID = thisPost.getAttribute("data-id");
    console.log("downvoting post with ID:", thisID);
    var thisDoc = await doc(db, "realms", conversationID, "posts", thisID);
    await updateDoc(thisDoc, {
      downvotes: increment(1)
    })
  });

  // add event listeners to the remix buttons (TO DO)
  $('#chat-history').on("click", ".remix-button", async function (event) {
    var thisPost = event.target;
    var thisID = thisPost.getAttribute("data-id");
    console.log("remixing post with ID:", thisID);
    var thisDoc = await getDoc(doc(db, "realms", conversationID, "posts", thisID));
    // append the message to the input box
    document.getElementById('chat-input').value = thisDoc.data().prompt;
  });
}