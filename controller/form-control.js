const expressAsyncHandler = require("express-async-handler");
const { ValidationNew } = require("../utils/validation");
const validator = require('validator');
const Questions = require("../models/Questions");
const Forms = require("../models/Forms");
const { uploadImg } = require("../utils/upload-img");
const mongoose = require("mongoose");
const Responses = require("../models/Responses");


exports.addForm = expressAsyncHandler(async (req, res) => {
    uploadImg(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || "upload Error" })
        }
        const { name, questions } = req.body
        console.log("Type of questions:", typeof questions);
        console.log("Questions value:", questions);

        let parsedQuestions = [];
        try {
            parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
        } catch (error) {
            return res.status(400).json({ message: error.message || "Invalid questions format" });
        }

        const x = ValidationNew(res, [
            { value: name, keyname: "name", validations: [{ key: "isEmpty", except: false }] },
            // { value: questions, keyname: "questions", validations: [{ key: "isEmpty", except: false }] },
        ])

        if (x) {
            return;
        }

        const AddedForm = await Forms.create({ name, hero: req.file.filename, })
        const updatedQuestion = parsedQuestions.map(item => ({ ...item, form: AddedForm._id, }))
        console.log("iiiiiiiiiiiii", updatedQuestion);
        await Questions.insertMany(updatedQuestion)

        res.status(201).json({ message: "Form Added Successfully" });
    })
})




exports.getForm = expressAsyncHandler(async (req, res) => {

    const { searchVal } = req.params
    console.log(searchVal);

    const result = await Questions.aggregate([
        {
            $group: {
                _id: "$form",
                questions: {
                    $push: {
                        question: "$question",
                        options: "$options",
                        answers: "$answers",
                        type: '$type',
                        _id: '$_id',
                        mark: "$mark"

                    }
                }
            }
        },
        {
            $lookup: {
                from: 'forms',
                localField: "_id",
                foreignField: "_id",
                as: 'formDetails'
            }
        },
        {
            $unwind: "$formDetails"
        },
        {
            $match: {
                'formDetails.name': { $regex: searchVal === "NotTesting" ? "" : searchVal, $options: 'i' }
            }
        },

        {
            $sort: {
                createdAt: 1
            }
        }
    ])
    res.status(200).json({ message: "Form Fetch Success", result })
})


exports.deleteForm = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const x = ValidationNew(res, [
        { keyname: "id", value: id, validations: [{ except: false, key: "isEmpty" }] }
    ])

    if (x) {
        return;
    }

    await Forms.findByIdAndDelete(id)
    res.status(200).json({ message: "Form Drop Success" })
})



exports.getFormDetails = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const objId = new mongoose.Types.ObjectId(id)
    console.log(objId);

    const result = await Questions.aggregate([
        {
            $group: {
                _id: "$form",
                questions: {
                    $push: {
                        question: "$question",
                        options: "$options",
                        answers: "$answers",
                        type: '$type',
                        _id: '$_id',
                        mark: "$mark"
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'forms',
                localField: "_id",
                foreignField: "_id",
                as: 'formDetails'
            }
        },
        {
            $unwind: "$formDetails"
        },
        {
            $match: {
                _id: objId
            }
        },
    ])
    if (!result || result.length !== 1) {
        res.status(400).json({ message: "No record found with this id" })
    } else {
        res.status(200).json({ message: "Form Fetch Success", result: result[0] })
    }
})





exports.updateForm = expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, hero, questions, _id } = req.body
    // await Forms.findByIdAndUpdate(_id, {name})


    questions.forEach(async (item) => {
        const x = await Questions.findByIdAndUpdate(item._id, item, { new: true }).lean()
        questionsArr = [...questions, JSON.stringify(x)]
    });
    res.status(200).json({ message: "Update Form Success" })
})



exports.getResponses = expressAsyncHandler(async (req, res) => {

    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Form Id not found" })
    }
    const fId = new mongoose.Types.ObjectId(id)

    const respon = await Responses.aggregate([
        {
            $match: {
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
        },
    ])
    console.log('ccccccccccccccccccccccc');
    res.status(200).json({ message: "Form Responses fetch success", result: respon })
})