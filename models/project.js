const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const todoSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 }, // Using UUID as id
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

// Define Project Schema with todos as an array of `todoSchema`
const projectSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 }, // Using UUID as id
    title: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    todos: [todoSchema], // Embed the schema for todos
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
});

// Create Models
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;