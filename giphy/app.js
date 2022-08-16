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

app.post("/giphy-app", async (req, res) => {
  if (req.body.trigger === "command") {
    let searchedInput = req.body.params;
    const giphyResults = await giphy.fetchSearchResults(searchedInput);
    let giphySelected = await giphy.selectGiphy(giphyResults);
    finalGiphy = giphySelected;
    const markdownAppData = sendbird.constructMarkdownAppWithButton(
      req.body.params.commandInput,
      giphySelected
    );
    await sendbird.sendUserMessage(
      markdownAppData,
      req.body.userId,
      req.body.channelUrl,
      req.body.params.commandInput
    );
    return res.sendStatus(200);
  }

  if (req.body.trigger === "button" && req.body.params.buttonId === "1") {
    const markdownAppData = sendbird.constructMarkdownAppWithoutButton(
      req.body.message,
      finalGiphy
    );
    await sendbird.sendGiphyMessage(
      markdownAppData,
      req.body.userId,
      req.body.channelUrl,
      req.body.message
    );
    return res.sendStatus(200);
  }

  if (req.body.trigger === "button" && req.body.params.buttonId === "2") {
    let searchedInput = req.body.message;
    const giphyResults = await giphy.fetchSearchResults(searchedInput);
    let giphySelected = await giphy.selectGiphy(giphyResults);

    finalGiphy = giphySelected;
    const markdownAppData = sendbird.constructMarkdownAppWithButton(
      req.body.message,
      giphySelected
    );
    await sendbird.updateUserMessage(
      markdownAppData,
      req.body.messageId,
      req.body.channelUrl,
      req.body.message
    );
    return res.sendStatus(200);
  }

  if (req.body.trigger === "button" && req.body.params.buttonId === "3") {
    await sendbird.deleteUserMessage(req.body.channelUrl, req.body.messageId);
    return res.sendStatus(200);
  }
});

app.get("/status", (req, res) => {
  res.send(200);
});

module.exports = app;
