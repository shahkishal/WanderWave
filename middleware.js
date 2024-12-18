const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema } = require("./schema.js");

const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
        {
            //redirectUrl save
            req.session.redirectUrl = req.originalUrl;
            
            req.flash("error","You must be logged to perform this activity!");
            return res.redirect("/login");
        }
        next();
}; 

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl ;
       
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let edit_listing = await Listing.findById(id) ;
    if(!edit_listing.owner._id .equals(res.locals.currUser._id))
        {
            req.flash("error","You are not ownwer of this listing .");
            return res.redirect(`/listings/${id}`);
        }
    next();
};

module.exports.validateListing  = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
       
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview  = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();  
    }
};
module.exports.isReviewOwner = async (req,res,next) =>{
    let {id , reviewId} = req.params ;

    let auth_id = await Review.findById(reviewId);
    auth_id = auth_id.author._id;
    

    if(!auth_id.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not ownwer of this review .");
            return res.redirect(`/listings/${id}`);
        }
    
    next();
};
