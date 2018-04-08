const mongoose=require('mongoose');
// auction schema
const auctionSchema=mongoose.Schema({
  //name, sellerid, dayofauction, bidprice, securitydeposit, description, imageurl, state(0,1,2), dayofcreation
  name:{
    type:String,
    required: true
  },
  sellerid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  buyerid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  dayofauction:{
    type:Date,
    required:true
  },
  bidprice:{
    type:Number,
    required:true
  },
  securitydeposit:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageurl:{
    type:String
  },
  state:{
    //0 INACTIVE
    //1 ACTIVE
    //2 OVER
    type:Number,
    default:0
  },
  dayofcreation:{
    type:Date,
    required:true
  }
});

const Auction=module.exports=mongoose.model('Auction',auctionSchema);

//get limited number of all types of auctions
module.exports.getAllAuctions=(callback,limit)=>{
  Auction.find(callback).limit(limit);
}

//get limited number of inactive and active auctions sorted by start time
module.exports.getNotOverAuctions=(callback,limit)=>{
  var query={
    state:[0,1]
  };
  Auction.find(query,callback).sort({"dayofauction":1}).limit(limit);
}

//get auction by id
module.exports.getAuctionById=(id,callback)=>{
  Auction.findById(id,callback);
}

//add auction to the database
module.exports.addAuction=(auction,callback)=>{
  Auction.create(auction,callback);
}

module.exports.removeAuction=(id,callback)=>{
  var query={
    _id:id
  };
  Auction.remove(query,callback);
}

//get all auctions associated with a seller
module.exports.allSoldBy=(sellerid,callback,limit)=>{
  var query={
    sellerid:sellerid
  };
  Auction.find(query,callback).sort({"dayofauction":1}).limit(limit);
}

//get all auctions bought by a buyer
module.exports.allBoughtBy=(buyerid,callback,limit)=>{
  var query={
    buyerid:buyerid
  };
  Auction.find(query,callback).sort({"dayofauction":1}).limit(limit);
}
