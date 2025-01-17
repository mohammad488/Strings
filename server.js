require('dotenv').config({ path: './.env' });
const express = require('express');
const serverless = require('serverless-http');
const { Server: SocketServer } = require('socket.io');
const http = require('http');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const db = require('./db/connect');
const cloudinary = require('./middleware/cloudinary');
const ServerlessHttp = require('serverless-http');

const app = express();
const server = http.createServer(app);

// middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    limit: '10mb',
    parameterLimit: 100000,
    extended: false,
  })
);

cloudinary();
db();

app.use('/.netlify/functions/server/api', routes);

if (!config.isDev) {
  app.get('*', (req, res) => res.send(req.url));
}

// store socket on global object
global.io = new SocketServer(server, { cors: config.cors, path: "/.netlify/functions/server/socket.io" });
require('./socket');


module.exports = server;
module.exports.handler = serverless(server);