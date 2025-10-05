// Load environment variables first. This must be at the very top of the file.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Middleware
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(rootDir, 'public')));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    // Exit process on connection failure
    process.exit(1); 
  });

// Import API routes
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Use API routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/messages', messageRoutes);

// Route for serving the main index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});
// Route for serving the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'login.html'));
});

// Route for serving the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'register.html'));
});

// Route for serving the gigs page
app.get('/gigs', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'gigs.html'));
});

// Route for serving the messages page
app.get('/messages', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'messages.html'));
});

// Route for serving the my-gigs page
app.get('/my-gigs', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'my-gigs.html'));
});

// Route for serving the profile page
app.get('/profile', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'profile.html'));
});

// Route for serving the create-gigs page
app.get('/create-gigs', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'create-gigs.html'));
});

// Route for serving the update-gigs page
app.get('/update-gigs', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'pages', 'update-gigs.html'));
});

// Route for serving the employers page
app.get('/employers', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'pages', 'employers.html'));
});

// Route for serving the freelancers page
app.get('/freelancers', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'pages', 'freelancers.html'));
});

// Route for serving the gig details page
app.get('/gig-details', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'pages', 'gig-details.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// _________________________________________________________________________________________________________________________________________________







// // _______________________________________________________________________________________________________________________________________

// const express = require('express');
// const path = require('path');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // Load environment variables first
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect(MONGO_URI)
//     .then(() => {
//         console.log('MongoDB Connected successfully');
//     })
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//     });

// // Serve static files from the 'public' directory
// // This is the correct way to serve static files from the project root.
// app.use(express.static(path.join(__dirname, '..', 'public')));

// // API Routes (place before HTML routes)
// const authRoutes = require('./routes/authRoutes');
// const gigRoutes = require('./routes/gigRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const protect = require('./middleware/authMiddleware');

// app.use('/api/auth', authRoutes);
// app.use('/api/gigs', gigRoutes);
// app.use('/api/messages', messageRoutes);

// // HTML Routes
// // These routes serve the HTML files from the 'public' and 'public/pages' directories.
// // They use the correct path.join to ensure consistency across different OS.

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'login.html'));
// });

// app.get('/register', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'register.html'));
// });

// app.get('/gigs', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'gigs.html'));
// });

// app.get('/freelancers', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'freelancers.html'));
// });

// app.get('/employers', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'employers.html'));
// });

// app.get('/update-gig', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'update-gigs.html'));
// });

// app.get('/my-gigs', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'my-gigs.html'));
// });

// app.get('/messages', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'messages.html'));
// });

// app.get('/profile', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'profile.html'));
// });


// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// ___________________________________________________________________________________________________________________


// server/server.js

// Load environment variables at the very top

// server/server.js

// Load environment variables at the very top
// require('dotenv').config()({ path: require('path').join(__dirname, '..', '.env') });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const authRoutes = require('./routes/authRoutes');
// const gigRoutes = require('./routes/gigRoutes');
// const messageRoutes = require('./routes/messageRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Use middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('MongoDB Connected successfully');
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });

// // Mount API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/gigs', gigRoutes);
// app.use('/api/messages', messageRoutes);

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, '..', 'public')));

// // Start the server and listen on the specified port
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));