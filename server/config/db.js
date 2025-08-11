import mongoose from "mongoose";

// Function to connect to mongoDB

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("DB CONNECTED"))
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
}

export default connectDB