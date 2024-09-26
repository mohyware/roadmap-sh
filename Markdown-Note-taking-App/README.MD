# Markdown Note-taking App
![screenshot1](./screenshot/Screenshot(1).png)
![screenshot2](./screenshot/Screenshot(2).png)

## Overview
This project provides an API that allows users to upload, process, and manage markdown files. The API supports file uploads, grammar checking, saving notes in markdown format, and rendering markdown into HTML. A basic frontend is included to test the core functionality.

## How to run this project
1. Clone this repository
2. Run `npm install`
3. Create a `.env` file and add the following:
```
PORT=4000
MONGO_URI=YOUR_MONGO_URI
LANGUAGE_TOOL_API=https://api.languagetool.org/v2/check
```
4. Run `node app`
5. Test the API using Postman or any API testing tool

## API Endpoints
### Upload Routes
POST /upload:

    Upload a markdown file via multipart/form-data.
POST /save:

    Save a markdown note as md file.

### Download Routes
GET /download:

    Get a list of all saved files.
GET /download/:fileId:

    Download a specific file by its ID.

### File Management Routes
GET /render/:fileId:

    Render a markdown file as HTML.

DELETE /:fileId:

    Delete a specific file by its ID.

GET /check/:fileId:

    Check the grammar of a markdown file.
## Project Url
https://roadmap.sh/projects/markdown-note-taking-app