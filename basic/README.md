# Chat App Example

An easy to understand Sendbird chat app example.

There is no functionlity in this repo. It should be considered a starting point with which to build helpful applications.

## How it works
 - POST endpoint listening for slash commands e.g. /command {input}
 - Any command received uses the input paramter to construct a simple markdown app.
 - Message is posted back to original channel with markdown app attached to message.data