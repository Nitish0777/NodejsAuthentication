const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User=require('../models/user');



// authentication using passport
passport.use(new LocalStrategy({
        usernameField:'email',
    },
    async function(email,password,done){
        // find a user and establish the identity

        try {
            let user = await User.findOne({email:email});
            if(user)  {
                const isMatch = await bcrypt.compare(password , user.password);
                if(isMatch){
                    // console.log("yes Password matched");
                    return done(null,user);
                }else{

                    // console.log("Password not matched Aman bhai");
                    return done(null,false);    
                }
            }else{
                // console.log("user not found");
                return done(null,false);
            }
        }catch (error) {
            return done(err);
        }
       
    }

));



// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    // console.log("Serializer is called");
    done(null,user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser( async function(id,done){
    // console.log('DeSerialize User is called ');
    try {
        let user = await User.findById(id);
        if(user)
            return done(null,user);
        else
            return done(null,false);
        
    }catch (error) {
        // console.log("Error in finding a user-->Passport");
        return done(err);
    }
    
});


// check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is signed in, then pass on the request to the next function(i.e. controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in 
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending
        // this to the locals for the views 
        res.locals.user=req.user;
    }
    next();
}



module.exports=passport;

