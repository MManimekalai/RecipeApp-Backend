const mongoose = require('mongoose');
const Recipe = require('../models/Recipe'); // Adjust the path as needed

require('dotenv').config();

const user1 = '6558de82429c6e10186e74ef'
const user2 = '6558de82429c6e10186e74f0'

const initialRecipes = [
  {
    title: 'Spaghetti Bolognese',
    ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic'],
    instructions: 'Boil the spaghetti; cook the beef with onion and garlic; mix with tomato sauce.',
    preparationTime: 30,
    imageUrl: 'https://example.com/spaghetti.jpg',
    category: 'Pasta',
    tags: ['Italian', 'Dinner'],
    owner: user1, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Chicken Stir-Fry',
    ingredients: ['chicken breast', 'vegetables', 'soy sauce', 'ginger', 'garlic'],
    instructions: 'Stir-fry chicken and vegetables; add soy sauce, ginger, and garlic.',
    preparationTime: 25,
    imageUrl: 'https://example.com/stir-fry.jpg',
    category: 'Asian',
    tags: ['Healthy', 'Quick'],
    owner: 'user1', // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Margherita Pizza',
    ingredients: ['pizza dough', 'tomato sauce', 'fresh mozzarella', 'fresh basil'],
    instructions: 'Spread tomato sauce on the dough; add slices of fresh mozzarella and fresh basil; bake until crust is golden.',
    preparationTime: 20,
    imageUrl: 'https://example.com/margherita-pizza.jpg',
    category: 'Pizza',
    tags: ['Italian', 'Vegetarian'],
    owner: 'user1', // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Chocolate Chip Cookies',
    ingredients: ['butter', 'sugar', 'flour', 'chocolate chips', 'vanilla extract'],
    instructions: 'Cream together butter and sugar; mix in flour, chocolate chips, and vanilla; bake until golden brown.',
    preparationTime: 15,
    imageUrl: 'https://example.com/chocolate-chip-cookies.jpg',
    category: 'Dessert',
    tags: ['Baking', 'Sweet'],
    owner: 'user1', // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Chicken Alfredo Pasta',
    ingredients: ['fettuccine', 'chicken breast', 'heavy cream', 'parmesan cheese', 'garlic'],
    instructions: 'Cook fettuccine; sauté chicken and garlic; add heavy cream and parmesan cheese; mix with pasta.',
    preparationTime: 35,
    imageUrl: 'https://example.com/chicken-alfredo-pasta.jpg',
    category: 'Pasta',
    tags: ['Creamy', 'Dinner'],
    owner: 'user1', // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Vegetable Stir-Fry',
    ingredients: ['mixed vegetables', 'tofu', 'soy sauce', 'sesame oil', 'ginger'],
    instructions: 'Stir-fry mixed vegetables and tofu; add soy sauce, sesame oil, and ginger; serve over rice.',
    preparationTime: 30,
    imageUrl: 'https://example.com/vegetable-stir-fry.jpg',
    category: 'Vegetarian',
    tags: ['Healthy', 'Quick'],
    owner: 'user1', // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74ef',
  },
  {
    title: 'Classic Caesar Salad',
    ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese', 'Caesar dressing'],
    instructions: 'Toss together romaine lettuce, croutons, and parmesan cheese; drizzle with Caesar dressing.',
    preparationTime: 15,
    imageUrl: 'https://example.com/caesar-salad.jpg',
    category: 'Salad',
    tags: ['Light', 'Lunch'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
  {
    title: 'Beef Tacos',
    ingredients: ['ground beef', 'taco seasoning', 'tortillas', 'lettuce', 'tomato'],
    instructions: 'Brown ground beef; mix in taco seasoning; fill tortillas with beef, lettuce, and tomato.',
    preparationTime: 25,
    imageUrl: 'https://example.com/beef-tacos.jpg',
    category: 'Mexican',
    tags: ['Spicy', 'Dinner'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
  {
    title: 'Mango Salsa',
    ingredients: ['mango', 'red onion', 'cilantro', 'lime juice', 'jalapeño'],
    instructions: 'Dice mango, red onion, and jalapeño; mix with chopped cilantro and lime juice; chill before serving.',
    preparationTime: 15,
    imageUrl: 'https://example.com/mango-salsa.jpg',
    category: 'Appetizer',
    tags: ['Fresh', 'Summer'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
  {
    title: 'Spinach and Feta Stuffed Chicken',
    ingredients: ['chicken breast', 'spinach', 'feta cheese', 'garlic', 'olive oil'],
    instructions: 'Butterfly chicken breast; stuff with spinach, feta, and minced garlic; roast with olive oil.',
    preparationTime: 40,
    imageUrl: 'https://example.com/spinach-feta-chicken.jpg',
    category: 'Chicken',
    tags: ['Savory', 'Dinner'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
  {
    title: 'Berry Smoothie Bowl',
    ingredients: ['mixed berries', 'banana', 'yogurt', 'granola', 'honey'],
    instructions: 'Blend berries, banana, and yogurt; pour into a bowl; top with granola and drizzle with honey.',
    preparationTime: 10,
    imageUrl: 'https://example.com/berry-smoothie-bowl.jpg',
    category: 'Breakfast',
    tags: ['Healthy', 'Refreshing'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
  {
    title: 'Vegetarian Chili',
    ingredients: ['black beans', 'kidney beans', 'tomatoes', 'bell peppers', 'chili powder'],
    instructions: 'Combine beans, tomatoes, bell peppers, and chili powder; simmer until flavors meld.',
    preparationTime: 35,
    imageUrl: 'https://example.com/vegetarian-chili.jpg',
    category: 'Vegetarian',
    tags: ['Hearty', 'Comfort Food'],
    owner: user2, // Replace with the ID of an existing user
    createdBy: '6558de82429c6e10186e74f0',
  },
];

// Connect to the database
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to the database');

    // Insert the initial recipes into the database
    await Recipe.insertMany(initialRecipes);
  })
  .then(() => {
    console.log('Initial recipes inserted.');
  })
  .catch((err) => {
    console.error('Error inserting initial recipes:', err);
  })
  .finally(() => {
    // Close the database connection when done
    mongoose.connection.close();
  });
