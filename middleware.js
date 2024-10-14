const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const {listingSchema,reviewSchema} = require("./schemaValidation.js");
const ExpressError = require("./Errors/ExpressError.js");

module.exports.isLoggedIn = (req ,res ,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be logged in to create new listing");
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req ,res ,next) => {
    if(req.session.redirectUrl){
        res.locals.saveUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req ,res ,next) => {
    let {id} = req.params;
    let listing =await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "you are not owner of this listing");
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.validateListing = (req ,res ,next) => {
    const {error} = listingSchema.validate(req.body);
    if(error){
        let newMsg = error;
        throw new ExpressError(400 , newMsg);
    }else{
        next()
    }
}

module.exports.validateReview = (req ,res ,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let newMsg = error.details.map(el =>el.message).join(",");
        throw new ExpressError(400 , new Msg);
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async(req ,res ,next) => {
    let{id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the aurhor of this post");
        return res.redirect(`/listing/${id}`)
    }
    next()
}