const { Router } = require("express");
const { addForm, getForm, getFormDetails, updateForm, getResponses, deleteForm } = require("../controller/form-control");
const { uploadImg } = require("../utils/upload-img");
const { userProtected } = require("../middleware/userProtected");
const x = Router()

x
    .post("/add-form", userProtected, addForm)
    .delete("/delete-form/:id", userProtected, deleteForm)
    .get("/fetch-responses/:id", getResponses)
    .get("/get-allForms/:searchVal", userProtected, getForm)
    .get("/get-form-details/:id", userProtected, getFormDetails)
    .put("/update-form", updateForm)



module.exports = x