// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const helmet = require('helmet');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const { body, validationResult } = require('express-validator');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // In-memory data storage
// let users = []; // Store user data
// let snacks = [
//     { id: 1, name: "Chips", price: 1.50, description: "Crispy potato chips", image: "/images/chips.jpg" },
//     { id: 2, name: "Chocolate Bar", price: 2.00, description: "Delicious milk chocolate", image: "/images/chocolate-bar.jpg" },
//     { id: 3, name: "Gummy Bears", price: 2.50, description: "Fruity gummy candies", image: "/images/gummy-bears.jpg" },
//     { id: 4, name: "Popcorn", price: 3.00, description: "Buttery popcorn", image: "/images/popcorn.jpg" },
//     { id: 5, name: "Cookies", price: 2.75, description: "Freshly baked cookies", image: "/images/cookies.jpg" },
//     { id: 6, name: "Nuts", price: 3.50, description: "Mixed nuts for snacking", image: "/images/nuts.jpg" },
//     { id: 7, name: "Granola Bar", price: 1.75, description: "Healthy granola bar", image: "/images/granola-bar.jpg" },
//     { id: 8, name: "Fruit Snacks", price: 2.25, description: "Chewy fruit snacks", image: "/images/fruit-snacks.jpg" },
//     { id: 9, name: "Beef Jerky", price: 4.00, description: "Savory beef jerky", image: "/images/beef-jerky.jpg" },
//     { id: 10, name: "Ice Cream", price: 5.00, description: "Creamy ice cream", image: "/images/ice-cream.jpg" }
// ];

// let orders = []; // Store order data

// // Middleware setup
// app.use(helmet());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
// }));

// // Set up the view engine and views directory
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files
// app.use('/images', express.static(path.join(__dirname, 'public/images')));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));

// // Render the home page
// app.get('/', (req, res) => {
//     res.render('index', { snacks, cart: req.session.cart || [] });
// });

// // User registration page
// app.post('/register', [
//     body('username').notEmpty().withMessage('Username is required'),
//     body('email').isEmail().withMessage('Invalid email format'),
//     body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
// ], async (req, res) => {
//     try {
//         console.log("Register route hit");

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.render('register', {
//                 errors: errors.array(),
//                 username: req.body.username,
//                 email: req.body.email
//             });
//         }

//         const { username, email, password } = req.body;
//         const existingUser = users.find(u => u.username === username || u.email === email);
//         if (existingUser) {
//             return res.render('register', {
//                 errors: [{ msg: 'Username or email already exists' }],
//                 username: req.body.username,
//                 email: req.body.email
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         users.push({ username, email, password: hashedPassword });
//         res.redirect('/login');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// // User login page
// app.get('/login', (req, res) => {
//     res.render('login', { error: null });
// });

// // User login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username);
//     if (user && await bcrypt.compare(password, user.password)) {
//         req.session.userId = username;
//         req.session.cart = []; // Initialize user cart
//         return res.redirect('/'); // Redirect to home after successful login
//     }
//     res.render('login', { error: 'Invalid credentials' });
// });

// // Logout
// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/login');
// });


// // Add to Cart
// app.post('/add-to-cart', (req, res) => {
//     const { snackName, quantity } = req.body;
//     const snack = snacks.find(s => s.name === snackName);

//     if (!snack) {
//         return res.status(404).send('Snack not found');
//     }

//     if (!req.session.cart) {
//         req.session.cart = [];
//     }

//     const existingItem = req.session.cart.find(item => item.snackName === snackName);
//     if (existingItem) {
//         existingItem.quantity += parseInt(quantity);
//     } else {
//         req.session.cart.push({
//             snackName,
//             price: snack.price,
//             quantity: parseInt(quantity),
//         });
//     }

//     res.redirect('/');
// });

// // Render the checkout page
// app.get('/checkout', (req, res) => {
//     if (!req.session.cart || req.session.cart.length === 0) {
//         return res.redirect('/');
//     }

//     res.render('checkout', { cart: req.session.cart });
// });

// // Handle order confirmation
// app.post('/confirm-checkout', (req, res) => {
//     if (!req.session.cart || req.session.cart.length === 0) {
//         return res.status(400).send('Your cart is empty');
//     }

//     const orderId = orders.length + 1;
//     orders.push({ id: orderId, items: req.session.cart });
    
//     req.session.cart = [];
//     res.redirect('/'); // Redirect to home page after placing the order
// });

// // GET route for specific order
// app.get('/orders/:id', (req, res) => {
//     const order = orders.find(o => o.id == req.params.id);
//     if (!order) {
//         return res.status(404).send('Order not found');
//     }
//     res.render('order', { order });
// });

// // PATCH route to update a snack
// app.patch('/snacks/:id', (req, res) => {
//     const snack = snacks.find(s => s.id == req.params.id);
//     if (!snack) {
//         return res.status(404).send('Snack not found');
//     }

//     const { name, price, description } = req.body;
//     if (name) snack.name = name;
//     if (price) snack.price = price;
//     if (description) snack.description = description;

//     res.send('Snack updated successfully');
// });

// // DELETE route to remove a snack
// app.delete('/snacks/:id', (req, res) => {
//     const snackIndex = snacks.findIndex(s => s.id == req.params.id);
//     if (snackIndex === -1) {
//         return res.status(404).send('Snack not found');
//     }

//     snacks.splice(snackIndex, 1);
//     res.send('Snack deleted successfully');
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data storage
let users = [];
let snacks = [
    { id: 1, name: "Chips", price: 1.50, description: "Crispy potato chips", image: "/images/chips.jpg" },
    { id: 2, name: "Chocolate Bar", price: 2.00, description: "Delicious milk chocolate", image: "/images/chocolate-bar.jpg" },
    { id: 3, name: "Gummy Bears", price: 2.50, description: "Fruity gummy candies", image: "/images/gummy-bears.jpg" },
    { id: 4, name: "Popcorn", price: 3.00, description: "Buttery popcorn", image: "/images/popcorn.jpg" },
    { id: 5, name: "Cookies", price: 2.75, description: "Freshly baked cookies", image: "/images/cookies.jpg" },
    { id: 6, name: "Nuts", price: 3.50, description: "Mixed nuts for snacking", image: "/images/nuts.jpg" },
    { id: 7, name: "Granola Bar", price: 1.75, description: "Healthy granola bar", image: "/images/granola-bar.jpg" },
    { id: 8, name: "Fruit Snacks", price: 2.25, description: "Chewy fruit snacks", image: "/images/fruit-snacks.jpg" },
    { id: 9, name: "Beef Jerky", price: 4.00, description: "Savory beef jerky", image: "/images/beef-jerky.jpg" },
    { id: 10, name: "Ice Cream", price: 5.00, description: "Creamy ice cream", image: "/images/ice-cream.jpg" }
];

let orders = [];

// Middleware setup
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-default-secret',
    resave: false,
    saveUninitialized: true,
}));

