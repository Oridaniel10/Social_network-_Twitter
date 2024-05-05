const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware');
const path =require('path');
const bodyParser = require('body-parser');
const mongoose = require("./database");
const session = require('express-session')

//port
const server = app.listen(port , ()=>
console.log("listening to port 3003 "));

app.set("view engine" , "pug");  //use pugtemplate 
app.set("views" , "views"); //go to the views folder 


app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.static(path.join(__dirname , "public"))); // everything in the folder public is static file

app.use(session({

    secret : "hash-session" ,                            //hash the session
    resave : true ,
    saveUninitialized : false

}))

//---------------------------------Routes-------------------------------------------------------------------//

const loginRoutes = require('./routes/loginRoutes');
app.use('/login' , loginRoutes);

const registerRoutes = require('./routes/registerRoutes');
app.use('/register' , registerRoutes);

const logoutRoute = require('./routes/logout');
app.use('/logout' , logoutRoute);

const postRoute = require('./routes/postRoutes');
app.use('/posts' , middleware.requireLogin, postRoute);

const profileRoute = require('./routes/profileRoutes');
app.use('/profile' , middleware.requireLogin, profileRoute);
//-------------------------------Api Routes-----------------------------------------------------------------//
const postApiRoute = require('./routes/api/posts');
app.use('/api/posts' , postApiRoute);

//----------------------------------------------------------------------------------------------------------//

app.get("/", middleware.requireLogin, (req,res ,next)=>{   // when user is going to the website check with the function if he already logged in
    var payload = {
        pageTitle : "Home",
        userLoggedIn : req.session.user,
        userLoggedInJs : JSON.stringify(req.session.user),
        
    }

    res.status(200).render("home", payload);   //SUCCESS - show home page
})