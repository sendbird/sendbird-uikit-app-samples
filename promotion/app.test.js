const request = require('supertest');
const app = require('./app');
// your jest test file below
const Sendbird = require('./sendbird');

const constructMarkdownPromotionalSuccessMessage = jest
    .spyOn(Sendbird.prototype, 'constructMarkdownPromotionalSuccessMessage')
    .mockImplementation(() => {
        return '**cat**'
    });

const sendUserMessageMock = jest
    .spyOn(Sendbird.prototype, 'sendUserMessage')
    .mockImplementation(() => {
        return [{}, null];
    });


describe('promotion app', () => {


    it('listens for button clicks', async () => {
        const data = {
            params: {
                buttonId: 'renew'
            },
            trigger: 'button',
            channelUrl: 'sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7',
            userId: "sendbird",
            accessToken: ""
        }
        await request(app)
            .post('/app')
            .send(data)
            .expect(200);

        expect(constructMarkdownPromotionalSuccessMessage).toHaveBeenCalled();
        expect(sendUserMessageMock).toHaveBeenCalledWith("**cat**", "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7");
    });
});