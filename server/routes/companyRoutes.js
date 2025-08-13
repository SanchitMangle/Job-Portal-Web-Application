import express, { Router } from 'express'
import { registerCompany,companyLogin,getCompanyData,getComopanyJobApplications,getCompanyPostedJobs,postJob,changeJobApplicationStatus,changeJobVisibility } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/authMiddleware.js'

const router = Router()

// Register company
router.post('/register',upload.single('image'), registerCompany)

// Companynlogin
router.post('/login',companyLogin)

// get company data 
router.get('/company',protectCompany, getCompanyData)

// Post new job
router.post('/post-job',protectCompany, postJob)

// get company applicants data
router.get('/applicants',protectCompany, getComopanyJobApplications)

// get company job list
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)

// Change Application Status
router.post('/change-status',protectCompany, changeJobApplicationStatus)

// Change application visibilty
router.post('/change-visiblity',protectCompany, changeJobVisibility)

export default router