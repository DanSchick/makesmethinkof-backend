var express = require('express');
var app = express();
const { Pool } = require('pg');
const port = process.env.PORT || 5000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/relation/:id', (req, res) => {
    pool.query('SELECT * FROM things;', (err, response) => {
        if(err) throw err;
        res.status(200).json(response);
    });
});

// app.put('/api/relation/:thing1/:thing2', (req, res) => {
//     pool.query('INSERT INTO things (id, data) VALUES ( '1', 'imdb11111' )', (err, response) => {
//         if(err) throw err;
//     });
// });

app.listen(port, function() {
    console.log('listening on ' + port);
});

module.exports = app;