const Sendbird = require('./sendbird');
const nockBack = require('nock').back
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('dryrun');

describe('sendbird', () => {
    it('create a promo message', () => {
        const mockMessage = "use this text when creating markdown app message";
        const sendbird = new Sendbird();
        const appData = sendbird.constructMarkdownPromotionalMessage(mockMessage);
        expect(appData).toEqual(`![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)
        Renew today and get 20% off annual subscription! That's free for 2 months.  
        [button: renew]()`)
    });


    it('sends a bot message', async () => {
        const { nockDone, context } = await nockBack('send-bot-message.json');
        const channel_url = "promotion-b8a4ef7e-7b62-46f0-81a7-0592c2b1a95e";
        const markdown = "yo";
        const sendbird = new Sendbird();
        const [response, error] = await sendbird.sendBotMessage(markdown, channel_url);

        expect(response.message).toBeDefined();
        nockDone();
    });

    it('joins channel as bot', async () => {
        const { nockDone, context } = await nockBack('bot-join-channel.json');
        const channel_url = "promotion-b8a4ef7e-7b62-46f0-81a7-0592c2b1a95e";
        const sendbird = new Sendbird();
        const [response, error] = await sendbird.botJoinChannel(channel_url);
        expect(response.channels[0].channel_url).toEqual(channel_url);
        nockDone();
    });

    it.only('send user message with markdown data to channel', async () => {
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