const { adminLogin } = require('../controller/auth.controller')

const router = require('express').Router()


router
    .post("/login-admin", adminLogin)




module.exports = router