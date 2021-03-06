const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
        review: {
            type: String
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be between 1 and 5'],
            max: [5, 'Rating must be between 1 and 5']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        //In the database, we will only persist tour and user IDs and virtually populate the model
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'A review must belong to a tour..']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user..']
        }
    },
    // Allowing the usage of virtual properties that won't be persisted in the DB    
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

//for any FIND method on review model, it will popuulate the tour  user data while only keeping the user ID in the document.
reviewSchema.pre(/^find/, function(next) {

    //reminder that .populate still creates another query, which can affect the performance if app is bigger.
    this.populate({
        path: 'user',
        select: 'role name'
    });

    next();

});

const Review = mongoose.model('Review', reviewSchema);



module.exports = Review;