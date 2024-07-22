const { Router } = require("express");
const { addForm, getForm, getFormDetails, updateForm, getResponses } = require("../controller/form-control");
const { uploadImg } = require("../utils/upload-img");
const x = Router()

x
    .post("/add-form", addForm)
    .get("/fetch-responses/:id", getResponses)
    .get("/get-allForms", getForm)
    .get("/get-form-details/:id", getFormDetails)
    .put("/update-form", updateForm)



module.exports = x