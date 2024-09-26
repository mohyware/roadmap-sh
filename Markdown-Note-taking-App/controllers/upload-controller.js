const mongoose = require('mongoose');
const { Readable } = require('stream');
const multer = require('multer');
const path = require('path');
const File = require('../models/file-model');
const { getBucket } = require('../db/connect');
const { checkGrammar } = require('../services/grammar-service');
const { marked } = require('marked');
const { BadRequestError, NotFoundError } = require('../errors')
const storage = multer.memoryStorage()
const upload = multer({ storage })


const renderMarkdownAsHtml = async (req, res, next) => {
    const bucket = getBucket();
    const { fileId } = req.params;
    try {

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            throw new BadRequestError(`Invalid file id: ${fileId}`);
        }

        const file = await File.findOne({
            id: fileId
        })

        if (!file) {
            throw new NotFoundError(`No File with id ${fileId}`)
        }

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));


        let fileData = '';

        downloadStream.on('data', (chunk) => {
            fileData += chunk.toString();
        });

        downloadStream.on('error', (err) => {
            console.error('Error downloading file:', err);
            return res.status(500).send('Error downloading file');
        });

        downloadStream.on('end', () => {
            const htmlContent = marked(fileData);
            return res.status(200).send(htmlContent);
        });
    } catch (error) {
        next(error);
    }
};
const SaveFile = async (req, res, next) => {
    const { Title, Body } = req.body;
    try {

        if (!(Title && Body)) {
            throw new BadRequestError('Title and Body are required.');
        }

        const markdownContent = `# ${Title}\n\n${Body}`; // Format content as markdown

        const bucket = getBucket();
        const fileName = `${Title}.md`;

        let newFile = new File({
            filename: fileName,
            contentType: 'text/markdown',
            length: Buffer.byteLength(markdownContent),
        });

        const readBuffer = new Readable();
        readBuffer.push(markdownContent);
        readBuffer.push(null);

        let uploadStream = bucket.openUploadStream(fileName);

        const isUploaded = await new Promise((resolve, reject) => {
            readBuffer.pipe(uploadStream)
                .on("finish", resolve("successfull"))
                .on("error", reject("error occurred while creating stream"));
        });

        newFile.id = uploadStream.id;
        let savedFile = await newFile.save();

        if (!savedFile) {
            throw new NotFoundError('error occurred while saving our work');
        }

        return res.send({ file: savedFile, message: "file uploaded successfully" });
    } catch (err) {
        next(err);
    }
};

const getFile = async (req, res, next) => {

    const bucket = getBucket();

    let { fileId } = req.params
    try {

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            throw new BadRequestError(`Invalid file id: ${fileId}`);
        }

        const file = await File.findOne({
            id: fileId
        })

        if (!file) {
            throw new NotFoundError(`No File with id ${fileId}`)
        }

        let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType)
        })

        downloadStream.pipe(res)
    } catch (err) {
        next(err);
    }
}

const checkFile = async (req, res, next) => {
    const bucket = getBucket();
    const { fileId } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            throw new BadRequestError(`Invalid file id: ${fileId}`);
        }

        const file = await File.findOne({
            id: fileId
        })

        if (!file) {
            throw new NotFoundError(`No File with id ${fileId}`)
        }

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        let fileData = '';

        downloadStream.on('data', (chunk) => {
            fileData += chunk.toString();
        });

        downloadStream.on('error', (err) => {
            throw new Error(`Error downloading file`)
        });

        downloadStream.on('end', async () => {
            try {
                const grammarResult = await checkGrammar(fileData);
                return res.status(200).json({
                    message: 'Grammar check completed.',
                    issues: grammarResult.matches,
                });
            } catch (error) {
                next(error);
            }
        });
    } catch (err) {
        next(err);
    }
}

const getAllFile = async (req, res, next) => {
    try {
        const files = await File.find({});
        if (!files || files.length === 0) {
            throw new NotFoundError(`'No files found.`)
        }
        return res.status(200).json({ files });
    }
    catch (error) {
        next(error)
    }
}

const deleteFile = async (req, res, next) => {
    const bucket = getBucket();
    let { fileId } = req.params

    try {
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            throw new BadRequestError(`Invalid file id: ${fileId}`);
        }

        const Note = await File.findOne({
            id: fileId
        })

        if (!Note) {
            throw new NotFoundError(`No File with id ${fileId}`)
        }
        // delete from fs.chunks and fs.files
        await bucket.delete(new mongoose.Types.ObjectId(fileId))
        // delete from files itself
        await File.findByIdAndDelete({
            _id: Note._id
        })
        res.status(200).send(`file deleted successfully`)
    } catch (err) {
        next(err);
    }
}

// take file as parameter not used in front end
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Check if the file is a markdown file
    const fileType = path.extname(req.file.originalname);
    if (fileType !== '.md') {
        return res.status(400).send('Please upload a markdown (.md) file.');
    }

    const bucket = getBucket();
    let { file } = req
    let { fieldname, originalname, mimetype, buffer } = file

    let newFile = new File({
        filename: file.originalname,
        contentType: mimetype,
        length: buffer.length,
    })

    try {

        const mdContent = buffer.toString('utf-8');
        const grammarResult = await checkGrammar(mdContent);
        let uploadStream = bucket.openUploadStream(fieldname)
        let readBuffer = new Readable()
        readBuffer.push(buffer)
        readBuffer.push(null)


        const isUploaded = await new Promise((resolve, reject) => {
            readBuffer.pipe(uploadStream)
                .on("finish", resolve("successfull"))
                .on("error", reject("error occured while creating stream"))
        })


        newFile.id = uploadStream.id
        let savedFile = await newFile.save()
        if (!savedFile) {
            return res.status(404).send("error occured while saving our work")
        }
        return res.send({ file: savedFile, message: "file uploaded successfully", issues: grammarResult.matches })
    }
    catch (err) {
        res.send("error uploading file")
    }

}

module.exports = {
    uploadFile,
    getAllFile,
    getFile,
    deleteFile,
    checkFile,
    SaveFile,
    renderMarkdownAsHtml,
    upload
};