//------bug i must resolve - the same username is not alreting
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/userSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {
        var firstName = req.body.firstName.trim();
        var lastName = req.body.lastName.trim();
        var username = req.body.userName.trim();
        var email = req.body.email.trim();
        var password = req.body.password;
    
        var payload = req.body;
    

    if(firstName && lastName && username && email && password) {
        var user = await User.findOne({  // check if email or username already used
            $or: [
                { userName: username },    //left - reffer to the userName in the schema , right - what in the field
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        });

        if(user == null) {
            // No user found
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);    //hash & secure the passwords...

            User.create(data)
            .then((user) => {
                req.session.user = user;
                console.log("New user created:", user);  // let print it on our terminal
                return res.redirect("/");
            })
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already in use.";
            }
            else {
                payload.errorMessage = "Username already in use.";
            }
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
})

module.exports = router;
