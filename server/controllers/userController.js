import Job from "../models/job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/user.js"
import { v2 as cloudinary } from "cloudinary"

//  Get user data 
export const getUserData = async (req, res) => {

    const userId = req.auth.userId
    try {

        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Apply for Job 
export const applyForJob = async (req, res) => {

    const { jobId } = req.body
    const userId = req.auth.userId

    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })
        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: "Already Applied" })
        }

        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({ success: false, message: "Job Not Found" })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: "Applied Successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }


}


// Get user applied applications
export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth.userId

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user.' })
        }

        return res.json({ success: true, applications })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// update user profile (resume)
export const updateUserResume = async (req, res) => {

    try {

        const userId = req.auth.userId
        const resumeFile = req.file
        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({ success: true, message:'Resume Updated' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}