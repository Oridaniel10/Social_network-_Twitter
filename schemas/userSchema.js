const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName : {
        type :String,
        required : true,                // user has to insert firstname 
        trim : true                    //get the value without spaces
    },
    lastName : {
        type :String,
        required : true,                   
        trim : true                   
    },
    userName : {
        type :String,
        required : true,                  
        trim : true ,                   
        unique : true                   //will only accept uinque values
    },
    email : {
        type :String,
        required : true,                  
        trim : true ,                  
        unique : true                   
    },
    password : {
        type :String,
        required : true                
    },
    profilePicture : {
        type :String,
        default :"/images/profilePicture.png"              // deafult pic to any user...
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }]

},{timestamps : true});   //create & update time

var User = mongoose.model('User' , userSchema);     //name of the collection will be User , and userSchema its how every collection will be
module.exports = User;