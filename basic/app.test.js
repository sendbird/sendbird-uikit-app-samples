const request = require('supertest');
const app = require('./app');
// your jest test file below
const Sendbird = require('./sendbird');

const constructMarkdownAppWithButtonMock = jest
    .spyOn(Sendbird.prototype, 'constructMarkdownAppWithButton')
    .mockImplementation(() => {
        return '**cat**'
    });

const constructMarkdownAppWithoutButton = jest
    .spyOn(Sendbird.prototype, 'constructMarkdownAppWithoutButton')
    .mockImplementation(() => {
        return '**cat**'
    });

const sendUserMessageMock = jest
    .spyOn(Sendbird.prototype, 'sendUserMessage')
    .mockImplementation(() => {
    });

const updateUserMessageMock = jest
    .spyOn(Sendbird.prototype, 'updateUserMessage')
    .mockImplementation(() => {
    });

describe('basic app', () => {

    it('listens for slash command request', async () => {
        const data = {
            params: {
                commandInput: 'cat'
            },
            trigger: 'command',
            channelUrl: 'sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7',
            message: '/echo cat',
            userId: "sendbird",
            accessToken: ""
        }
        await request(app)
            .post('/basic-chat-app')
            .send(data)
            .expect(200);
        expect(constructMarkdownAppWithButtonMock).toHaveBeenCalledWith('cat');
        expect(sendUserMessageMock).toHaveBeenCalledWith("**cat**", "sendbird", "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7", "cat");

    });

    it('listens for button clicks', async () => {
        const data = {
            params: {
                buttonId: '1'
            },
            trigger: 'button',
            channelUrl: 'sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7',
            message: 'cat',
            messageId: '1',
            userId: "sendbird",
            accessToken: ""
        }
        await request(app)
            .post('/basic-chat-app')
            .send(data)
            .expect(200);

        expect(constructMarkdownAppWithoutButton).toHaveBeenCalledWith('cat');
        expect(updateUserMessageMock).toHaveBeenCalledWith("**cat**", "1", "sendbird_group_channel_185112538_8ada9ca637b49b7b793f89f6010c89a4aaa4abc7", "cat");
    });
});