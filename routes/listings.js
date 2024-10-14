const express = require("express");
const router = express.Router();
const asyncWrap = require("../Errors/asyncWrap.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js")
const listingController = require("../controller/listing.js")

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

// index or all listing show route
router.get("/" ,listingController.allListing)

//show listing using category
router.get("/category/:name", listingController.showCategory)

// add new listing
router.get("/new" ,isLoggedIn ,listingController.renderNewListing)
router.post("/new" ,upload.single('listing[image][url]') ,validateListing  ,asyncWrap(listingController.addNewlisting))

//edit route
router.get("/:id/edit",isLoggedIn ,isOwner ,asyncWrap(listingController.renderEditRoute))

// update route
router.put("/:id/edit" ,isLoggedIn ,isOwner ,upload.single('listing[image][url]') ,validateListing ,asyncWrap(listingController.editListing))

// indivisual show route by id
router.get("/:id" ,asyncWrap(listingController.showListing ))

// delete listing
router.delete("/:id/delete" ,isLoggedIn ,asyncWrap(listingController.destroyListing))

module.exports = router;