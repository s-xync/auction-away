const express = require('express');
const router = express.Router();

router.get('/api/all', (req, res) => {
  Auction.getAllAuctions((err, auctions) => {
    if(err){
      console.log(err);
      res.status(500).send({error:{name:err.name,message:err._message}});
    }else{
      res.json(auctions);
    }
  });
});

router.get('/api/notover', (req, res) => {
  Auction.getNotOverAuctions((err, auctions) => {
    if(err){
      console.log(err);
      res.status(500).send({error:{name:err.name,message:err._message}});
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
      res.status(500).send({error:{name:err.name,message:err._message}});
    }else{
      res.json(auction);
    }
  });
});

router.get()
