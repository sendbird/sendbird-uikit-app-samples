const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownPurchaseMessage() {
        const purchaseReceiptMarkdown = `
# Order 6593023
|   |   |   |
| - | - | - |
| ![handbag](https://clutchtotebags.com/wp-content/uploads/2018/04/The-Circle-Bag-Clutch-Leather-HandBag-Crossbody-Leather-Bags-for-Women-Shoulder-bag-leather-with-circle-handle-zipper-BLACK.jpg) | Black Handbag | **$89.99** |
| ![shoes](https://parade.com/.image/t_share/MTkxNDM4OTM1NDU1NDQyNDY1/sam-edelman-britten-boot.jpg) | Beige Boots | **$45.00** |
### Discount
-$14.99
***
|    |       |
| :- |    -: |
| Total | # $75 |

        `;
        return purchaseReceiptMarkdown;
    }

    async sendUserMessage(markdownAppData, channelUrl) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        const appData = {
            "sb_app": {
                "name": "purchase-receipt",
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message =  "Purchase message";
        userMessageData.user_id = "purchase";
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
        gcInviteAsMembersData.user_ids = ["purchase"];
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