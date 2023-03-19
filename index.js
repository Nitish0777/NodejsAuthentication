// requiring the dotenv library
const dotenv=require('dotenv');

// setting up the dotenv
dotenv.config()

//  requiring the express library
const express=require('express');

// requiring the cookie parser module to parse the cookie
const cookieParser=require('cookie-parser');

const app=express();


var expressLayouts = require('express-ejs-layouts');

const port=process.env.PORT || 3000;

const connectDB=require('./config/mongoose');

// uses for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo');

// connectDB(process.env.DATABASE_URL);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',  './views');
app.use(express.urlencoded({extended: true}));


// calling the cookie-parser middleware
app.use(cookieParser());


app.use(express.static('./assets'));

app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(session({
    name:'codeial',
    // TODO change the secret before deployment in production mode
    secret:process.env.SECRET_KEY,
    // secret:"a",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
        // maxAge:(1000*5)
    },
    store: MongoStore.create({
      
        mongoUrl : "mongodb://0.0.0.0:27017/social_media_3",
         autoremove : "disabled",
     },function(err){
        //  console.log("error at mongo store",err || "connection established to store cookie");
        return;
     })
}));


app.use(passport.initialize());

// This middleware is responsible for serializing and deserializing user 
// sessions for authentication purposes. It enables Passport to store user
//  information in a session, so that the user doesn't need to re-authenticate 
// on each request.
app.use(passport.session());

app.use(passport.setAuthenticatedUser);



// loading the routes
app.use('/',require('./routes'));

// server is going to fire up

connectDB().then(()=>{
    app.listen(port,function(err){
        if(err){
            console.log("Error in running the server",err);
            return;
        }
        console.log(`Server is listening on port no : ${port}`);
        // console.log(process.env);
        return;
    })
    

})



