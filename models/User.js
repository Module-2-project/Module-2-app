const { Schema, model } = require('mongoose');
 
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'A username is required.']
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'An email address is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    cookingLevel: {
      type: String,
      enum: {
        values: ["Beginner", "Medium","Hard", "God", "Grandma"],
        message: "Please tell us your cooking skill level",
      },
      required: true
    },
    favorites: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    }
  },
  {
    timestamps: true
  }
);
 
const User = model('User', userSchema);

module.exports = User;