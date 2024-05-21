const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const connection = mongoose.connection
        connection.on("connected", ()=>{
            console.log("Connected to DB")
        })
        connection.on("error", ()=>{
            console.log("Something is wrong", error)
        })
    } catch (error) {
        console.log("Not connected ", error)
    }
}

// o8xpgQA6KiccUe9L

module.exports = connectDB