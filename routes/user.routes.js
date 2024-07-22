const { addFormResponse, getFormResponse } = require("../controller/user-controller");

const Router = require("express").Router();


Router
    .post("/add-response/:id", addFormResponse)
    .get("/get-response", getFormResponse)




module.exports = Router
