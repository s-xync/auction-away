const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//body parser middleware
app.use(bodyParser.json());
app.listen(3000);
console.log("App listening at port 3000....");

mongoose.connect('mongodb://localhost/auctionaway');
var db=mongoose.connection;

Auction=require('./models/auction')

//api end-points
app.get('/api/allauctions', (req, res) => {
	Auction.getAllAuctions((err, auctions) => {
		if(err){
			throw err;
		}
		res.json(auctions);
	});
});

app.get('/api/notoverauctions', (req, res) => {
	Auction.getNotOverAuctions((err, auctions) => {
		if(err){
			throw err;
		}
		res.json(auctions);
	});
});

app.get('/api/getauction/:_id', (req, res) => {
  var id=req.params._id;
  Auction.getAuctionById(id, (err, auction) => {
    if(err){
      throw err;
    }
    res.json(auction);
  });
});

app.post('/api/addauction', (req, res) => {
  var auction=req.body;
  Auction.addAuction(auction, (err, auction) => {
    if(err){
      throw err;
    }
    res.json(auction);
  });
});

app.delete('api/removeauction/:_id' (req, res) => {
  var id=req.params._id;
  Auction.removeAuction(id, (err, auction) => {
    if(err){
      throw err;
    }
    res.json(auction);
  });
});



//pages
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
