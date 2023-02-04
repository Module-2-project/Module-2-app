const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  favRecipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  favOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;