const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide title'],
            maxlength: 50,
        },
        description: {
            type: String,
            required: [true, 'Please provide description'],
            maxlength: 100,
        },
        status: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Task', TaskSchema)

