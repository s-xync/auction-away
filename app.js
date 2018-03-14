var express = require('express');
var app = express();
var path = require('path');

app.listen(8080);
// viewed at http://localhost:8080

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/index.html'));
});


app.get('/signin', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/signin.html'));
});

app.get('/auction', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/auction.html'));
});

app.get('/itemdetails', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/itemdetails.html'));
});

app.get('/additem', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/additem.html'));
});

app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname +'/public'+ '/profile.html'));
});