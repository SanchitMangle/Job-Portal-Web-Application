import jwt from 'jsonwebtoken'
import Company from '../models/company.js'

export const protectCompany = async (req, res, next) => {

    const token = req.headers.token
    if (!token) {
        res.json({ success: false, message: "Not Authorised,Login Again" })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRETE)
        req.company = await Company.findById(decoded.id).select('-password')
        next()

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}