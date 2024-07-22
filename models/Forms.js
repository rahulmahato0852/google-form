const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    hero: {
        type: String
    },

}, {
    timestamps: true
})


module.exports = mongoose.model("forms", formSchema)