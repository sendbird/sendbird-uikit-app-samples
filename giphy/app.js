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
  const channelUrl = req.body.channelUrl;
  if (!channelUrl) {
    return res.status(400).send("channel url must be supplied");
  }

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

  //req.body.params;
  let searchedInput = "congratulations"
  const giphyResults = await giphy.fetchSearchResults(searchedInput);
  let giphySelected = await giphy.selectGiphy(giphyResults);
  finalGiphy = giphySelected;
  const appMessage = sendbird.constructMarkdownAppWithButton(
    // req.body.params.commandInput,
    searchedInput,
    giphySelected
  );

  const [sendResponse, sendError] = await sendbird
    .sendUserMessage(
      appMessage,
      req.body.channelUrl,
      // req.body.params.commandInput
      searchedInput
    )

  if (sendError) {
    console.log(sendError);
    return res.status(500).send("failed to send");
  }
  
  return res.sendStatus(200);
});


app.get("/status", (req, res) => {
  res.send(200);
});

module.exports = app;
