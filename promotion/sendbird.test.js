const Sendbird = require('./sendbird');
const nockBack = require('nock').back
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('dryrun');

describe('sendbird', () => {
    it('create a promo message', () => {
        const mockMessage = "use this text when creating markdown app message";
        const sendbird = new Sendbird();
        const appData = sendbird.constructMarkdownAppWithButton(mockMessage);
        expect(appData).toEqual(`# App Message \n **${mockMessage}** [button:Confirm]()`)
    });


    it('send bot message with markdown data to channel', async () => {
        const { nockDone, context } = await nockBack('send-user-message.json');

        const mockChannelUrl = "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7";
        const mockAppData = "**this is some bold text** [button:shuffle]()";
        const mockUserId = "sendbird";
        const message = "cat";

        const sendbird = new Sendbird();
        await sendbird.sendUserMessage(mockAppData, mockUserId, mockChannelUrl, message);
        nockDone();
    });

});