const express = require('express');
const router = express.Router();
const axios = require('axios');


const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function generateMarkdownContent(projectTitle, pendingTodos, completedTodos) {
    const totalTodos = pendingTodos.length + completedTodos.length;
    const completedCount = completedTodos.length;

    // create md format
    return `
  # ${projectTitle}
  
  ## Summary: ${completedCount} / ${totalTodos} completed
  
  ### Pending Todos:
  ${pendingTodos.map(todo => `- [ ] ${todo.title}`).join('\n')}
  
  ### Completed Todos:
  ${completedTodos.map(todo => `- [x] ${todo.title}`).join('\n')}
    `;
}

router.post('/create-gist', async (req, res) => {
    const { projectTitle, todos } = req.body;

    if (!projectTitle || !todos || !Array.isArray(todos)) {
        return res.status(400).json({ message: 'Invalid input. Please provide a project title and a list of todos.' });
    }

    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    const gistContent = generateMarkdownContent(projectTitle, pendingTodos, completedTodos);

    const gistData = {
        description: `${projectTitle} - Project Todos`,
        public: true,
        files: {
            [`${projectTitle}.md`]: {
                content: gistContent
            }
        }
    };

    try {
        // send to create the Gist
        const response = await axios.post('https://api.github.com/gists', gistData, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        res.status(200).json({
            message: 'Gist created successfully!',
            gistId: response.data.id,
            gistUrl: response.data.html_url
        });
    } catch (error) {
        console.error('Error creating Gist:', error);
        res.status(500).json({ message: 'Failed to create Gist', error: error.message });
    }
});


router.get('/download-gist/:gistId', async (req, res) => {
    const { gistId } = req.params;

    try {
        const response = await axios.get(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        //getting the file extract
        const gistFiles = response.data.files;
        const fileNames = Object.keys(gistFiles);

        const fileContent = gistFiles[fileNames[0]].content;

        res.status(200).json({
            message: 'Gist downloaded successfully',
            filename: fileNames[0],
            content: fileContent
        });
    } catch (error) {
        console.error('Error downloading Gist:', error);
        res.status(500).json({ message: 'Failed to download Gist', error: error.message });
    }
});




module.exports = router;