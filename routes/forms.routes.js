const { Router } = require("express");
const { addForm, getForm, getFormDetails, updateForm, getResponses, deleteForm } = require("../controller/form-control");
const { uploadImg } = require("../utils/upload-img");
const x = Router()

x
    .post("/add-form", addForm)
    .delete("/delete-form", deleteForm)
    .get("/fetch-responses/:id", getResponses)
    .get("/get-allForms/:searchVal", getForm)
    .get("/get-form-details/:id", getFormDetails)
    .put("/update-form", updateForm)



module.exports = x