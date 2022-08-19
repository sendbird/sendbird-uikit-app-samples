const express = require('express');
const Sendbird = require('./sendbird');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const sendbird = new Sendbird();

// app functionality lives here. This endpoint listens for all app interaction e.g. slash commands and app button clicks
app.post('/app', async (req, res) => {
    //listen for button message
    // push out success


});

// The /start endpoint only exists for demo purposes. In a real world application these messages would be triggered by a customers existing backend system.
app.post('/start', async (req, res) => {
    const channelUrl = req.body.channelUrl;

    if (!channelUrl) {
        return res.status(400).send('channel url must be supplied');

    }
    const [joinResponse, joinError] = await sendbird.inviteUserToChannel(channelUrl);
    if (joinError) {
        console.log(joinError);
        return res.status(500).send('failed to join');
    }
    const appMessage = sendbird.constructMarkdownSupportMessage();
    const [sendResponse, sendError] = await sendbird.sendUserMessage(appMessage, channelUrl);
    if (sendError) {
        console.log(sendError);
        return res.status(500).send('failed to send');
    }
    return res.sendStatus(200);

    //on click of end message, send rating message

    //on click of rating button, send thank you message

});

// just for local testing purposes
app.get('/status', (req, res) => {
    res.send(200);
});

module.exports = app;