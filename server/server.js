import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js"

const app = express()
const serverPort = process.env.PORT || 4000;
connectDB()

const allowedOrigins = ['http://localhost:5173', 'https://mern-auth-client-tau.vercel.app/']
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))


//API Endpoints
app.get("/", (req, res) => {
    res.send("API is working")
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


app.listen(serverPort, () => {
    console.log(`server is running on port ${serverPort}`)
})