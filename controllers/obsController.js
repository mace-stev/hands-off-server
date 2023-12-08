const ngrok = require('@ngrok/ngrok')
const url = require('url')
const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');
const http = require('http')
const OBS = new OBSWebSocket()
exports.OBS = async (req, res) => {
    let ngrokUrl

    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        await ngrok.forward({
            addr: 'localhost:4455',
            auth: process.env.NGROK_AUTHTOKEN
        }).then((response) => {
            console.log(response)
            console.log(`Ngrok tunnel started: ${response.url()}`)
            ngrokUrl = response.url();
        })
        const options = {
            host: 'localhost',
            port: req.body.obsPort.toString(),
            password: req.body.password.toString(),
        };
        const url = `ws://${options.host}:${options.port.toString()}`;
        let obsAuth
        try {
            OBS.createConnection(ngrokUrl, options).then((result) => {
                obsAuth = result
                OBS.connect(ngrokUrl, options.password.toString(), result).then((response) => {
                    console.log(response)
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
exports.streamStatus = async(req, res)=>{

    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        res.setHeader('Content-Type', 'application/json');
        OBS.on('StreamStateChanged', (data) => {
            if(data.outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPING') {
             res.status(201).send({streamOver: true})
            }
        })
    }
}
