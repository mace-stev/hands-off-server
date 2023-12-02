
const obs=require('obs-websocket-js')
const jwt = require('jsonwebtoken');
const { default: OBSWebSocket } = require('obs-websocket-js');

exports.OBS = (req, res) => {
    const OBS= new OBSWebSocket()
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
        const cert = Buffer.from(process.env.CERT, 'base64').toString('utf8');
        const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf8');
      
        const options = {
            host: 'localhost',
            port: req.body.obsPort.toString(),
            password: req.body.password.toString(),
            tls: {
                cert: cert,
                key: privateKey
            }
        };
        const url = `wss://${options.host}:${options.port.toString()}`
       
       
        try {
            OBS.createConnection(url, options).then((response)=>{
              
                res.status(201).send({response:response, completeUrl: url})
                OBS.disconnect()
            }).catch((error)=>{
                console.log(error)
            });
          } catch (error) {
            console.error('Error connecting to OBS:', error);
            res.status(500).send('Failed to connect to OBS');
          }
    }
}