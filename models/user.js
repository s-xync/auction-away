const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  balance:{
    type:mongoose.Schema.Types.Decimal128,
    default:0
  },
  imageurl:{
    type:String
  },
  createtime:{
    type:Date,
    default:Date.now
  }
});

const User=module.exports=mongoose.model('User',userSchema);

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports.register=(user,callback)=>{
  if(validateEmail(user.email)){
    user.email=String(user.email).toLowerCase();
    //TODO have to add code to check if the email exists
    //TODO have to add code to check length of password
    //TODO have to add code to check length of name
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      if(err){
        throw err;
      }else{
        user.password=hash;
        User.create(user,callback);
      }
    });
  }else{
    //TODO have to add code to do if not email
  }
}

module.exports.login=(userinput,callback)=>{
  var query={
    email:userinput.email
  }
  User.findOne(query,function(err,retrievedUser){
    bcrypt.compare(userinput.password, retrievedUser.password, function(err, res) {
      if(err){
        return callback(err);
      }else if(res){
        return callback(retrievedUser);
      }else{
        return callback(null);
      }
    });
  });

}

//TODO have to add code for recharging wallet
