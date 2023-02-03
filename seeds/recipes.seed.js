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
    lactose: false,
    gluten: true,
    meat: true,
    level: "Grandma",
    pax: 8,
    ingredients: "800gr of ground beef, bread crumbs, 5 eggs, 1 onion, ketchup, Worcestershire sauce, salt, pepper",
    steps: "Preheat oven to 350 degrees F. In a large bowl, combine ground beef, bread crumbs, eggs, onion, ketchup, Worcestershire sauce, salt, and pepper. Place mixture in a loaf pan and bake for 60 minutes. Let cool for 10 minutes before slicing and serving.",
    owner: "63dc12f2c6f8b6d08ecc248c"
  },
  {
    name: "Grandma's Chicken Noodle Soup",
    image: "https://www.example.com/chicken-noodle-soup.jpg",
    time: 90,
    cuisine: "American",
    kcal: 540,
    spices: "Mild",
    lactose: false,
    gluten: false,
    meat: true,
    level: "Grandma",
    pax: 6,
    ingredients: "600gr of chicken breasts, 2 onion, 3 carrots, 50gr of celery, garlic, thyme, bay leaves, 300gr of egg noodles, salt, pepper",
    steps: "In a large pot, sauté onion, carrots, celery, and garlic until softened. Add chicken breasts, thyme, bay leaves, and enough water to cover. Bring to a boil, then reduce heat and simmer for 60 minutes. Remove chicken breasts and shred meat. Return meat to pot and add egg noodles. Cook for an additional 15 minutes. Season with salt and pepper before serving.",
    owner: "63dc12f2c6f8b6d08ecc248c"
  },
  {
    name: "Grandma's Apple Pie",
    image: "https://www.example.com/apple-pie.jpg",
    time: 120,
    cuisine: "American",
    kcal: 400,
    spices: "Mild",
    lactose: true,
    gluten: true,
    meat: false,
    level: "Grandma",
    pax: 8,
    ingredients: "Pie crust, 450gr of flour, 150gr of sugar, cinnamon, 75gr of butter, 4 Granny Smith apples",
    steps: "Preheat oven to 375 degrees F. Roll out pie crust and place in 9 inch pie dish. In a separate bowl, mix together flour, sugar, and cinnamon. Peel and thinly slice apples and toss in flour mixture. Arrange apple slices in pie crust and dot with butter. Roll out remaining pie crust and place on top of apples. Crimp edges and cut slits in top crust. Bake for 60 minutes, or until crust is golden brown.",
    owner: "63dc12f2c6f8b6d08ecc248c"
  },
  {
    name: "Arroz con Pollo",
    image: "https://www.example.com/images/arrozconpollo.jpg",
    time: 60,
    cuisine: "Colombian",
    kcal: 510,
    spices: "Medium",
    lactose: false,
    gluten: false,
    meat: true,
    level: "Grandma",
    pax: 4,
    ingredients: "500gr of chicken, 250gr of rice, 1 onion, Garlic, Olive oil, chicken broth, 100gr of peas, 2 carrots, Saffron",
    steps: "In a large pot, heat olive oil and sauté onion and garlic. Add chicken and cook until browned. Add rice and sauté for 2 minutes. Add chicken broth, peas, carrots, saffron and bring to a boil. Reduce heat and cover, simmer for 20 minutes. Remove from heat and let stand for 10 minutes. Serve and enjoy!",
    owner: "63dc12f2c6f8b6d08ecc248c"
  },
  {
    name: "Moussaka",
    image: "https://www.example.com/images/moussaka.jpg",
    time: 120,
    cuisine: "Greek",
    kcal: 490,
    spices: "Medium",
    lactose: true,
    gluten: false,
    meat: true,
    level: "Grandma",
    pax: 6,
    ingredients: "2 eggplant, 500gr of ground beef, 2 onions, Garlic, 3 tomatoes, Parsley, Basil, Thyme, Bay leaves, Salt, Pepper, Nutmeg, 100mL of milk, 200gr of flour, 3 eggs, Parmesan cheese, Mozzarella cheese",
    steps: "Preheat oven to 375 degrees F. Peel and slice eggplant. Salt eggplant slices and let sit for 30 minutes. In a large skillet, brown ground beef with onions and garlic. Add tomatoes, parsley, basil, thyme, bay leaves, salt, pepper and nutmeg and cook for 10 minutes. In a separate bowl, mix together milk, flour and eggs. In a 9x13 inch baking dish, layer eggplant slices, meat mixture, and milk mixture. Top with Parmesan cheese and mozzarella cheese. Bake in preheated oven for 45 minutes. Let cool for 10 minutes before serving.",
    owner: "63dc12f2c6f8b6d08ecc248c"
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