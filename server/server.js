import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'


// Initilaize Express
const app = express()
const PORT = process.env.PORT || 5000

// Connect to Database
 await connectDB()

// Middlewears 

app.use(cors())
app.use(express.json())

// Routes

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.post('/webhooks',clerkWebhooks)

// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });


Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
    
})