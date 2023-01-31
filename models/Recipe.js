const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add the dish name"],
    unique: false,
  },
  image: {
    type: String,
    required: [true, "Please add recipe image URL"],
    unique: true,
  },
  time: {
    type: Number,
    required: [true, "Please add the preparation time in minutes"],
  },
  cuisine: {
    type: String,
    enum: {
      values: ["Asian", "Japanese", "Thai", "Italian", "Greek", "Mexican", "Argentinian", "Colombian", "South American", "Etiopian", "Marrocan", "Spanish", "Portuguese", "Indian", "American", "Other"],
      message: "Please select the cuisine type of your dish. If it is not in the list, select Other."
    }, 
  },
  kcal: {
    type: Number,
    required: [true, "Please add an average amount of calories per serving"],
  },
  spices: {
    type: String,
    enum: {
      values: ["Mild", "Medium", "Spicy", "Very spicy"],
      message: "Please select the spicyness of your dish",
    },
  },
  lactose: {
    type: Boolean,
    required: [true, "Please check this box if your meal contains lactose"],
  },
  gluten: {
    type: Boolean,
    required: [true, "Please check this box if your meal contains gluten"],
  },
  veggie: {
    type: Boolean,
    required: [true, "Please check this box if your meal contains meat or fish - non vegetarian friendly"],
  },
  level: {
    type: String,
    enum: {
      values: ["Beginner", "Medium", "Hard", "God", "Grandma"],
      message: "Please select the level of difficulty",
    },
  },
  pax: {
    type: Number,
    required: [true, "Please add the amount of servings"],
  },
  ingredients: {
    type: Array,
    required: [true, "Please add all the ingredients of your meal, all separated by a comma"],
  },
  steps: {
    type: Array,
    required: [true, "Please add the cooking instructions, all separated by a comma and in the right order"],
  },
    username: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;