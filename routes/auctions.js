const express = require('express');
const router = express.Router();
const request = require('request');

var Auction = require('../models/auction');

//not really used anywhere
router.get('/api/all', (req, res) => {
  Auction.getAllAuctions((err, auctions) => {
    if(err){
      console.log(err);
      throw err;
    }else{
      res.json(auctions);
    }
  });
});

router.get('/api/notover', (req, res) => {
  Auction.getNotOverAuctions((err, auctions) => {
    if(err){
      console.log(err);
      // res.status(500).send({error:{name:err.name,message:err._message}});
      throw err;
    }else{
      res.json(auctions);
    }
  });
});

router.get('/api/auction/:_id', (req, res) => {
  var id=req.params._id;
  Auction.getAuctionById(id, (err, auction) => {
    if(err){
      console.log(err);
      throw err;
    }else{
      res.json(auction);
    }
  });
});

router.get('/api/soldby/:_id', (req, res) => {
  var sellerid=req.params._id;
  Auction.allSoldBy(sellerid, (err, auctions) => {
    if(err){
      console.log(err);
      throw err;
      // res.status(500).send({error:{name:err.name,message:err._message}});
    }else{
      res.json(auctions);
    }
  });
});

router.get('/api/boughtby/:_id', (req, res) => {
  var buyerid=req.params._id;
  Auction.allBoughtBy(buyerid, (err, auctions) => {
    if(err){
      console.log(err);
      throw err;
      // res.status(500).send({error:{name:err.name,message:err._message}});
    }else{
      res.json(auctions);
    }
  });
});

// app.delete('/removeauction/:_id', (req, res) => {
//   var id=req.params._id;
//   Auction.removeAuction(id, (err, auction) => {
//     if(err){
//       console.log(err);
//       res.status(500).send({error:{name:err.name,message:err._message}});
//     }else{
//       res.json(auction);
//     }
//   });
// });

router.get('/auction/:_id',(req,res)=>{
  var id=req.params._id;
  request.get('http://localhost:3000/auctions/api/auction/'+id,(err,response,body)=>{
    if(response.statusCode==200){
      var auction=JSON.parse(body);
      res.render('auction',{title:auction.name+" | Auction Away",auction:auction});//single auction object
    }else{
      console.log(err);
      req.flash('error_msg',"Something is wrong");
      res.redirect('/');
    }
  });
});

router.get('/addauction',ensureAuthenticated,(req,res)=>{
  res.render('addauction',{title:"Create Auction | Auction Away"});
});

router.post('/addauction',ensureAuthenticated,(req,res)=>{
  //TODO: do validation if possible
  var newAuction=new Auction({
    name:req.body.name,
    sellerid:req.user._id,
    starttime:req.body.starttime,
    bidprice:req.body.bidprice,
    securitydeposit:req.body.securitydeposit,
    description:req.body.description,
    imageurl:req.body.imageurl
  });
  Auction.addAuction(newAuction,(err,auction)=>{
    console.log(auction);
    if(err){
      console.log(err);
      req.flash('error_msg', "Something is wrong");
      res.redirect('/auctions/addauction');
    }else{
      req.flash('success_msg','Auction added successfully');
      res.redirect('/auctions/auction/'+auction['_id']);
    }
  });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports=router;
