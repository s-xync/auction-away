const express = require('express');
const router = express.Router();
const request = require('request');

// Get Homepage with not over auctions
router.get('/', function(req, res){
  request.get('http://localhost:3000/auctions/api/notover',(err,response,body)=>{
    if(response.statusCode==200){
      var auctions=JSON.parse(body);
      res.render('index',auctions);//array of auction objects
    }else{
      res.render('error',response.error);
    }
  });
});

module.exports = router;
