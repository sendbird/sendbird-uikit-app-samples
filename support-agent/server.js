const app = require('./app');
const PORT = process.env.PORT || 8289;

app.listen(PORT, () => {
    console.log('chat app now listening on port: ', PORT);
})