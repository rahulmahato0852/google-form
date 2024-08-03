const { addFormResponse, getFormResponse, checkIsAlreadyRespond } = require("../controller/user-controller");

const Router = require("express").Router();


Router
    .post("/add-response/:id", addFormResponse)
    .get("/get-response", getFormResponse)
    .get("/check-alredy-response", checkIsAlreadyRespond)




module.exports = Router
