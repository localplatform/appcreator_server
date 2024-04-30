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

    /*try {
        // Copie le template du projet
        await files.copyDirectory('./database/template', './database/projects/' + projectName)

        // Exécute npm install dans le répertoire du projet
        exec(`npm install`, { cwd: projectPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                return res.status(500).send('npm install failed: ' + error)
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)
            
            res.status(200).send('Project created successfully')
        })
    } catch (error) {
        res.status(500).send('Error when creating project :' + error.message)
    }*/

    try {
        // Copie le template du projet
        await files.copyDirectory('./database/template', './database/projects/' + projectName)

        // Exécute npm install dans le répertoire du projet
        const npmInstall = spawn('npm', ['install'], { cwd: projectPath })

        npmInstall.stdout.on('data', data => {
            console.log(`stdout: ${data}`)
        })

        npmInstall.stderr.on('data', data => {
            console.error(`stderr: ${data}`)
        })
        

        npmInstall.on('close', code => {
            if (code === 0) {
                res.status(200).send('Project created successfully')
            } else {
                res.status(500).send('npm install failed with code ' + code)
            }
        })
    } catch (error) {
        res.status(500).send('Error when creating project :' + error.message)
    }
}


export {
    createProject
}