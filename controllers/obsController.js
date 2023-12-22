const { Ngrok } = require('@ngrok/ngrok-api')
const url = require('url')
const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');
const http = require('http')
const OBS = new OBSWebSocket()
const ngrokCli = require('@ngrok/ngrok')


exports.OBS = async (req, res) => {
    let obsDomain
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
       
        try {
            obsDomain=req.body.obsDomain.toString()
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
 
    const reason = `data: {"reason": "User action"}\r\n\r\n`;



    setTimeout(() => {
      
        OBS.on('StreamStateChanged', (data) => {
            let message = `data: ${data.outputState}\r\n\r\n`;
            if(data.outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPING') {
                // Build the event message chunk by chunk
                message = `data: streamStopped\r\n\r\n`;
                res.write(message)
                res.end()
            }else{
            res.write(message)
            res.end()
            }
            

        })
    

    }, 200); // Delay between chunks
    // ... other event logic ...
    ;
};