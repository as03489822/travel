if(process.env.PRO_KEY != 'porduction'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require("./Errors/ExpressError.js");

const listingsRoutes = require("./routes/listings.js")
const reviewsRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js")

let session = require("express-session");
const MongoStore = require('connect-mongo');
let flash = require('connect-flash');

const passport = require("passport");
const LocalStrtegie = require("passport-local");
const User = require("./models/user.js");

app.engine('ejs' , engine);
app.set("view engin", "ejs");
app.set("views" ,path.join(__dirname ,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))

let mongodbUrl = process.env.ATLASDB_URL

main().then(() => {
    console.log("database connected");
}).catch(err => console.log(err))

// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/finalproject')
// }

async function main(){
    await mongoose.connect(mongodbUrl)
}

let store = MongoStore.create({
    mongoUrl : mongodbUrl,
    crypto : {
        secret :process.env.SECRET
    },
    touchAfter : 24 * 3600,
})

const sessionOption ={
    // store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    }
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtegie(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req ,res ,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

app.get("/" ,(req ,res) => {
    res.send("<h1>Enter &nbsp;&nbsp;&nbsp;&nbsp;   http://localhost:8080/listing</h1>")
})

app.use("/listing" , listingsRoutes);
app.use("/listing/:id/review" , reviewsRoutes);
app.use("/" , userRoutes);

app.all("*" ,(req ,res ,next) => {
    next(new ExpressError(400 ,"Page Not Found"))
})

app.use((err ,req ,res ,next) =>{
    let {statusCode =500 ,message="something went wrong"}=err;
    res.render("./errorPages/errorP.ejs" ,{message})
})
app.listen("8080" , () => {
    console.log("server connected on port 8080");
})