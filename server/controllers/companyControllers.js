import Company from "../models/company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from '../models/job.js'
import JobApplication from "../models/jobApplication.js"

// Register anew Company 

export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.json({ success: false, message: "Company already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        });

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Company Login

export const companyLogin = async (req, res) => {

    try {
        const { email, password } = req.body

        const company = await Company.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {

            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });

        }
        else {
            res.json({ success: false, message: "Invalid email or password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Get company Data

export const getCompanyData = async (req, res) => {

    try {

        const company = req.company
        res.json({
            success: true,
            company
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }

}

// Post a new Job

export const postJob = async (req, res) => {

    const { title, description, location, salary, level, category } = req.body
    const companyId = req.company._id

    try {

        const newJob = await Job({
            title,
            description,
            location,
            salary,
            level,
            companyId,
            date: Date.now(),
            category
        })

        await newJob.save()
        res.json({ success: true, newJob })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }


}

// get company job Applications

export const getComopanyJobApplications = async (req, res) => {

    try {

        const companyId = req.company._id

        // find job aoolications for user and populate related data
        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category salary level')
            .exec()

        return res.json({ success: true, applications })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Get company posted Jobs

export const getCompanyPostedJobs = async (req, res) => {

    try {

        const companyId = req.company._id
        const jobs = await Job.find({ companyId })

        // Adding no. of applicants info in jobData
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id })
            return { ...job.toObject(), applicants: applicants.length }
        }))

        res.json({
            success: true,
            jobsData
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Change job applications status

export const changeJobApplicationStatus = async (req, res) => {

    try {

        const { id, status } = req.body

        // find job applications data and update
        await JobApplication.findOneAndUpdate({ _id: id }, { status })

        res.json({ success: true, message: "Status updated" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}


// Change job visiblity

export const changeJobVisibility = async (req, res) => {

    try {

        const { id } = req.body
        const companyId = req.company._id

        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()
        res.json({ success: true, job })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}