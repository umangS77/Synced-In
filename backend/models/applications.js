const mongoose = require("mongoose");
// const user = require("./user");
// const job = require("./jobs");
const applicationSchema = new mongoose.Schema({

    applicationId: {
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
    applicantName: {
        type: String,
        trim: true,
    },
    applicantId: {
        type: String,
        trim: true,
    },
    jobId: {
        type: String,
        trim: true,
    },
    status: {
        type : String,
        trim: true,
        default: "none",
    },
    sop: {
        type: String,
        trim: true,
    },
    dateOfApplication: {
        type: Date,
        default: Date.now
    },
    dateOfJoining: {
        type: String,
        default: " "
    },
    stage: {
        type: Number,
        default: 1
    }
});


module.exports = mongoose.model("Application", applicationSchema);