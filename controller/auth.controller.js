const asyncHandler = require('express-async-handler');
const { ValidationNew } = require('../utils/validation');
const jwt = require('jsonwebtoken')

const User = require('../models/User');


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('487481786057-8fm17ohhro27tmdmg91easmugj9l0i1l.apps.googleusercontent.com');

exports.verifyToken = async function verifyToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '487481786057-8fm17ohhro27tmdmg91easmugj9l0i1l.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
    }
}











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
    const token = jwt.sign({ userId: result._id }, "secret@123", { expiresIn: "15hr" })
    res.cookie("googleFormToken", token, {
        // sameSite: 'lax',
        secure: false,
        httpOnly: false
    })
    res.status(200).json({ message: "Welcome Back" + ' ' + result.name, result })
})
