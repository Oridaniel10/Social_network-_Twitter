const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/userSchema');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: req.session.user.userName,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }
    
    res.status(200).render("profilePage", payload);
})

router.get("/:userName", async (req, res, next) => {
    var payload = await getPayload(req.params.userName , req.session.user);
    res.status(200).render("profilePage", payload);
})


//getpayload function to get information about user logged in 
async function getPayload (userName , userLoggedIn) {
    var user = await User.findOne({userName : userName})
    if( user == null){

        user = await User.findById(userName)

        if(user == null){
            return {
                pageTitle: "User not found",
                userLoggedIn:userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn),
            }
        }
    }

        return{
            pageTitle:user.userName,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user
        }
    
}

module.exports = router;