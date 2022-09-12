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
    if (req.body.trigger === 'button' && req.body.params.buttonId === ' Is this still available') {
        await sendbird.deleteUserMessage(req.body.channelUrl, req.body.messageId);
        await sendbird.sendUserMessage("Is this still available?", req.body.channelUrl, req.body.userId);
        setTimeout(async () => {
            await sendbird.sendUserMessage("Hi I'm Matt. Yes this is still available to buy. Can I answer any other questions for you?", req.body.channelUrl, 'matt');
        }, 3000);

        return res.sendStatus(200);
    }

});

// The /start endpoint only exists for demo purposes. In a real world application these messages would be triggered by a customers existing backend system.
app.post('/start', async (req, res) => {
    const channelUrl = req.body.channelUrl;
    const item = req.body.item;
    const user = req.body.user;

    if (!channelUrl) {
        return res.status(400).send('channel url must be supplied');

    }
    const [joinResponse, joinError] = await sendbird.inviteUserToChannel(channelUrl);
    if (joinError) {
        console.log(joinError);
        return res.status(500).send('failed to join');
    }
    const appMessage = sendbird.constructMarkdownMarketPlaceMessage(item);
    const availableMessage = sendbird.constructMarkdownAvailableMessage(item);

    const [sendResponse, sendError] = await sendbird.sendUserMessage(appMessage, channelUrl, 'matt');
    const [sendResponse2, sendError2] = await sendbird.sendUserMessage(availableMessage, channelUrl, user.userId, true);

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