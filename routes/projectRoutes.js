const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/jwtController');
const Project = require('../models/project');
const User = require('../models/user');



//new project
router.post('/', authMiddleware, async (req, res) => {
    const { title, userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newProject = new Project({
            title,
            user: user._id
        });

        const savedProject = await newProject.save();

        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
});

router.delete('/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this project' });
        }

        await Project.findOneAndDelete({ id: projectId });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
});



router.get('/', authMiddleware, async (req, res) => {
    const { userId } = req.query;
    // console.log(userId);
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projects = await Project.find({ user: userId });

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});



router.get('/projects/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
});

//add todo
router.post('/todos/:projectId', authMiddleware, async (req, res) => {
    console.log("test string");
    const { projectId } = req.params;
    const { description, status } = req.body;
    console.log(projectId);
    console.log(req.body);

    if (!description || !status) {
        return res.status(400).json({ message: 'Todo description and status are required' });
    }

    try {
        const project = await Project.findOne({ id: projectId });

        console.log(project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newTodo = {
            description,
            status
        };

        project.todos.push(newTodo);
        const updatedProject = await project.save();

        res.status(201).json(updatedProject);
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: 'Error adding todo', error });
    }
});

// update a todo in a project
router.post('/todos/:projectId/:todoId', authMiddleware, async (req, res) => {
    const { projectId, todoId } = req.params;
    const { description, status } = req.body;

    try {
        const project = await Project.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const todo = project.todos.id(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (description) todo.description = description;
        if (status) todo.status = status;
        todo.updatedDate = new Date();

        const response = await project.save();
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error });
    }
});


router.get('/:projectId/todos', authMiddleware, async (req, res) => {
    const { projectId } = req.params; // projectId is now UUID

    try {
        // here the project is UUID (id field, not _id)
        const project = await Project.findOne({ id: projectId });
        // console.log(project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not have access to this project' });
        }

        res.status(200).json(project.todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
});


//  delete a todo from a project
router.delete('/todos/:projectId/:todoId', authMiddleware, async (req, res) => {
    const { projectId, todoId } = req.params;

    try {
        const project = await Project.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const todo = project.todos.id(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.remove();
        await project.save();

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error });
    }
});


module.exports = router;
