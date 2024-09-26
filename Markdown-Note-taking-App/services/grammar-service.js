const axios = require('axios');

const LANGUAGE_TOOL_API = process.env.LANGUAGE_TOOL_API;

async function checkGrammar(mdContent) {
    try {
        const response = await axios.post(LANGUAGE_TOOL_API, null, {
            params: {
                text: mdContent,
                language: 'en-US',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error checking grammar');
    }
}

module.exports = { checkGrammar };