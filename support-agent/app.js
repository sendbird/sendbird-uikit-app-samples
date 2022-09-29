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
    console.log('params=', req.body.params)
    if (req.body.trigger === 'button' && req.body.params.buttonId === "New" ||req.body.params.buttonId === "Existing") {
        //Save this new/existing info for later?
        await sendbird
        .deleteUserMessage(req.body.channelUrl, req.body.messageId)
        .catch((err) => console.log("Cancel button error"));

        const agentFirstMessage = "Hi Michelle. Can you please provide your order number?"
        const [sendResponse1, sendError1] = await sendbird.sendUserMessage(agentFirstMessage, req.body.channelUrl);

        const endMessage = sendbird.constructMarkdownEndMessage();
        const [sendResponse2, sendError2] = await sendbird.sendUserMessage(endMessage, req.body.channelUrl);
        return res.sendStatus(200);
    }

    if(req.body.trigger === 'button' && req.body.params.buttonId === "End Conversation"){
        const deleteEndConvoMessage =  await sendbird
        .deleteUserMessage(req.body.channelUrl, req.body.messageId)
        .catch((err) => console.log("Cancel button error"));

        const ratingMarkdown = sendbird.constructMarkdownRatingMessage();
        const [sendResponse2, sendError2] = await sendbird.sendUserMessage(ratingMarkdown, req.body.channelUrl);
        if (error) {
            console.log(error)
            return res.status(400).send('failed to send confirmation message');
        }
        return res.sendStatus(200);
    }

    if(req.body.trigger === 'button' && req.body.params.buttonId === " 👍 Good" || req.body.params.buttonId === " 👎 Bad" ){
        const thankYouMessage = 'Thank you for your feedback!'
        const [sendResponse2, sendError2] = await sendbird.updateUserMessage(thankYouMessage, req.body.messageId, req.body.channelUrl, req.body.message);
        if (error) {
            console.log(error)
            return res.status(400).send('failed to send confirmation message');
        }
        return res.sendStatus(200);
    }
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
});

// just for local testing purposes
app.get('/status', (req, res) => {
    res.send(200);
});

module.exports = app;