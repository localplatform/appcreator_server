import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function readFile(location) {
    const filePath = path.join(__dirname, location)

    try {
        const data = await fs.readFile(filePath, 'utf8')
        return data
    } catch (error) {
        throw new Error('Erreur lors de la lecture du fichier : ' + error.message)
    }
}

export async function writeFile(filePath, content) {
    const fullPath = path.join(__dirname, filePath)
    try {
        await fs.writeFile(fullPath, content, 'utf8')
    } catch (error) {
        throw new Error('Erreur lors de l\'écriture du fichier : ' + error.message)
    }
}

export async function copyFile(source, destination) {
    const srcPath = path.join(__dirname, source)
    const destPath = path.join(__dirname, destination)
    try {
        await fs.copyFile(srcPath, destPath)
    } catch (error) {
        throw new Error('Erreur lors de la copie du fichier : ' + error.message)
    }
}

export async function copyDirectory(source, destination) {
    const srcDir = path.resolve(__dirname, source)
    const destDir = path.resolve(__dirname, destination)

    try {
        // Crée le répertoire de destination s'il n'existe pas
        await fs.mkdir(destDir, { recursive: true })

        // Lire le contenu du répertoire source
        const items = await fs.readdir(srcDir)

        for (let item of items) {
            const srcItem = path.join(srcDir, item)
            const destItem = path.join(destDir, item)

            // Vérifie si l'élément est un fichier ou un dossier
            const stats = await fs.stat(srcItem)

            if (stats.isDirectory()) {
                // Appel récursif pour copier le sous-dossier
                await copyDirectory(srcItem, destItem)
            } else {
                // Copie si c'est un fichier
                await fs.copyFile(srcItem, destItem)
            }
        }
    } catch (error) {
        throw new Error('Erreur lors de la copie du répertoire : ' + error.message)
    }
}