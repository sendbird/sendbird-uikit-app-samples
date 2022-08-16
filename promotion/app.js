const express = require('express');
const Sendbird = require('./sendbird');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const sendbird = new Sendbird();

app.post('/promotion-app', async (req, res) => {



});

// begin user journey. In a real world application these messages would be triggered by a customers existing backend system.
app.post('/start', async (req, res) => {
    // construct markdown message
    // create bot
    // join channel
    // send message
    console.log(req.body);
    const appMessage = sendbird.constructMarkdownPromotionalMessage();
    await sendbird.sendBotMessage();
    return res.sendStatus(200);


});

// just for local testing purposes
app.get('/status', (req, res) => {
    res.send(200);
});

module.exports = app;