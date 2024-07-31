const asyncHandler = require('express-async-handler');
const { ValidationNew } = require('../utils/validation');
const jwt = require('jsonwebtoken')

const User = require('../models/User');


exports.adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const x = ValidationNew(res, [
        { keyname: "email", value: email, validations: [{ except: false, key: "isEmpty" }, { except: true, key: "isEmail" }] },
        { keyname: "password", value: password, validations: [{ except: false, key: "isEmpty" }, { except: true, key: "isStrongPassword" }] }
    ])
    if (x) {
        return;
    }
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(400).json({ message: "User Not Found" })
    }
    if (result.password !== password) {
        return res.status(400).json({ message: "Wrong Password" })
    }
    const token = jwt.sign({ userId: result._id }, "secret@123", { expiresIn: "5hr" })
    res.cookie("googleFormToken", token)
    res.status(200).json({ message: "Welcome Back" + ' ' + result.name, result })
})
