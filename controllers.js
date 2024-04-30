import * as files from './fileServices.js'


async function createProject(req, res) {
    try {
        const projectsFile = JSON.parse(await files.readFile('../database/projects.json'))

        await files.copyDirectory('../database/template', '../database/projects/' + newProject)
        
    } catch (error) {
        res.status(500).send('Error when creating project :' + error)
    }
}

export {
    createProject
}