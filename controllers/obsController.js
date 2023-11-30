const WebSocket = require('ws');
const obs=require('obs-websocket-js')
const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');

exports.OBS = (req, res) => {
    const OBS= new OBSWebSocket()
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        const cert = Buffer.from(process.env.CERT, 'base64').toString('utf8');
        const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf8');
      
        const options = {
            host: req.body.obsUrl,
            port: req.body.obsPort,
            password: req.body.password,
            tls: {
                cert: cert,
                key: privateKey
            }
        };
        const url = `wss://${options.host}:${options.port}`
       
        const wsClient = new WebSocket(url,options);
        try {
            OBS.createConnection(wsClient, options);
            console.log(url)
            res.status(201).send('successfully connected to obs')
          } catch (error) {
            console.error('Error connecting to OBS:', error);
            res.status(500).send('Failed to connect to OBS');
          }
    }
}