import { Webhook } from "svix";
import User from "../models/user.js";

// API controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {

    try {
        // Create sexix instance with clerk webhook secrerte
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRETE)

        // Verifying headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-signature": req.headers["svix-signature"],
            "svix-timestamp": req.headers["svix-timestamp"]
        })

        // GEtting data from req.body
        const { data, type } = req.body

        // Switch cases for differnt events

        switch (type) {
            case 'user.created': {

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                await User.create(userData)
                res.json({})
                break;

            }

            case 'user.updated': {

                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;

            }

            case 'user.deleted': {

                await User.findByIdAndDelete(data.id)
                res.json({})
                break;

            }

            default:
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"Webhooks Error"})
    }


}