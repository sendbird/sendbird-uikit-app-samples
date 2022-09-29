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
  if (req.body.trigger === "button" && req.body.params.buttonId === "Yes") {
    const markdownAppData = sendbird.constructMarkdownConfirmationYesMessage();
    await sendbird
      .sendUserMessage(
        markdownAppData,
        req.body.channelUrl,
      )
      .catch((err) => console.log("Send message error"));
    return res.sendStatus(200);
  }
  if (req.body.trigger === "button" && req.body.params.buttonId === "No") {
    const markdownAppData = sendbird.constructMarkdownConfirmationNoMessage();
    await sendbird
      .sendUserMessage(
        markdownAppData,
        req.body.channelUrl,
      )
      .catch((err) => console.log("Send message error"));
    return res.sendStatus(200);
  }
});

app.post("/start", async (req, res) => {
  const channelUrl = req.body.channelUrl;
  if (!channelUrl) {
    return res.status(400).send("channel url must be supplied");
  }
  const [joinResponse, joinError] = await sendbird.inviteUserToChannel(channelUrl);
  if (joinError) {
    console.log(joinError);
    return res.status(500).send("failed to join");
  }
  const appMessage = sendbird.constructMarkdownCalendarSuccessMessage();
  const [sendResponse, sendError] = await sendbird.sendUserMessage(appMessage, channelUrl);
  if (sendError) {
    console.log(sendError);
    return res.status(500).send("failed to send");
  }
  return res.sendStatus(200);
});

// just for local testing purposes
app.get("/status", (req, res) => {
  res.send(200);
});

module.exports = app;
