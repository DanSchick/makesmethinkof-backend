var express = require('express');
var app = express();
const { Client } = require('pg');
const port = process.env.PORT || 5000;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
client.connect();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/relation/:id', (req, res) => {
    client.query('SELECT * FROM things;', (err, res) => {
        if(err) throw err;
        res.status(200).json(res);
    });
});


app.listen(port, function() {
    console.log('listening on ' + port);
});

module.exports = app;