const SendbirdPlatformSdk = require("sendbird-platform-sdk");
require("dotenv").config();

let botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;
let messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;
let apiToken = process.env.API_TOKEN;

class Sendbird {
  constructMarkdownAppWithButton(message, giphy) {
    return `**${message}** \n ![giphy](${giphy.images.downsized_medium.url}) \n [button:Send](id=1) [button:Shuffle](id=2) [button:Cancel](id=3)`;
  }
  constructMarkdownAppWithoutButton(message, giphy) {
    return `${message} \n ![giphy](${giphy.images.downsized_medium.url}) \n `;
  }

  async sendUserMessage(markdownAppData, channelUrl, message) {
    let apiToken = process.env.API_TOKEN;
    // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
    let userMessageData = new SendbirdPlatformSdk.SendMessageData();
    let appData = {
      sb_app: {
        name: "giphy-app",
        //visable to only me
        isDraft: true,
        ui: markdownAppData,
      },
    };
    let channelType = "group_channels";
    userMessageData.message = message;
    userMessageData.user_id = "giphy";
    userMessageData.messageType = "MESG";
    userMessageData.data = JSON.stringify(appData);
    userMessageData.channel_url = channelUrl;
    let opts = {
      sendMessageData: userMessageData,
    };

    try {
      await messageApi.sendMessage(apiToken, channelType, channelUrl, opts);
    } catch (e) {
      console.log(e);
      console.log("failed to send user message");
    }
  }

  async sendGiphyMessage(markdownAppData, userId, channelUrl, message) {
    let apiToken = process.env.API_TOKEN;
    // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
    let userMessageData = new SendbirdPlatformSdk.SendMessageData();
    let appData = {
      sb_app: {
        name: "giphy-app",
        //visable to everyone
        isDraft: false,
        ui: markdownAppData,
      },
    };
    let channelType = "group_channels";
    userMessageData.message = message;
    userMessageData.user_id = "giphy";
    userMessageData.messageType = "MESG";
    userMessageData.data = JSON.stringify(appData);
    userMessageData.channel_url = channelUrl;
    let opts = {
      sendMessageData: userMessageData,
    };

    try {
      await messageApi.sendMessage(apiToken, channelType, channelUrl, opts);
    } catch (e) {
      console.log(e);
      console.log("failed to send user message");
    }
  }

  async updateUserMessage(markdownAppData, messageId, channelUrl, message) {
    const apiToken = process.env.API_TOKEN;
    const updateMessageByIdData =
      new SendbirdPlatformSdk.UpdateMessageByIdData();
    const channelType = "group_channels";
    let appData = {
      sb_app: {
        name: "giphy-app",
        isDraft: true,
        ui: markdownAppData,
      },
    };
    updateMessageByIdData.message = message;
    updateMessageByIdData.message_type = "MESG";
    updateMessageByIdData.data = JSON.stringify(appData);

    let opts = {
      updateMessageByIdData: updateMessageByIdData,
    };

    try {
      await messageApi.updateMessageById(
        apiToken,
        channelType,
        channelUrl,
        messageId,
        opts
      );
    } catch (e) {
      console.log(e);
      console.log("failed to send user message");
    }
  }

  async deleteUserMessage( channelUrl, messageId) {
     let channelType = "group_channels";
    try {
      await messageApi.deleteMessageById(
        apiToken,
        channelType,
        channelUrl,
        messageId
      );
    } catch (e) {
      console.log(e);
      console.log("failed to send user message");
    }
  }
}

module.exports = Sendbird;
