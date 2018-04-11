const express = require('express');
const router = express.Router();
const request = require('request');

var User = require('../models/user');
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

function convertDateToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

router.post('/addauction',ensureAuthenticated,(req,res)=>{
  var name = req.body.name;
  var dayofauction=req.body.dayofauction;
  var bidprice = req.body.bidprice;
  var description = req.body.description;
  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('dayofauction', 'Day of Auction is required').notEmpty();
  req.checkBody('bidprice', 'Bid price is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.render('addauction',{title:"Create Auction | Auction Away",errors:errors});
  }else{
    dayofauction=new Date(dayofauction+" GMT+0530");
    var dayofcreation=new Date((new Date(Date.now())).toDateString()+" GMT+0530");
    bidprice=parseInt(bidprice);
    if(!isNaN(bidprice) && bidprice>0 && dayofauction>dayofcreation){
      var newAuction=new Auction({
        name:name,
        sellerid:req.user._id,
        dayofauction:dayofauction,
        bidprice:bidprice,
        securitydeposit:parseInt(bidprice/2),
        description:description,
        dayofcreation:dayofcreation
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
    }else{
      req.flash('error_msg', "Check inputs");
      res.redirect('/auctions/addauction');
    }
  }
});

router.post('/bidonauction',ensureAuthenticated,(req,res)=>{
  var userid=req.user._id;
  var auctionid=req.body.auctionid;
  var bidamount=parseInt(req.body.bidamount);
  if(!isNaN(bidamount) && bidamount>0){
    User.findById(userid,function(err,user){
      if(err){
        console.log(err);
        req.flash('error_msg', err.name);
        res.redirect('/');
      }
      if(user){
        request.get('http://localhost:3000/auctions/api/auction/'+auctionid,(err,response,body)=>{
          if(response.statusCode==200){
            var auction=JSON.parse(body);
            if(bidamount>auction.bidprice && user.balance>=auction.securitydeposit && auction.status==1){
              auction.bidprice=bidamount;
              auction.buyerid=user._id;
              auction.save(function(err){
                if(err){
                  console.log(err);
                  req.flash('error_msg', err.name);
                  res.redirect('/auctions/auction/'+auction._id);
                }else{
                  req.flash('success_msg', "Bid successful");
                  res.redirect('/auctions/auction/'+auction._id);
                }
              });
            }else{
              req.flash('error_msg',"Something is wrong");
              res.redirect('/auctions/auction/'+auction._id);
            }
          }else{
            console.log(err);
            req.flash('error_msg',"Something is wrong");
            res.redirect('/');
          }
        });

      }else{
        req.flash('error_msg','Unknown User');
        res.redirect('/users/login');
      }
    });
  }else{
    req.flash('error_msg','Check the bid amount');
    res.redirect('/auctions/auction/'+auctionid);
  }
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}


module.exports=router;
