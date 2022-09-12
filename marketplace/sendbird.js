const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownMarketPlaceMessage(item) {
        return `![alt marketplace hero image](${item.img}#hero) \n #### ${item.title} \n ## ${item.price}`;
    }

    constructMarkdownAvailableMessage(item) {
        return `\n [button: Is this still available]()`;

    }

    async sendUserMessage(markdownAppData, channelUrl, sender, isDraft = false) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        let appData = {
            "sb_app": {
                "name": "marketplace",
                isDraft,
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message = "Marketplace message";
        userMessageData.user_id = sender;
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

    async inviteUserToChannel(channelUrl) {
        const gcInviteAsMembersData = new SendbirdPlatformSdk.GcInviteAsMembersData();
        gcInviteAsMembersData.channel_url = channelUrl;
        gcInviteAsMembersData.user_ids = ["matt"];
        const opts = {
            'gcInviteAsMembersData': gcInviteAsMembersData
        };
        try {
            const response = await gcChannelInstance.gcInviteAsMembers(process.env.API_TOKEN, channelUrl, opts)
            return [response, null];
        } catch (error) {
            console.log(error);
            [null, error];
        }
    }

    async deleteUserMessage(channelUrl, messageId) {
        let channelType = "group_channels";
        try {
            await messageApi.deleteMessageById(
                process.env.API_TOKEN,
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

