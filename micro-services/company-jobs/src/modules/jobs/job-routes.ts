import { Router }  from 'express'
import {getJobs , getJobById} from './job-controller.js'

const router = Router()

router.get( "/", getJobs)
router.get("/:id", getJobById);

export default router