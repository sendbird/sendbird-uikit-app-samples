const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownSupportMessage() {
        return `### Are you a new or existing customer: [button:New](id=1) [button:Existing](id=2)`;
    }

    constructMarkdownEndMessage() {
        return `### End Conversation [button:End](id=3)`;
    }

    constructMarkdownRatingMessage() {
        return `### How would you rate your support experience: [button:Good]() [button:Bad]()`;
    }

    constructMarkdownThankYouMessage() {
        return `### Thank you for your feedback!`;
    }

    async sendUserMessage(markdownAppData, channelUrl) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        let appData = {
            "sb_app": {
                "name": "support-agent",
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message = "Support agent message";
        userMessageData.user_id = "agent";
        userMessageData.messageType = 'MESG';
        userMessageData.data = JSON.stringify(appData);
        userMessageData.channel_url = channelUrl;
        let opts = {
            'sendMessageData': userMessageData
        };

        try {
            const response = await messageApi.sendMessage(apiToken, channelType, channelUrl, opts);
            return [response, null];
        } catch (error) {
            console.log(error);
            console.log('failed to send user message');
            return [null, error];
        }
    }

  async updateUserMessage(markdownAppData, messageId, channelUrl, message) {
    const apiToken = process.env.API_TOKEN;
    const updateMessageByIdData =
      new SendbirdPlatformSdk.UpdateMessageByIdData();
    const channelType = "group_channels";
    let appData = {
      "sb_app": {
        "name": "support-agent",
        "ui": markdownAppData,
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

    async inviteUserToChannel(channelUrl) {
        const gcInviteAsMembersData = new SendbirdPlatformSdk.GcInviteAsMembersData();
        gcInviteAsMembersData.channel_url = channelUrl;
        gcInviteAsMembersData.user_ids = ["agent"];
        const opts = {
            'gcInviteAsMembersData': gcInviteAsMembersData
        };
        try {
            const response = await gcChannelInstance.gcInviteAsMembers(process.env.API_TOKEN, channelUrl, opts)
            return [response, null];
        } catch (error) {
            [null, error];
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