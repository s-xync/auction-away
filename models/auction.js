const mongoose=require('mongoose');
// auction schema
const auctionSchema=mongoose.Schema({
  //name, sellerid, starttime, bidprice, securitydeposit, description, imageurl, state(0,1,2), createtime
  name:{
    type:String,
    required: true
  },
  sellerid:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  starttime:{
    type:Date,
    required:true
  },
  bidprice:{
    type:Integer,
    required:true
  },
  securitydeposit:{
    type:Integer,
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
    type:Integer,
    required:true
  },
  createtime:{
    type:Date,
    default:Date.now
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
  Auction.find(query,callback).sort({"starttime":1}).limit(limit);
}

//get auction by id
module.exports.getAuctionById=(id,callback)=>{
  Auction.findById(id,callback);
}

//add auction to the database
module.exports.addAuction=(auction,callback)=>{
  Auction.create(id,callback);
}

module.exports.removeAuction=(id,callback)=>{
  var query={
    _id:id
  };
  Auction.remove(query,callback);
}
