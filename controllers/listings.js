const Listing = require('../listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new");
};

module.exports.showListing=async (req,res)=>{
    const {id} = req.params;
    const foundListing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!foundListing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings"); // ✅ prevents second response
    }
    res.render("listings/show",{foundListing});
};

module.exports.createListing = async (req, res, next) => {
    // Geocode location from form
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    // Get image details from multer
    let url = req.file.path;
    let filename = req.file.filename;

    // Create new listing
    const data = req.body.listing;
    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=response.body.features[0].geometry;
    let savedListing= await newListing.save();
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings"); // ✅ prevents second response
    }
    let originalImageUrl=foundListing.image.url;
    let newImageUrl=originalImageUrl.replace("/upload","/upload/w_330");
    res.render("listings/edit", { foundListing ,newImageUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    // If there's a new image uploaded
    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        // Keep the old image if no new one is uploaded
        const oldListing = await Listing.findById(id);
        updatedData.image = oldListing.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
