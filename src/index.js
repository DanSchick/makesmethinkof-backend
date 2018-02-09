var express = require('express');
var app = express();
const { Pool } = require('pg');
const port = process.env.PORT || 5000;

// set up pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

// set up to consume JSONin request
app.use(express.bodyParser());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/relation/:id', (req, res) => {
    pool.query('SELECT * FROM things;', (err, response) => {
        if(err) throw err;
        res.status(200).json(response);
    });
});

app.post('/api/relation/insert', (req, res) => {
    pool.query("SELECT * FROM things", (err, response) => {
        console.log(req.body);
        if(err) throw err;
        res.status(200).json(req.body);
    });
});

app.listen(port, function() {
    console.log('listening on ' + port);
});

module.exports = app;