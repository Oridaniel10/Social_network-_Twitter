exports.requireLogin = (req,res,next) =>{    //requirelogin function
    if(req.session && req.session.user) //if session is on while the request && user property is set on
    {
        return next();    // go to home page
    }
    else{                                 // else go to the login page
        return res.redirect('/login');
    }
}