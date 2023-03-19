const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:process.env.google_client_id,
        clientSecret:process.env.google_client_secret,
        callbackURL:process.env.google_call_back_url
    },
    async function(accessToken,refreshToken,profile,done){
        // find a user
        try {
            let user = await User.findOne({email:profile.emails[0].value});
         

            // console.log(accessToken,refreshToken,"*****Received Just a check for tokens");
            // console.log(profile);
            if(user){
                // if found then set this user as req.user
                return done(null,user);
            }
            else{

                // if not found then create the user and set it as req.user
                let newUser = await User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                });
                return done(null,newUser);
            }
            
        } catch (error) {
            // console.log("Error in google-strategy-passport",err);
            return;
        }
      


    }
));


module.exports=passport;