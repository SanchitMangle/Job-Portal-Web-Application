import { json } from "express";
import Job from "../models/job.js"


// Get all jobs

export const getJobs = async (req, res) => {

    try {

        const jobs = await Job.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' })

        res.json({ success: true, jobs })

    } catch (error) {
        console.log(error);
        res, json({ success: false, message: error.message })
    }

}

// Get Single Job by ID

export const getJobId = async (req, res) => {

    try {

        const { id } = req.params
        const job = await Job.findById(id)
            .populate({ path: 'companyId', select: '-password' })

        if (!job) {
            res.json({ success: false, message: "Job Not Found" })
        }

        res.json({ success: true, job })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}