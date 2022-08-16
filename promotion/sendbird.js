const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

let botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

let messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownPromotionalMessage(message) {
        return `![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)
        Renew today and get 20% off annual subscription! That's free for 2 months.
        [:button renew]()`;
    }


    async sendBotMessage(markdownAppData, userId, channelUrl, message) {
        let apiToken = process.env.API_TOKEN;


    }

    async createBot() {

    }

    async botJoinChannel() {

    }

}

module.exports = Sendbird;