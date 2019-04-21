var express = require("express");
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');
const app = express();
const fs = require('fs');
const Guid = require('guid');
const bodyParser = require("body-parser");
var auth = require('http-auth')
const v1 = require('../routes/v1')
const dotenv = require('dotenv').config()
const MSSQL = require('../connection/test')
const sio = require('socket.io')
const server = require('http').Server(app)
const path = require('path')


var basic = auth.basic({
    realm: 'Simon Area.',
    file: path.join(__dirname, '../.htpasswd')
})

const swaggerJSDoc = require('swagger-jsdoc')
const options = {
    definition: {
        info: {
            title: 'Swagger API',
            version: '0.5.0'
        }
    },
    apis: [
        '../routes/v1.js'
    ]
}
const swaggerSpec = swaggerJSDoc(options)

swaggerSpec.securityDefinitions = {
    Token: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
    }
}

swaggerSpec.security = [
    { Token: [] }
]
const swaggerUi = require('swagger-ui-express')

app.get('/api-docs.json', auth.connect(basic), function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})
app.use(
    '/api-docs',
    auth.connect(basic),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})
//end
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set("views", "./views");
app.get('/', (req, res) => {
    res.sendStatus(200)
})
app.get('/sendmessage', (req, res) => {
    res.render('sendmessage')
})
app.get('/receivemessage', (req, res) => {
    res.render('receivemessage')
})
// app.use("/", (req, res, next) => {
//     console.log("resquest url: ", req.url);
//     req.requestTime = new Date();

//     //mongo
//     ///Create obj

//     //end
//     next();
// });
// MSSQL.connect();
MSSQL.connectioSSQl();

const io = sio.listen(server)
require('../services/socket')(io)
////

v1.setup(app)

// apiController(app);
// homeController(app);
// userController(app);
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3003)
server.listen(app.get('port'), () => {
    console.log('\n     Server is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    )
    console.log('     Press CTRL-C to stop\n')
})
module.exports = app
