import express from 'express'
import { getJobId, getJobs } from '../controllers/jobController.js'

const router  = express.Router()

// Route to get all jobs data
router.get('/',getJobs)

// Route to get single job by ID 
router.get('/:id',getJobId)

export default router


