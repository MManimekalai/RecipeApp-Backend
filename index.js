// Import Express and other necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
//const {connectDB} = require('./config/database')


require('dotenv').config();


app.use(cors({
  origin: '*', // Allow requests from your local frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));


// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Import errorMiddleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Use the error middleware
app.use(errorMiddleware);



// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Include your route files
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes')
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const userRoutes = require('./routes/userRoutes');

// Use the routes in your Express app
app.use('/auth', authRoutes); 
app.use('/recipes', recipeRoutes); 
app.use('/comments', commentRoutes); 
app.use('/likes', likeRoutes);
app.use('/user', userRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

