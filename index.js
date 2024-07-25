const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: "" })

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}))

app.use(express.static('uploads'))
app.use(cookieParser())





app.use("/api/form", require('./routes/forms.routes'))
app.use("/api/user", require('./routes/user.routes'))



app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "SERVER ERROR" })
    next()
})




app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource not found" })
})


mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("Mongoose connected");
    app.listen(3000, console.log("SERVER RUNNING"))
})

