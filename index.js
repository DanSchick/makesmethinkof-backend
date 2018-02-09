var express = require('express');
var app = express();

const port = process.env.PORT || 5000;

app.get('/', function(req, res) {
    res.send('Hello, world!');
});


app.listen(port, function() {
    console.log('listening on ' + port);
});