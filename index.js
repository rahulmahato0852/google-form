const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { userProtected } = require('./middleware/userProtected')
require('dotenv').config({ path: "" })

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:4200",
    // origin: "https://google-form-xayl.onrender.com/",
    credentials: true
}))

app.use(express.static('uploads'))
app.use(express.static(path.join(__dirname, "dist", "client/browser")));
app.use(cookieParser())





app.use("/api/form", require('./routes/forms.routes'))
app.use("/api/user", require('./routes/user.routes'))
app.use("/api/auth", require('./routes/auth.routes'))



app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "SERVER ERROR" })
    next();
})




app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "client/browser/index.html"));
    // res.status(404).json({ message: "Resource not found" })
})


mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("Mongoose connected");
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})

