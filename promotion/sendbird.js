const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

let botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

let messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownPromotionalMessage() {
        return `![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)
        Renew today and get 20% off annual subscription! That's free for 2 months.
        [:button renew]()`;
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

}

module.exports = Sendbird;