// Set up the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Middleware to make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.userId; 
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Internal Server Error');
});
// Render the home page
app.get('/', (req, res) => {
    res.render('index', { snacks, cart: req.session.cart || [] });
});
// User registration page (GET)
app.get('/register', (req, res) => {
    res.render('register', { errors: null, username: '', email: '' });
});
// User registration page
app.post('/register', [
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', {
                errors: errors.array(),
                username: req.body.username,
                email: req.body.email
            });
        }

        const { username, email, password } = req.body;
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.render('register', {
                errors: [{ msg: 'Username or email already exists' }],
                username: req.body.username,
                email: req.body.email
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, email, password: hashedPassword });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// User login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = username;
        req.session.cart = [];
        return res.redirect('/'); 
    }
    res.render('login', { error: 'Invalid credentials' });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Add to Cart
app.post('/add-to-cart', (req, res) => {
    const { snackName, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).send('Quantity must be greater than zero');
    }

    const snack = snacks.find(s => s.name === snackName);
    if (!snack) {
        return res.status(404).send('Snack not found');
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.snackName === snackName);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        req.session.cart.push({
            snackName,
            price: snack.price,
            quantity: parseInt(quantity),
        });
    }

    res.redirect('/');
});

// Render the checkout page
app.get('/checkout', (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/');
    }

    res.render('checkout', { cart: req.session.cart });
});

// Handle order confirmation
app.post('/confirm-checkout', (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).send('Your cart is empty');
    }

    const orderId = orders.length + 1;
    const userId = req.session.userId; 
    const orderDetails = {
        id: orderId,
        user: userId, 
        items: req.session.cart,
        timestamp: new Date() 
    };
    
    orders.push(orderDetails);
    req.session.cart = []; 

    res.redirect(`/orders/${orderId}`); 
});

// GET route for specific order
app.get('/orders/:id', (req, res) => {
    const order = orders.find(o => o.id == req.params.id);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    res.render('order', { order });
});

// PATCH route to update a snack
app.patch('/snacks/:id', (req, res) => {
    const snack = snacks.find(s => s.id == req.params.id);
    if (!snack) {
        return res.status(404).send('Snack not found');
    }

    const { name, price, description } = req.body;
    if (name) snack.name = name;
    if (price) snack.price = price;
    if (description) snack.description = description;

    res.json({ message: 'Snack updated successfully' });
});

// DELETE route to remove a snack
app.delete('/snacks/:id', (req, res) => {
    const snackIndex = snacks.findIndex(s => s.id == req.params.id);
    if (snackIndex === -1) {
        return res.status(404).send('Snack not found');
    }

    snacks.splice(snackIndex, 1);
    res.json({ message: 'Snack deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
