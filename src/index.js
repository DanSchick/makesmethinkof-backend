var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { Pool } = require('pg');
const port = process.env.PORT || 5000;

let DATABASE_URL;
if(process.env.NODE_ENV == 'local') {
    DATABASE_URL = require('../database');
} else {
    DATABASE_URL = process.env.DATABASE_URL
}


// set up pool
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: true
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

// set up to consume JSON request from body
app.use(bodyParser.json());

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
    if(!req.body || !req.body.firstThing || !req.body.secondThing) {res.status(500).send();}
    let errors = false;

    insertMovie(req.body.firstThing, response => {
        if(!response) errors = true;
    });
    insertMovie(req.body.secondThing, response => {
        if(!response) errors = true;
    });

    insertRelation(req.body.firstThing, req.body.secondThing, response => {
        if(!response) errors = true;
    });

    res.status(200).send();
});

app.listen(port, function() {
    console.log('listening on ' + port);
});

function insertMovie(data, callback) {
    const id = 'imdb' + data.imdbID;
    // insert row, if it already exists do nothing
    let query = "INSERT INTO things (id, data) VALUES ('" + id + "', '" + JSON.stringify(data) + "')";
    query += " ON CONFLICT DO NOTHING;";

    pool.query(query, (err, response) => {
        if(err) throw err;
        callback(response);
    });
}

function insertRelation(firstThing, secondThing, callback) {
    console.log('relation insert');
    const thing1 = 'imdb' + firstThing.imdbID;
    const thing2 = 'imdb' + secondThing.imdbID;
    
    let query = "INSERT INTO relations (firstthing_id, secondthing_id, count) VALUES ('" + thing1 + "', '" + thing2 + "', 1)";
    query += " ON CONFLICT (firstthing_id, secondthing_id) DO UPDATE SET count = relations.count + 1 WHERE relations.firstthing_id = '" + thing1 + "' AND relations.secondthing_id = '" + thing2 + "';"; 

    pool.query(query, (err, response) => {
        if(err) throw err;
        console.log(response);
        callback(response);
    });
}

module.exports = app;