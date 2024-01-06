const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');
const OBS = new OBSWebSocket()



exports.OBS = async (req, res) => {
    let obsDomain
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {

        try {
            obsDomain = req.body["obsPort/Domain"].toString()
            OBS.createConnection(`wss://${obsDomain}`).then((result) => {
                obsAuth = result
                console.log(result)
                OBS.connect(`wss://${obsDomain}`, req.body.password.toString(), result).then((response) => {
                    OBS.call('GetRecordDirectory').then((response) => {
                        res.status(201).send(response)
                    }).catch((error) => {
                        console.log(error)
                    })
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            });
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
        console.log(data);

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