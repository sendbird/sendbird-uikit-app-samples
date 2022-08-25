const express = require("express");
const Sendbird = require("./sendbird");
const Giphy = require("./giphy");
require("dotenv").config();
const cors = require("cors");

const app = express();
const sendbird = new Sendbird();
const giphy = new Giphy();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
let finalGiphy;

app.post("/app", async (req, res) => {
  if (req.body.trigger === "command") {
    let searchedInput = req.body.params;
    const giphyResults = await giphy.fetchSearchResults(searchedInput);

    let giphySelected = await giphy.selectGiphy(giphyResults);
    finalGiphy = giphySelected;
    const appMessage = sendbird.constructMarkdownAppWithButton(
      req.body.params.commandInput,
      giphySelected
    );

    await sendbird
      .sendUserMessage(
        appMessage,
        req.body.userId,
        req.body.channelUrl,
        req.body.params.commandInput
      )
      .catch((err) => console.log("sendUserMessage error"));

    return res.sendStatus(200);
  }

  const channelUrl = req.body.channelUrl;
  if (!channelUrl) {
    return res.status(400).send("channel url must be supplied");
  }

  console.log("THE ID=", req.body.params.buttonId);
  if (req.body.trigger === "button" && req.body.params.buttonId === "Send") {
    const markdownAppData = sendbird.constructMarkdownAppWithoutButton(
      req.body.message,
      finalGiphy
    );
    await sendbird
      .sendGiphyMessage(
        markdownAppData,
        req.body.userId,
        req.body.channelUrl,
        req.body.message
      )
      .catch((err) => console.log("Send message error"));
    return res.sendStatus(200);
  }

  if (req.body.trigger === "button" && req.body.params.buttonId === "Shuffle") {
    let searchedInput = req.body.message;
    console.log("SEARCHED INPUT=", req.body.message);
    const giphyResults = await giphy.fetchSearchResults(searchedInput);
    let giphySelected = await giphy.selectGiphy(giphyResults);
    finalGiphy = giphySelected;
    const markdownAppData = sendbird.constructMarkdownAppWithButton(
      req.body.message,
      giphySelected
    );
    await sendbird
      .updateUserMessage(
        markdownAppData,
        req.body.messageId,
        req.body.channelUrl,
        req.body.message
      )
      .catch((err) => console.log("Update message error"));
    return res.sendStatus(200);
  }

  if (req.body.trigger === "button" && req.body.params.buttonId === "Cancel") {
    await sendbird
      .deleteUserMessage(req.body.channelUrl, req.body.messageId)
      .catch((err) => console.log("Cancel button error"));
    return res.sendStatus(200);
  }
});

app.get("/status", (req, res) => {
  res.send(200);
});

module.exports = app;
