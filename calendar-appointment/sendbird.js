const SendbirdPlatformSdk = require('sendbird-platform-sdk');
require('dotenv').config();

const botApi = new SendbirdPlatformSdk.BotApi();
botApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const messageApi = new SendbirdPlatformSdk.MessageApi();
messageApi.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

const gcChannelInstance = new SendbirdPlatformSdk.GroupChannelApi();
gcChannelInstance.apiClient.basePath = `https://api-${process.env.APP_ID}.sendbird.com`;

class Sendbird {
    constructMarkdownCalendarSuccessMessage() {
        const calendarConfirmationMarkdown = `
|   |   |   |   
| - | - | - |
## You've been invited:
**Platform Analytics Office Hours**
[Click to view appointmnent](https://sendbird.com)
**When:** Sun, 10:45 am - 11:45 am
**Where:** SF500-10F 
**Guests:** James Robertson (organizer)
***
**Going?**
&nbsp;
[button:Yes](id=1) [button:No](id=2) [button:Maybe](id=3) 
        `;
        return calendarConfirmationMarkdown;
    }

    constructMarkdownConfirmationYesMessage() {
        const confirmationMarkdown = `#### You have confirmed your attendance`;
        return confirmationMarkdown;
    }

    constructMarkdownConfirmationNoMessage() {
        const confirmationMarkdown = `#### You have declined your attendance`;
        return confirmationMarkdown;
    }

    async sendUserMessage(markdownAppData, channelUrl) {
        let apiToken = process.env.API_TOKEN;

        // bot needs to exist https://www.postman.com/sendbird/workspace/sendbird-platform-api/request/19408238-62360d3f-07f7-40ac-b2d0-13cd6b1591ea;
        let userMessageData = new SendbirdPlatformSdk.SendMessageData();
        let appData = {
            "sb_app": {
                "name": "calendar-appointment",
                "ui": markdownAppData
            }
        }
        let channelType = 'group_channels';
        userMessageData.message = "Calendar message";
        userMessageData.user_id = "calendar";
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
        gcInviteAsMembersData.user_ids = ["calendar"];
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