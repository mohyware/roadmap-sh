const express = require('express');
const router = express.Router();
const {
    uploadFile,
    getFile,
    upload,
    getAllFile,
    checkFile,
    renderMarkdownAsHtml,
    deleteFile,
    SaveFile
} = require('../controllers/upload-controller');


// Upload routes
router.post('/upload', upload.single('file'), uploadFile);
router.post('/save', SaveFile);
// Download routes
router.get('/download/', getAllFile);
router.get('/download/:fileId', getFile);
// File management routes
router.delete('/:fileId', deleteFile);
router.get('/render/:fileId', renderMarkdownAsHtml);
router.get('/check/:fileId', checkFile);



module.exports = router;