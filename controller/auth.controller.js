const asyncHandler = require('express-async-handler');
const { ValidationNew } = require('../utils/validation');


exports.adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const x = ValidationNew(res, [
        { keyname: "email", value: email, validations: [{ except: false, key: "isEmpty" }, { except: true, key: "isEmail" }] },
        { keyname: "password", value: password, validations: [{ except: false, key: "isEmpty" }, { except: true, key: "isStrongPassword" }] }
    ])
    if (x) {
        return;
    }





})
