
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors'); 

const app = express();
// --- Middleware ---
app.use(cors({ origin: true }));
app.use(express.json());
// _________________________________________________________________

app.get('/', (req, res) => {
    // This route will be accessible at your-url.web.app/api/
    res.send('API is running...');
});
// _________________________________________________________________________________

app.get('/api/gigs', (req, res) => {
    // This route will be accessible at your-url.web.app/api/gigs
    res.status(200).send({ message: 'List of gigs from Node.js server' });
});

// _____________________________________________________________________________________________

// 2. Export the Express app as a Firebase Function named 'api'
// This is the only line that tells Firebase to run your app.
exports.api = functions.https.onRequest(app);

// NOTE: The line 'app.listen(PORT, ...)' has been removed!

// __________________________________________________________________________________________________________________


// const express = require('express');

// // this is firebase functions 
// const functions = require('firebase-functions');
// const express = require('express');
// const cors = require('cors'); // Essential for connecting frontend/backend

// const app = express();
// // _________________________________________________________________

// app.use(cors({ origin: true }));
// app.use(express.json());
// // ________________________________________________________________________

// const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });
// // _________________________________________________________________________________

// app.get('/api/gigs', (req, res) => {
//     // Your original Express logic
//     res.status(200).send({ message: 'List of gigs from Node.js server' });
// });

// // _____________________________________________________________________________________________

// // 2. Export the Express app as a Firebase Function named 'api'
// exports.api = functions.https.onRequest(app);
// // ________________________________________________________________________________________________

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));