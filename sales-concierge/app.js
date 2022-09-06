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
    if (req.body.trigger === 'button' && req.body.params.buttonId === 'Select ') {
        const markdownAppData = sendbird.constructMarkdownConfirmPreOrder("Gold");
        const appData = {
            "sb_app": {
                "name": "concierge",
                "ui": markdownAppData
            }
        }
        const [response, error] = await sendbird.sendUserMessage(appData, "pre order", req.body.channelUrl);
        if (error) {
            console.log(error)
            return res.status(400).send('failed to send confirmation message');
        }
        return res.sendStatus(200);
    }

    if (req.body.trigger === 'button' && req.body.params.buttonId === 'Select') {
        const markdownAppData = sendbird.constructMarkdownConfirmPreOrder("Silver");
        const appData = {
            "sb_app": {
                "name": "concierge",
                "ui": markdownAppData
            }
        }
        const [response, error] = await sendbird.sendUserMessage(appData, "pre order", req.body.channelUrl);
        if (error) {
            console.log(error)
            return res.status(400).send('failed to send confirmation message');
        }
        return res.sendStatus(200);
    }

    if (req.body.trigger === 'button' && req.body.params.buttonId === 'Pre-order') {
        const successMessage = "Thanks Alex! Your friend is going to absolutely love this Sendtreat. Your option to purchase will show up on your account in a few minutes. You will have the option to split the cost with friends.";
        const [response, error] = await sendbird.sendUserMessage(null, successMessage, req.body.channelUrl);
        if (error) {
            console.log(error)
            return res.status(400).send('failed to send confirmation message');
        }
        return res.sendStatus(200);
    }

    res.status(400).send('no action');
});

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

    const introMessage = "Hey Alex. I would recommend one of these options. Vote on which one you’d like to send. You can also split the cost with friends in ShareSend.";
    const [sendIntoResponse, sendIntroError] = await sendbird.sendUserMessage(null, introMessage, channelUrl);

    const markdownAppData = sendbird.constructMarkdownSalesMessage();
    const appData = {
        "sb_app": {
            "name": "concierge",
            "ui": markdownAppData
        }
    }
    const [sendResponse, sendError] = await sendbird.sendUserMessage(appData, "Sales concierge message", channelUrl);
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