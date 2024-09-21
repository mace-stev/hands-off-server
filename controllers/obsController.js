const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');
const OBS = new OBSWebSocket();
const crypto = require('crypto');
const { response } = require('express');



exports.OBS = async (req, res) => {
    let obsDomain
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {

        try {
            const obsDomain = req.body["obsPort/Domain"].toString();
            const websocketPassword = req.body["password"].toString();

           

            OBS.connect(`wss://${obsDomain}`, websocketPassword)
                .then(async (response) => {
                    console.log("Connected to OBS WebSocket server!");

                   res.status(201).send("Connected to OBS WebSocket server!")

                })
        } catch (error) {
            console.error('Error connecting to OBS:', error);
            res.status(500).send('Failed to connect to OBS');
        }
    }
}
exports.streamStatus = async (req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream');

    // ... your logic ...

    const sendEvent = (message) => {
        res.write(message);
    };

    OBS.on('RecordStateChanged', (data) => {

        let message;

        if (data.outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPING') {
            message = `data: streamStopped\r\n\r\n`;
        } else {
            message = `data: ${data.outputPath}\r\n\r\n`;
        }

        sendEvent(message);
    });

    // ... other event logic ...
};