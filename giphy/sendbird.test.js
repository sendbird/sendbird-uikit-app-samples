const Sendbird = require('./sendbird');
const nockBack = require('nock').back
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('update');

describe('sendbird', () => {
    it('send user message with markdown data to channel', async () => {
        const { nockDone, context } = await nockBack('send-user-message.json');

        const mockChannelUrl = "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7";
        const mockAppData = "**this is some bold text**";
        const mockUserId = "sendbird";

        const sendbird = new Sendbird();
        await sendbird.sendUserMessage(mockAppData, mockUserId, mockChannelUrl);
        nockDone();

    });

    it('send bot message with markdown data to channel', async () => {
        const { nockDone, context } = await nockBack('send-bot-message.json');

        const mockChannelUrl = "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7";
        const mockAppData = "**this is some bold text**";
        const sendbird = new Sendbird();
        await sendbird.sendBotMessage(mockAppData, mockChannelUrl);
        nockDone();

    });
})