const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema=mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  username:{
    type:String,
    index:true,
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
    type:Number,
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

// function validateEmail(email) {
//   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// }

module.exports.createUser=(newUser,callback)=>{
  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    if(err){
      throw err;
    }else{
      newUser.password=hash;
      newUser.save(callback);
    }
  });

  // if(validateEmail(user.email)){
  //   user.email=String(user.email).toLowerCase();
  //   //TODO have to add code to check length of password
  //   //TODO have to add code to check length of name
  //   bcrypt.hash(user.password, saltRounds, function(err, hash) {
  //     if(err){
  //       throw err;
  //     }else{
  //       user.password=hash;
  //       User.create(user,callback);
  //     }
  //   });
  // }else{
  //   const err=new Error();
  //   err.name="TypeError";
  //   err._message="Input is not an Email Id";
  //   return callback(err)
  // }
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err){
        throw err;
      }
    	callback(null, isMatch);
	});
}

// module.exports.login=(userinput,callback)=>{
//   var query={
//     email:userinput.email
//   }
//   User.findOne(query,function(err,retrievedUser){
//     if(retrievedUser){
//       bcrypt.compare(userinput.password, retrievedUser.password, function(err, res) {
//         return callback(retrievedUser,err,res);
//       });
//     }else{
//       return callback(retrievedUser);
//     }
//   });
//
// }

//TODO have to add code for recharging wallet
