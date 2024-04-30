import { Router } from 'express'
export const publicRouter = Router()

import {
    createProject
} from './controllers.js'

publicRouter.post('/createproject', createProject)