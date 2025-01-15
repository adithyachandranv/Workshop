const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');

const app = express();
const server = http.createServer(app);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views folder

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true })); // Built-in middleware in Express

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure cookies in production
}));

// Serve static files (like images, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Render the index.ejs file from the views folder
app.get('/', (req, res) => {
    res.render('index'); // This will render 'views/index.ejs'
});

// Handle the form submission (POST request)
app.post('/register', (req, res) => {
    // Extract form data from the request body
    const { name, email, password } = req.body;

    // Check if req.body is undefined or doesn't contain the expected properties
    if (!name || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    console.log('Received registration data:', { name, email, password });

    req.session.name = name;


    res.redirect('/dashboard');
});

// Render the dashboard page with the user's name from the session
app.get('/dashboard', (req, res) => {
    const name = req.session.name; // Get the name from the session
    if (!name) {
        return res.redirect('/'); // If the name is not in the session, redirect to the registration page
    }
    res.render('dashboard', { name });
});

// Start the server
server.listen(3000, () => {
    console.log('Server listening on *:3000');
});
