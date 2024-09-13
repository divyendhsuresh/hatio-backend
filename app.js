const express = require('express');
const dotenv = require('dotenv');
const mongo = require('./config/db');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const gistUpload = require('./controllers/gistController');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
mongo.on("error", console.error.bind(console, "MongoDB connection error:"));


// Middleware to parse JSON requests
app.use(express.json());

// Routes

app.use('/api/users', userRoutes);
app.use('/api/gist', gistUpload);
app.use('/api/project', projectRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
