const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review'); // Assuming you have a review model

const listingschema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
       url : String,
       filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review",
    },],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
});

listingschema.post('findOneAndDelete', async function (listing){
    if(listing){
        await review.deleteMany({_id : { $in : listing.reviews}}); 
    }
});

const Listing = mongoose.model("Listing",listingschema);
module.exports = Listing;
