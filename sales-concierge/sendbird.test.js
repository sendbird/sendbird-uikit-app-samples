const Sendbird = require('./sendbird');
const nockBack = require('nock').back
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('record');

describe('sendbird', () => {
    it('create a sales message', () => {
        const mockMessage = "use this text when creating markdown app message";
        const sendbird = new Sendbird();
        const appData = sendbird.constructMarkdownSalesMessage(mockMessage);
        expect(appData).toEqual(`#### Hey! I wanted to let you know we have some new birthday boxes about to be released that you can easily send to friends. \n #### Let me know if you want to preorder any today because we expect them to go fast since supplies are limited.`)
    });

    it('send user message with markdown data to channel', async () => {
        const { nockDone, context } = await nockBack('send-user-message.json');

        const channelUrl = "promotion-b8a4ef7e-7b62-46f0-81a7-0592c2b1a95e";
        const appData = "**this is some bold text** [button:shuffle]()";


        const sendbird = new Sendbird();
        const [response, error] = await sendbird.sendUserMessage(appData, channelUrl);
        expect(response.channel_url).toEqual(channelUrl);
        nockDone();
    });

    it('invite user to channel', async () => {
        const { nockDone, context } = await nockBack('user-channel-invite.json');
        const channel_url = "promotion-b8a4ef7e-7b62-46f0-81a7-0592c2b1a95e";
        const sendbird = new Sendbird();
        const [response, error] = await sendbird.inviteUserToChannel(channel_url);
        expect(response.channel_url).toEqual(channel_url);
        nockDone();
    });

});