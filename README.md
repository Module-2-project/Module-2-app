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

If not logged in:

- User can sign up and create an account
- User can login
- User can access all recipes stored in the DB but can only see a summary
- User can get a random recipe suggestion, again only the summary
- If user tries to access a ptotected route, he/she will be redirected to the sign up page

If logged in, these are extra features:

- User can log out
- User can see his/her profile and edit the information there, as well as delete the account
- User can see recipe detail (additional data on ingredients and steps etc)
- User can create recipe and edit them
- User can access all his/her recipes in his/her profile

---

## User stories (Backlog)

If not logged in:

- User can search for recipes by name
- User can sort results by different fields - ascending and descending
- User can view all reviews linked to a recipe

If logged in, these are extra features:

- User can search for recipes with different filters
- User can send a review to rate a recipe
- User can see all his/her reviews in his profile
- User can reset his/her password
- User can access other users' profiles through their recipes or reviews, they will only see the other user's username and recipes
- User can add or remove recipes to his/her favorites
- User can see how many times a recipe has been saved to favorites from all other users
- Admins users can delete reviews and see a list of them all.

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

Review:

```js
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "You need to add a review title."],
    },
    comment: {
      type: String,
      required: [true, "Add your review in this field."],
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Add a rating."],
    },
    reviewerName: {
      type: String,
      required: [true, "You need to add your username to rate this recipe"],
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
    recipeName: {
      type: String,
      required: [true],
    },
    recipeRated: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);
```

---

## Routes

| Name               | Method | Endpoint                    | Protected | Req.body                                                                                                   | Redirects                 |
| ------------------ | ------ | --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- | ------------------------- |
| Home               | GET    | /                           | No        |                                                                                                            |                           |
| Login              | GET    | /auth/login                 | No        |                                                                                                            |                           |
| Login              | POST   | /auth/login                 | No        | { email, password }                                                                                        | index                     |
| Signup             | GET    | /auth/signup                | No        |                                                                                                            |                           |
| Signup             | POST   | /auth/signup                | No        | { username, firstName, lastName, email, password, cookingLevel }                                           | /auth/login               |
| Logout             | GET    | /auth/logout                | Yes       |                                                                                                            | /auth/login               |
| New recipe         | GET    | /recipe/new                 | Yes       |                                                                                                            |                           |
| New recipe         | POST   | /recipe/new                 | Yes       | { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps }        | /recipe/${newRecipe.\_id} |
| Search             | GET    | /recipe/search              | No        |                                                                                                            |                           |
| Search results     | GET    | /recipe/search-results      | No        |                                                                                                            |                           |
| All recipes        | GET    | /recipe/all                 | No        |                                                                                                            |                           |
| Random recipe      | GET    | /recipe/random              | No        |                                                                                                            |                           |
| My recipes         | GET    | /recipe/my-recipes          | Yes       |                                                                                                            |                           |
| Recipe detail      | GET    | /recipe/:recipeId           | Yes       |                                                                                                            |                           |
| Edit recipe        | GET    | /recipe/edit/:recipeId      | Yes       |                                                                                                            | recipe/editRecipe         |
| Edit recipe        | POST   | /recipe/edit/:recipeId      | yes       | { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner } | /recipe/${recipeId}       |
| Profile            | GET    | /profile                    | Yes       |                                                                                                            |                           |
| Edit profile       | GET    | /profile/edit               | Yes       |                                                                                                            |                           |
| Edit profile       | POST   | /profile/edit               | Yes       | { username, firstName, lastName, email, cookingLevel }                                                     | /profile                  |
| Delete profile     | GET    | /profile/delete             | Yes       |                                                                                                            | /auth/signup              |
| Add review         | GET    | /review/new/:recipeId       | Yes       |                                                                                                            |                           |
| Add review         | POST   | /review/new/:recipeId       | Yes       | { title, comment, stars, reviewerName }                                                                    | /recipe/${recipeId}       |
| My reviews         | GET    | /review/my-reviews          | Yes       |                                                                                                            |                           |
| See all reviews    | GET    | /review/all                 | Yes       |                                                                                                            |                           |
| Delete reviews     | GET    | /review/delete/:reviewId    | Yes       |                                                                                                            | /review/all               |
| Other user profile | GET    | /profile/:userId            | Yes       |                                                                                                            |                           |
| My favorites       | GET    | /favorites                  | Yes       |                                                                                                            |                           |
| Add favourite      | GET    | /favorites/add/:recipeId    | Yes       |                                                                                                            | /recipe/${recipeId}       |
| Delete favourite   | GET    | /favorites/delete/:recipeId | Yes       |                                                                                                            | /recipe/${recipeId}       |

---

## Useful links

- [Github Repo](https://github.com/Module-2-project/Module-2-app)
- [Trello kanban]()
- [Deployed version]()
- [Presentation slides](https://www.slides.com)
