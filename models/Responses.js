const mongoose = require('mongoose')


const responseSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    formId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'forms'
    },
    answers: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'answers'
    }

}, {
    timestamps: true
})



module.exports = mongoose.model('responses', responseSchema)

