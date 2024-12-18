const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");
const mapToken = process.env.MAP_TOKEN;


maptilerClient.config.apiKey = mapToken;

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs",{ allListings });
   
};  

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
    
};

module.exports.showListing = async(req,res)=>{
    
    let {id} = req.params;
    let listing =await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    } 
    else{
        //console.log(listing);
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.createListing = async(req,res,next)=>{

    const result = await maptilerClient.geocoding.forward(req.body.location,{limit:1});
    
    let url = req.file.path;
    let filename = req.file.filename;    
    
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = result.features[0].geometry;
    savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{

    let {id} = req.params;
    let edit_listing = await Listing.findById(id) ;
    
    if(!edit_listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
       } 
    else{
    let originalImageUrl = edit_listing.image.url ;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_400");
    res.render("listings/edit.ejs",{edit_listing , originalImageUrl});}
    };


   module.exports.updateListing = async(req,res)=>{
   let {id} = req.params;
   
   let listing = await Listing.findByIdAndUpdate(id,{...req.body});
   
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = {url , filename};
    await listing.save();
   }
   req.flash("success","Listing Updated");
   res.redirect(`/listings/${id}`);
   };     

   module.exports.destroyListing = async(req,res)=>{
    
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
    };

    module.exports.filter = async (req, res) => {
        let { category_value } = req.params;
        let allListings ;
        if(category_value==="search")
        {
            let {search_data} = req.body ;
            allListings = await Listing.find({ $or: [
                { country: { $regex: search_data, $options: 'i' } }, 
                { location: { $regex: search_data, $options: 'i' } } 
            ]}).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner"); 
        }
        else{
        allListings = await Listing.find({ category: category_value }).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
        }
        if (allListings.length<=0) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        else{
        res.render("listings/index.ejs", { allListings });}
    } ;