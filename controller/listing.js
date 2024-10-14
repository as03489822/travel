const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.allListing = async (req ,res) => {
    const allListing = await Listing.find();
    res.render("listing/listing.ejs" ,{allListing});
}

module.exports.renderNewListing =  (req ,res) => {
    res.render("listing/new.ejs")
}

module.exports.addNewlisting =  async (req ,res ,next) => {    
    let url = req.file.path;
    console.log(url)
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={filename , url};
    await newListing.save();
    req.flash("success" , "New Llisting Created");
    res.redirect("/listing");
}

module.exports.renderEditRoute =  async (req ,res) => {
    let {id} = req.params;
    let listing =await Listing.findById(id);
    let imageUrl = listing.image.url;
    imageUrl =  imageUrl.replace("/upload" , "/upload/,w_250");
    res.render("listing/edit.ejs" ,{listing , imageUrl});
}

module.exports.editListing =  async (req ,res ,next) => {
    let {id} = req.params;
    let editListing = await Listing.findByIdAndUpdate(id ,req.body.listing);

    if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename = req.file.filename;
        editListing.image = {url , filename};
        await editListing.save();
    }

    req.flash("success" , "Listing Updated");
    res.redirect(`/listing/${id}`)
}

module.exports.showListing = async(req ,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    if (!listing){
        req.flash("error", "You requested for listing doesn't exist");
        res.redirect("/listing")
    }
    res.render("listing/show.ejs" ,{listing});
}

module.exports.destroyListing =  async (req ,res) => {
    let {id} = req.params;
    let list = await Listing.findById(id);
    await Review.findByIdAndDelete(list.reviews);
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listing");
}
module.exports.showCategory =async(req ,res) =>{
        let {name} = req.params;
    const allListing = await Listing.find( {category:name});   
    if(allListing == ""){
        req.flash("error" , `listing for category(${name}) is not existing`)
        return res.redirect("/listing")
    }
    res.render("listing/listing.ejs" ,{allListing});
}