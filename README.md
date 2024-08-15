# CS323-S24-team1
## Realmify

Anna Lieb, Adriana Castillo, Ana Rubin, Ye'Amlak Zegeye

Deployed at [cs323-s24-team1.web.app/](https://cs323-s24-team1.web.app/)

Link to group Google Drive [here](https://drive.google.com/drive/folders/1gZjggwTKcFFWwyLOFGMY-FNClywXpA0l?usp=drive_link)

Our proposed website is a creative social platform called *Realmify*. On Realmify, users can collaboratively build visual *realms*, or collections of AI-generated images created with DALL-E. It has elements that are similar to Reddit, because *realms* are themed sub-communities analogous to subreddits. Each realm has a title, description, list of members, and a collection of images that belong to that realm. Users can join realms to view images within that realm, comment on images, and post their own images. In some ways Realmify is also similar to Pinterest, because it is a primarily image-based platform. Within each realm, images are presented along with the natural language prompt that was used to generate it. The platform also enables users to collaborate to create images together within the realms. Users can *remix* each others’ images in a realm. When a user remixes an image, their remix is generated with a prompt that is an edited version of the original post’s language prompt. 

## Files & functions
The file `realm_page.js` renders the page for a specific realm and its posts. It contains the following key functions: 

* `addMessage()` calls `addDoc()` to add a post to a realm in the database. It also makes a request to the OpenAI API to get the AI-generated image, and once the image is generated calls `updateDoc()` to link the post to the image. 
* `listenToUpvotes()` calls `onSnapshot()` to show the current number of upvotes and downvotes with live updating

The file `create_realm.js` allows the user to create a new realm. It contains the following key functions: 

* `addRealm()` calls `addDoc()` to create a new realm in the database

The file `authentication.js` contains the following key functions: 

* `synchronizeUser()` calls `setDoc()` to create a new user in the database

The file `index.js` contains the following key functions: 

* `loadRealms()` calls `getDocs()` to display the realms 