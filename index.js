const express = require('express');
const app = express();
const admin = require('firebase-admin');
const port = 4000;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});




var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xingoda-e4195-default-rtdb.firebaseio.com"
});


let db = admin.firestore();


app.use(express.json());

// Add a new item to the cart with the given ID because you are having uid also so only show cart items of that user whose uid matches

app.post('/cart/add', async (req, res) => {
  const item = req.body;
  const userId = req.body.uid; 
  const docRef = db.collection(`cartItems_${userId}`).doc(String(item.id));
  await docRef.set(item);
  res.json(item);
});


// Remove the card item from that user cart only
app.post('/cart/remove', async (req, res) => {
  let { id, userId } = req.body; 
  id = String(id);
  userId = String(userId);
  console.log(`ID: ${id}`);
  console.log(`userId: ${userId}`)
  await db.collection(`cartItems_${userId}`).doc(id).delete();
  res.json({ id });
});


// I am having uid also so only show cart items of that user whose uid matches
app.get('/cart', async (req, res) => {
  const userId = req.query.uid;
  const snapshot = await db.collection(`cartItems_${userId}`).get();
  const items = snapshot.docs.map(doc => doc.data());
  res.json(items);
});




// app.post('/cart/add', async (req, res) => {
//   const item = req.body;
//   const userId = req.body.userId; 
//   const docRef = db.collection(`cartItems_${userId}`).doc(String(item.id));
//   await docRef.set(item);
//   res.json(item);
// });

// app.post('/cart/remove', async (req, res) => {
//   const { id, userId } = req.body; 
//   console.log(`ID: ${id}`); // Add this line
//   await db.collection(`cartItems_${userId}`).doc(id).delete();
//   res.json({ id });
// });


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
