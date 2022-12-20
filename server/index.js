import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"

import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from "./routes/auth.js"
import postRoute from "./routes/posts.js"
import commentRoute from "./routes/comments.js"

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express()
dotenv.config()

// Constans
const PORT = process.env.PORT || 8081
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
// const DB_NAME = process.env.DB_NAME

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client")))

    const indexPath = path.join(__dirname, "client", "index.html")

    app.get("*", (req, res) => {
        res.sendFile(indexPath)
    })
}

// Middleware
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.static("uploads"))

// Routes
// http://localhost:8080
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)

async function start() {
    try {
        await mongoose.connect(
            `mongodb://${DB_USER}:${DB_PASSWORD}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bgfgzr4bgmudy93?replicaSet=rs0`
        )
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start()
