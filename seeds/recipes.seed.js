const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.1qqscwt.mongodb.net/module2DB';
const Recipe = require("../models/Recipe");

const recipes = [
  {
    name: "Grandma's Famous Meatloaf",
    image: "https://www.example.com/meatloaf.jpg",
    time: 60,
    cuisine: "American",
    kcal: 460,
    spices: "Mild",
    lactose: "No",
    gluten: "Yes",
    meat: "No",
    level: "Grandma",
    pax: 8,
    ingredients: "Ground beef, bread crumbs, eggs, onion, ketchup, Worcestershire sauce, salt, pepper",
    steps: "1. Preheat oven to 350 degrees F. 2. In a large bowl, combine ground beef, bread crumbs, eggs, onion, ketchup, Worcestershire sauce, salt, and pepper. 3. Place mixture in a loaf pan and bake for 60 minutes. 4. Let cool for 10 minutes before slicing and serving.",
    username: "63da62e3e9a73a211e3a198a"
  },
  {
    name: "Grandma's Chicken Noodle Soup",
    image: "https://www.example.com/chicken-noodle-soup.jpg",
    time: 90,
    cuisine: "American",
    kcal: 540,
    spices: "Mild",
    lactose: "No",
    gluten: "No",
    meat: "No",
    level: "Grandma",
    pax: 6,
    ingredients: "Chicken breasts, onion, carrots, celery, garlic, thyme, bay leaves, egg noodles, salt, pepper",
    steps: "1. In a large pot, sauté onion, carrots, celery, and garlic until softened. 2. Add chicken breasts, thyme, bay leaves, and enough water to cover. 3. Bring to a boil, then reduce heat and simmer for 60 minutes. 4. Remove chicken breasts and shred meat. 5. Return meat to pot and add egg noodles. 6. Cook for an additional 15 minutes. 7. Season with salt and pepper before serving.",
    username: "63da62e3e9a73a211e3a198a"
  },
  {
    name: "Grandma's Apple Pie",
    image: "https://www.example.com/apple-pie.jpg",
    time: 120,
    cuisine: "American",
    kcal: 400,
    spices: "Mild",
    lactose: "Yes",
    gluten: "Yes",
    meat: "No",
    level: "Grandma",
    pax: 8,
    ingredients: "Pie crust, flour, sugar, cinnamon, butter, Granny Smith apples",
    steps: "1. Preheat oven to 375 degrees F. 2. Roll out pie crust and place in 9 inch pie dish. 3. In a separate bowl, mix together flour, sugar, and cinnamon. 4. Peel and thinly slice apples and toss in flour mixture. 5. Arrange apple slices in pie crust and dot with butter. 6. Roll out remaining pie crust and place on top of apples. 7. Crimp edges and cut slits in top crust. 8. Bake for 60 minutes, or until crust is golden brown.",
    username: "63da62e3e9a73a211e3a198a"
  },
  {
    name: "Arroz con Pollo",
    image: "https://www.example.com/images/arrozconpollo.jpg",
    time: 60,
    cuisine: "Colombian",
    kcal: 510,
    spices: "Medium",
    lactose: "No",
    gluten: "No",
    meat: "No",
    level: "Grandma",
    pax: 4,
    ingredients: "Chicken, Rice, Onion, Garlic, Olive oil, Chicken broth, Peas, Carrots, Saffron",
    steps: "1. In a large pot, heat olive oil and sauté onion and garlic. 2. Add chicken and cook until browned. 3. Add rice and sauté for 2 minutes. 4. Add chicken broth, peas, carrots, saffron and bring to a boil. 5. Reduce heat and cover, simmer for 20 minutes. 6. Remove from heat and let stand for 10 minutes. 7. Serve and enjoy!",
    username: "63da62e3e9a73a211e3a198a"
  },
  {
    name: "Moussaka",
    image: "https://www.example.com/images/moussaka.jpg",
    time: 120,
    cuisine: "Greek",
    kcal: 490,
    spices: "Medium",
    lactose: "Yes",
    gluten: "No",
    meat: "No",
    level: "Grandma",
    pax: 6,
    ingredients: "Eggplant, Ground beef, Onions, Garlic, Tomatoes, Parsley, Basil, Thyme, Bay leaves, Salt, Pepper, Nutmeg, Milk, Flour, Eggs, Parmesan cheese, Mozzarella cheese",
    steps: "1. Preheat oven to 375 degrees F. 2. Peel and slice eggplant. Salt eggplant slices and let sit for 30 minutes. 3. In a large skillet, brown ground beef with onions and garlic. 4. Add tomatoes, parsley, basil, thyme, bay leaves, salt, pepper and nutmeg. Cook for 10 minutes. 5. In a separate bowl, mix together milk, flour and eggs. 6. In a 9x13 inch baking dish, layer eggplant slices, meat mixture, and milk mixture. 7. Top with Parmesan cheese and mozzarella cheese. 8. Bake in preheated oven for 45 minutes. 9. Let cool for 10 minutes before serving.",
    username: "63da62e3e9a73a211e3a198a"
  }
];

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo for seeding! Database name: "${x.connections[0].name}"`);
  })
  .then(() => 
    Recipe.deleteMany({})
  )
  .then(() => 
   Recipe.create(recipes)
  )
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  module.exports = recipes;