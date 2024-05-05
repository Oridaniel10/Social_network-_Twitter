//--------------------------------------------database - mongodb connection-------------------------------------------------------------------
const mongoose = require('mongoose');

class Database
{ 
    constructor(){
        this.connect();
    }
     connect()
     {
        mongoose.connect("mongodb+srv://ori:ori123@twitterclone.00htcoa.mongodb.net/TwitterCloneDB")

        .then(()=>{
        console.log("mongo connected")
        })
        .catch((err)=>{
            console.log("error to connect mongodb" + err)
        })
     }
}
//--------------------------------------------------------------------------------------------------------------------

module.exports = new Database();