const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');

app.set("view engine" , "pug");  //use pug template 
app.set("views" , "views"); //go to the views folder 

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req,res ,next)=>{  
    res.status(200).render("login");  
})

router.post("/", async(req,res ,next)=>{    //lets check if the user logged in properly

    var payload = req.body;

    if( req.body.logUsername && req.body.logPassword){
        var user = await User.findOne({ 
            $or: [
                { userName: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            return res.status(200).render("login", payload);
    });
       
        if(user != null)
        {
         var result = await bcrypt.compare(req.body.logPassword , user.password);  // check with bcyprt if the passwords are the same
         if(result === true)
         {
           req.session.user = user;
           return res.redirect("/");
        }
    }

    payload.errorMessage = "Login values incorrect.";
    return res.status(200).render("login", payload);
}
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");  
})

module.exports = router;