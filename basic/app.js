const express = require('express');
const Sendbird = require('./sendbird');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const sendbird = new Sendbird();

app.post('/basic-chat-app', async (req, res) => {

    if (req.body.trigger === 'command') {
        const markdownAppData = sendbird.constructMarkdownAppWithButton(req.body.params.commandInput);
        await sendbird.sendUserMessage(markdownAppData, req.body.userId, req.body.channelUrl, req.body.params.commandInput);
        return res.sendStatus(200);
    }

    if (req.body.trigger === 'button') {
        console.log(req.body);
        const markdownAppData = sendbird.constructMarkdownAppWithoutButton(req.body.message);
        await sendbird.updateUserMessage(markdownAppData, req.body.messageId, req.body.channelUrl, req.body.message);
        return res.sendStatus(200);
    }


});

// just for local testing purposes
app.get('/status', (req, res) => {
    res.send(200);
});

module.exports = app;