const mongoose = require('mongoose')


const answerSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'forms'
    },


    answers: [{

        answers: [{
            type: String,
            required: true
        }],
        questionId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'questions'
        },
    }]



}, {
    timestamps: true
})



module.exports = mongoose.model('answers', answerSchema)



