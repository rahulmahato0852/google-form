const expressAsyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')

exports.userProtected = expressAsyncHandler(async (req, res, next) => {

    const { googleFormToken } = req.cookies
    console.log("called");
    if (!googleFormToken) {
        return res.status(401).json({ message: "No Cookie found" })
    }

    jwt.verify(googleFormToken, process.env.JWT_KEY, (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Session expired" })
        }
        req.body.userId = data.userId
        next()
    })
})