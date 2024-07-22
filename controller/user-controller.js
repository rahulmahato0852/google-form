const expressAsyncHandler = require("express-async-handler");
const Responses = require("../models/Responses");
const Answers = require("../models/Answers");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sednEmail");

exports.addFormResponse = expressAsyncHandler(async (req, res) => {

    const { id: formId } = req.params
    const data = req.body

    const alreduReponsed = await Responses.findOne({ email: data.email, formId })
    if (alreduReponsed) {
        return res.status(200).json({ message: "You are alredy responeded" })
    }


    const answers = data.answers.map(item => ({ questionId: item.questionId, answers: item.answers.filter(f => f) }))
    console.log("--------------");
    console.log(answers);
    console.log("--------------");
    const x = await Answers.create({ formId, answers, })
    await Responses.create({ email: data.email, formId, answers: x._id })
    await sendEmail({ to: data.email, subject: "Exam Submitted successfully", message: "You response is submitted" })
    const fId = new mongoose.Types.ObjectId(formId)
    const respon = await Responses.aggregate([
        {
            $match: {
                email: data.email,
                formId: fId
            }
        },
        {
            $lookup: {
                from: "answers",
                localField: "answers",
                foreignField: "_id",
                as: "answers"
            }
        },
        {
            $lookup: {
                from: "forms",
                localField: "formId",
                foreignField: "_id",
                as: "formId"
            }
        },
        {
            $unwind: "$formId"
        },
        {
            $unwind: "$answers"
        },
        {
            $unwind: "$answers.answers"
        },
        {
            $lookup: {
                from: "questions",
                localField: "answers.answers.questionId",
                foreignField: "_id",
                as: "answers.answers.questionDetail"
            }
        },
        {
            $addFields: {
                "answers.answers.questionDetail": {
                    $arrayElemAt: [
                        "$answers.answers.questionDetail",
                        0
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                email: { $first: "$email" },
                formId: { $first: "$formId" },
                answers: { $push: "$answers" }
            }
        },
        {
            $group: {
                _id: "$_id",
                email: { $first: "$email" },
                formId: { $first: "$formId" },
                answers: {
                    $push: {
                        _id: "$answers._id",
                        formId: "$answers.formId",
                        answers: "$answers.answers"
                    }
                }
            }
        },
        {
            $unwind: "$answers"
        },
        {
            $project: {
                "answers.formId": 0
            }
        }
    ])

    console.log(respon);

    res.status(201).json({ message: "Response Added Success", result: respon[0] })
})



exports.getFormResponse = expressAsyncHandler(async (req, res) => {
    const { email, id } = req.query
    const fId = new mongoose.Types.ObjectId(id)
    console.log(email, fId);

    const respon = await Responses.aggregate([
        {
            $match: {
                email: email,
                formId: fId
            }
        },
        {
            $lookup: {
                from: "answers",
                localField: "answers",
                foreignField: "_id",
                as: "answers"
            }
        },
        {
            $lookup: {
                from: "forms",
                localField: "formId",
                foreignField: "_id",
                as: "formId"
            }
        },
        {
            $unwind: "$formId"
        },
        {
            $unwind: "$answers"
        },
        {
            $unwind: "$answers.answers"
        },
        {
            $lookup: {
                from: "questions",
                localField: "answers.answers.questionId",
                foreignField: "_id",
                as: "answers.answers.questionDetail"
            }
        },
        {
            $addFields: {
                "answers.answers.questionDetail": {
                    $arrayElemAt: [
                        "$answers.answers.questionDetail",
                        0
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                email: { $first: "$email" },
                formId: { $first: "$formId" },
                answers: { $push: "$answers" }
            }
        },
        {
            $group: {
                _id: "$_id",
                email: { $first: "$email" },
                formId: { $first: "$formId" },
                answers: {
                    $push: {
                        _id: "$answers._id",
                        formId: "$answers.formId",
                        answers: "$answers.answers"
                    }
                }
            }
        },
        {
            $unwind: "$answers"
        },
        {
            $project: {
                "answers.formId": 0
            }
        }
    ])
    console.log(respon);
    res.status(200).json({ message: "Response Fetch Success", result: respon[0] })

})