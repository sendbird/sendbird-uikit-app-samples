const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownDeliverySuccessMessage() {
        const orderTrackingMarkdown = `
|   |   |
| - | - |
| ![sushi](https://scout-poc.pages.dev/static/media/sushi.3245adb1.jpg) | **Sushi Son Dinner set-A with coke** |
### Paid with
Visa 5454
&nbsp;
### Ship to
1995 Nassau Dr., Vancouver, BC V5P 3Z2
&nbsp;
***
|    |       |
| :- |    -: |
| Total | # $60 |
        
        `;
        return orderTrackingMarkdown;
        // return `#### Your order has been received. Carla is now preparing your food.`;
    }

    constructMarkdownOrderReceiptMessage() {
        const orderTrackingMarkdown = `
        |   |   |
        | - | - |
        | ![sushi](https://scout-poc.pages.dev/static/media/sushi.3245adb1.jpg) | **Sushi Son Dinner set-A with coke** |
        ### Paid with
        Visa 5454
        &nbsp;
        ### Ship to
        1995 Nassau Dr., Vancouver, BC V5P 3Z2
        &nbsp;
        ***
        |    |       |
        | :- |    -: |
        | Total | # $60 |
        
        `;
        return orderTrackingMarkdown;
    }

    constructMarkdownOrderCompleteMessage() {
        return `#### Your order is now on its way! Should arrive at 6:30pm.`;
    }

    //need drop off image
    constructMarkdownImageDeliveryMessage() {
        return `![alt delivery hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)`;
    }

    constructMarkdownSuccessfulDeliveryMessage() {
        return `#### Thank you for using ShareSend Delivery. Your order has arrived! Jane has dropped it off at the front door.`;
    }

    constructMarkdownRatingMessage() {
        return `#### Let us know how we did with your Sushi Son order. How was the delivery: [button:Good]() [button:Bad]()`;
    }

    constructMarkdownThankYouMessage() {
        return `#### Thank you for your feedback!`;
    }

    async sendUserMessage(markdownAppData, channelUrl) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        let appData = {
            "sb_app": {
                "name": "order-tracking",
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message = "ShareSend Delivery message";
        userMessageData.user_id = "tracking";
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
        gcInviteAsMembersData.user_ids = ["tracking"];
        const opts = {
            'gcInviteAsMembersData': gcInviteAsMembersData
        };
        try {
            const response = await gcChannelInstance.gcInviteAsMembers(process.env.API_TOKEN, channelUrl, opts)
            return [response, null];
        } catch (error) {
            return [null, error];
        }
    }

}

module.exports = Sendbird;