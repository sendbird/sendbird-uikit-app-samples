const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownPromotionalSuccessMessage() {
        return `### 🍾 Thanks!! Renewal Succesful 🍾`;
    }
    constructMarkdownPromotionalMessage() {
        return `![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero) \n #### Renew today and get 20% off annual subscription! That's free for 2 months.\n[button:Renew](id=1)`;
    }

    async sendUserMessage(markdownAppData, channelUrl) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        let appData = {
            "sb_app": {
                "name": "promotion-app",
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message = "promotional message";
        userMessageData.user_id = "promotion";
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


    async sendBotMessage(markdownAppData, channelUrl) {
        const botUserid = process.env.BOT_ID;
        const sendBotSMessageData = new SendbirdPlatformSdk.SendBotSMessageData();
        sendBotSMessageData.channel_url = channelUrl;
        sendBotSMessageData.message = markdownAppData;
        const opts = {
            'sendBotSMessageData': sendBotSMessageData
        };
        try {
            const response = await botApi.sendBotsMessage(process.env.API_TOKEN, botUserid, opts)
            return [response, null];
        } catch (error) {
            return [null, error];
        }


    }

    async botJoinChannel(channelUrl) {


        const botUserid = process.env.BOT_ID;
        const joinChannelsData = new SendbirdPlatformSdk.JoinChannelsData();
        joinChannelsData.channel_urls = [channelUrl];
        const opts = {
            'joinChannelsData': joinChannelsData
        };
        try {
            const response = await botApi.joinChannels(process.env.API_TOKEN, botUserid, opts)
            return [response, null];
        } catch (error) {
            [null, error];
        }
    }

    async inviteUserToChannel(channelUrl) {
        const gcInviteAsMembersData = new SendbirdPlatformSdk.GcInviteAsMembersData();
        gcInviteAsMembersData.channel_url = channelUrl;
        gcInviteAsMembersData.user_ids = ["promotion"];
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

}

module.exports = Sendbird;