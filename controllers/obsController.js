const { Ngrok } = require('@ngrok/ngrok-api')
const url = require('url')
const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');
const http = require('http')
const OBS = new OBSWebSocket()
const ngrokCli = require('@ngrok/ngrok')
exports.OBS = async (req, res) => {
    let ngrokUrl

    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        const apiToken = process.env.NGROK_APITOKEN
        const ngrok = new Ngrok({ apiToken: apiToken })


        let tunnelAdr
        await ngrokCli.forward({
            addr: `localhost:${req.body.obsPort.toString()}`,
            auth: process.env.NGROK_AUTHTOKEN
        }).then((response) => {
            console.log(response.url().split("/"))
            console.log(`Ngrok tunnel started: ${response.url()}`)
            let store = response.url().split("/");
            ngrokUrl=store[2]
            
        })
        let obsAuth
        try {
            OBS.createConnection(`wss://${ngrokUrl}`).then((result) => {
                obsAuth = result
                OBS.connect(`wss://${ngrokUrl}`, req.body.password.toString(), result).then((response) => {
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

    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        res.setHeader('Content-Type', 'application/json');
        OBS.on('StreamStateChanged', (data) => {
            if (data.outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPING') {
                res.status(201).send({ streamOver: true })
            }
        })
    }
}
