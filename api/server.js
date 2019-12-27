const express = require('express');

const router = require('../Router/router.js');

const server = express();

server.get('/', (req, res) => {
    res.send(`Server is working`)
})

server.use('/api/posts', router);

module.exports = server;