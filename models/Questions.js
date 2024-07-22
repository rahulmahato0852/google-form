const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },
    mark: {
        type: Number,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],

    answers: [{
        type: String,
        required: true
    }],
    form: {
        type: mongoose.Types.ObjectId,
        ref: "forms",
        required: true
    }

}, {
    timestamps: true
})


module.exports = mongoose.model("questions", questionSchema)