const mongoose = require("mongoose");
// const user = require("./user");
const jobSchema = new mongoose.Schema({

    jobid: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    recruitorId: {
        type: String,
        trim: true,
    },
    recruitorName: {
        type: String,
        trim: true,
    },
    applicants: [{
        type: String,
        trim: true,
    }],
    currentApplications: {
        type: Number,
        default: '0',
    },
    remainingApplications: {
        type: Number,
        default: '0',
    },
    currentPositions: {
        type: Number,
        default: '0',
    },
    remainingPositions: {
        type: Number,
        default: '0',
    },
    maxApplications: {
        type: Number,
        default: '0',
    },
    maxPositions: {
        type: Number,
        default: '0',

    },
    dateOfPosting: {
        type: Date,
        // default: Date.now,
    },
    deadline: {
        type: Date,
    },
    requiredSkills: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        default: 6,
    },
    salary: {
        type: Number,
        default: '0',
    },
    rating: {
        type: Number,
        default: '0',
    },
    countRating: {
        type: Number,
        default: '0',
    },
    

});


module.exports = mongoose.model("Job", jobSchema);