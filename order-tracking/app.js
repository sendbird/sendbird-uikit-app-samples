const express = require("express");
const Sendbird = require("./sendbird");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

const sendbird = new Sendbird();

// app functionality lives here. This endpoint listens for all app interaction e.g. slash commands and app button clicks
app.post("/app", async (req, res) => {
  if(req.body.trigger === 'button'){
  const appMessage = sendbird.constructMarkdownThankYouMessage();
  const [sendResponse2, sendError2] = await sendbird.updateUserMessage(
    appMessage,
    req.body.messageId,
    req.body.channelUrl,
    req.body.message
  );
  if (error) {
    console.log(error);
    return res.status(400).send("failed to send confirmation message");
  }
  return res.sendStatus(200);
}
});

app.post("/start", async (req, res) => {
  const channelUrl = req.body.channelUrl;
  if (!channelUrl) {
    return res.status(400).send("channel url must be supplied");
  }
  const [joinResponse, joinError] = await sendbird.inviteUserToChannel(
    channelUrl
  );
  if (joinError) {
    console.log(joinError);
    return res.status(500).send("failed to join");
  }

  const appMessage = sendbird.constructMarkdownOrderReceiptMessage();
  const [sendResponse, sendError] = await sendbird.sendUserMessage(
    appMessage,
    channelUrl
  );
  if (sendError) {
    console.log(sendError);
    return res.status(500).send("failed to send");
  }
  
  setTimeout(async (req, res) =>  {
    const appMessage = sendbird.constructMarkdownOrderCompleteMessage();
    const [sendResponse, sendError] = await sendbird.sendUserMessage(
      appMessage,
      channelUrl
    );
    if (sendError) {
      console.log(sendError);
      return res.status(500).send("failed to send");
    }
  }, 4000);

  setTimeout(async (req, res) => {
    const appMessage = sendbird.constructMarkdownSuccessfulDeliveryMessage();
    const [sendResponse, sendError] = await sendbird.sendUserMessage(
      appMessage,
      channelUrl
    );
    if (sendError) {
      console.log(sendError);
      return res.status(500).send("failed to send");
    }
  
  }, 8000);

  setTimeout(async (req, res) =>  {
    const appMessage = sendbird.constructMarkdownRatingMessage();
    const [sendResponse, sendError] = await sendbird.sendUserMessage(
      appMessage,
      channelUrl
    );
    if (sendError) {
      console.log(sendError);
      return res.status(500).send("failed to send");
    }

  }, 12000);
  
  return res.sendStatus(200);
});

app.get("/status", (req, res) => {
  res.send(200);
});

module.exports = app;
