const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  title: {
    type: String,
    required: [true, "You need to add a review title."]
  },
  comment: {
    type: String,
    required: [true, "Add your review in this field."]
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, "Add a rating."]
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true]
  },
  recipeRated: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: [true]
  }
});

const Review = model('Review', reviewSchema);

module.exports = Review;