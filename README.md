# Food Folio

## Description

This is a project developed by Patrícia Costa da Cruz and Joandi Hernandez as the project for the second module at Ironhack. The purpose of the application is to store recipes and allow users to consult them.

---

## Instructions

When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the following values:

```js
PORT = 3000;
MONGO_URL = "mongodb+srv://admin:admin@cluster0.1qqscwt.mongodb.net/module2DB";
SESSION_SECRET = "Ir0nH4cK";
NODE_ENV = "development";
```

Then, run:

```bash
npm install
npm i lodash
```

To start the project run:

```bash
npm run start
```

To work on the project and have it listen for changes:

```bash
npm run dev
```

---

## Wireframes

![](docs/wireframes.png)

---

## User stories (MVP)

What can the user do with the app?

- User can sign up and create an account
- User can login
- User can log out (if logged in)
- User can see his/her profile and edit the information there, as well as delete the account (if logged in)
- User can create recipe and edit them (if logged in)
- User can access all recipes stored in the DB (if logged in - otherwise only sees a summary)
- User can access his/her own recipes from the profile page

---

## User stories (Backlog)

- User can search for recipes with different filters (if logged in - otherwise can only search by name)
- User can sort results by different fields - ascending and descending

---

## Models

User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "A username is required."],
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
      required: [true, "An email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    cookingLevel: {
      type: String,
      enum: {
        values: ["Beginner", "Medium", "Hard", "God", "Grandma"],
        message: "Please tell us your cooking skill level",
      },
      required: true,
    },
    favorites: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  },
  {
    timestamps: true,
  }
);
```

Recipe:

```js
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
      values: [
        "Asian",
        "Japanese",
        "Thai",
        "Italian",
        "Greek",
        "Mexican",
        "Argentinian",
        "Colombian",
        "South American",
        "Ethiopian",
        "Marrocan",
        "Spanish",
        "Portuguese",
        "Indian",
        "American",
        "Other",
      ],
      message:
        "Please select the cuisine type of your dish. If it is not in the list, select Other.",
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
  meat: {
    type: Boolean,
    required: [
      true,
      "Please check this box if your meal contains meat or fish - non vegetarian friendly",
    ],
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
    type: String,
    required: [
      true,
      "Please add all the ingredients of your meal, all separated by a comma",
    ],
  },
  steps: {
    type: String,
    required: [
      true,
      "Please add the cooking instructions, all separated by a dot and in the right order",
    ],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
```

---

## Routes

| Name           | Method | Endpoint               | Protected | Req.body                                                                                                   | Renders                 |
| -------------- | ------ | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------- | ----------------------- |
| Home           | GET    | /                      | No        |                                                                                                            |                         |
| Login          | GET    | /auth/login            | No        |                                                                                                            |                         |
| Login          | POST   | /auth/login            | No        | { email, password }                                                                                        | index                   |
| Signup         | GET    | /auth/signup           | No        |                                                                                                            |                         |
| Signup         | POST   | /auth/signup           | No        | { username, firstName, lastName, email, password, cookingLevel }                                           | /auth/login             |
| Logout         | GET    | /auth/logout           | Yes       |                                                                                                            | auth/login              |
| New recipe     | GET    | /recipe/new            | Yes       |                                                                                                            |                         |
| New recipe     | POST   | /recipe/new            | Yes       | { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps }        | /recipe/justAddedRecipe |
| Search         | GET    | /recipe/search         | No        |                                                                                                            |                         |
| Search results | GET    | /recipe/search-results | No        |                                                                                                            | recipe/searchResults    |
| All recipes    | GET    | /recipe/all            | No        |                                                                                                            | recipe/searchResults    |
| Random recipe  | GET    | /recipe/random         | No        |                                                                                                            | recipe/randomRecipe     |
| My recipes     | GET    | /recipe/my-recipes     | Yes       |                                                                                                            | recipe/myRecipes        |
| Recipe detail  | GET    | /recipe/:recipeId      | Yes       |                                                                                                            | recipe/recipeDetail     |
| Edit recipe    | GET    | /recipe/edit/:recipeId | Yes       |                                                                                                            | recipe/editRecipe       |
| Edit recipe    | POST   | /recipe/edit/:recipeId | yes       | { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner } | recipe/recipeDetail     |
| Profile        | GET    | /profile               | Yes       |                                                                                                            | profile/profile         |
| Edit profile   | GET    | /profile/edit          | Yes       |                                                                                                            | profile/editProfile     |
| Edit profile   | POST   | /profile/edit          | Yes       | { username, firstName, lastName, email, cookingLevel }                                                     | profile/edit            |
| Delete profile | GET    | /profile/delete        | Yes       |                                                                                                            | auth/signup             |

---

## Useful links

- [Github Repo](https://github.com/Module-2-project/Module-2-app)
- [Trello kanban]()
- [Deployed version]()
- [Presentation slides](https://www.slides.com)
