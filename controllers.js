import * as files from './services/files.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createProject(req, res) {
    const projectName = 'newProject'
    const projectPath = path.join(__dirname, 'database', 'projects', projectName)

    try {
        const templatePath = path.join(__dirname, 'database', 'template')

        // Copie le template du projet
        await files.copyDirectory(templatePath, projectPath)

        // Exécute npm install dans le répertoire du projet avec les sorties redirigées
        const child = spawn('npm', ['install'], { cwd: projectPath, stdio: 'inherit' })

        child.on('error', error => {
            console.error(`Error during npm install: ${error.message}`)
            res.status(500).send('npm install failed: ' + error.message)
        })

        child.on('close', code => {
            if (code === 0) {
                console.log('NPM install completed successfully.')
                res.status(200).send('Project created successfully')
            } else {
                console.error(`NPM install exited with code ${code}`)
                res.status(500).send(`npm install failed with code ${code}`)
            }
        })
    } catch (error) {
        console.error(`Error when creating project: ${error.message}`)
        res.status(500).send('Error when creating project: ' + error.message)
    }
}

export {
    createProject
}
