const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    length: { type: Number, required: true },
    id: mongoose.Schema.Types.ObjectId,  // The ID generated by GridFS
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
