const mongoose = require("mongoose");
const Review = require("./review.js");

const User = require("./user.js");

const listingschema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        filename :String,
        url :String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    category : {
        type :String,
        enum :["mountain city","room","cave","hotel", "beach","pool","arctic","city","tower","golfing","boat","farm house"],
    }
})

listingschema.post("findOneAndDelete" , async(data) => {
    if(data){
        await Review.deleteMany({_id :{$in : data.reviews}});
    }
})

let Listing = mongoose.model("Listing" , listingschema);
module.exports = Listing;