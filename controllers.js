import * as files from './fileServices.js'
import { exec } from 'child_process'
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
        const newProjectPath = path.join(__dirname, 'database', 'projects', projectName)

        // Copie le template du projet
        await files.copyDirectory(templatePath, newProjectPath)

        // Exécute npm install dans le répertoire du projet
        const child = spawn('npm', ['install'], { cwd: newProjectPath })

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`)
        })

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`)
        })

        child.on('error', (error) => {
            console.error(`error: ${error.message}`)
            res.status(500).send('npm install failed: ' + error.message)
        })

        child.on('exit', (code) => {
            if (code === 0) {
                res.status(200).send('Project created successfully')
            } else {
                res.status(500).send(`npm install failed with code ${code}`)
            }
        })
    } catch (error) {
        res.status(500).send('Error when creating project: ' + error.message)
    }
}


export {
    createProject
}