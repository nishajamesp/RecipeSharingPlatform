import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import Recipe from "../models/Recipe.js";

const rawRecipes = [
  {
    title: "Spaghetti Carbonara",
    sourceImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    cuisine: "Italian", diet: "Non-Veg", difficulty: "Medium", cookingTime: 30, rating: 4.8,
    description: "Classic Roman pasta with eggs, cheese, pancetta and black pepper.",
    ingredients: ["400g spaghetti","200g pancetta","4 egg yolks","100g Pecorino Romano","100g Parmesan","Black pepper","Salt"],
    steps: ["Boil spaghetti in salted water until al dente.","Fry pancetta until crispy.","Mix egg yolks with grated cheese and pepper.","Combine hot pasta with pancetta, remove from heat.","Add egg mixture and toss quickly. Serve immediately."],
    timerSeconds: 1800,
  },
  {
    title: "Avocado Toast",
    sourceImage: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800",
    cuisine: "American", diet: "Vegan", difficulty: "Easy", cookingTime: 10, rating: 4.5,
    description: "Creamy mashed avocado on toasted sourdough with toppings.",
    ingredients: ["2 slices sourdough bread","1 ripe avocado","Lemon juice","Salt & pepper","Chili flakes","Cherry tomatoes"],
    steps: ["Toast the bread until golden.","Mash avocado with lemon juice, salt and pepper.","Spread onto toast.","Top with cherry tomatoes and chili flakes."],
    timerSeconds: 600,
  },
  {
    title: "Chicken Tikka Masala",
    sourceImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    cuisine: "Indian", diet: "Non-Veg", difficulty: "Hard", cookingTime: 60, rating: 4.9,
    description: "Tender chicken in a rich, spiced tomato-cream sauce.",
    ingredients: ["500g chicken breast","1 cup yogurt","2 tbsp tikka masala paste","400ml tomato sauce","200ml heavy cream","1 onion","Garlic","Ginger"],
    steps: ["Marinate chicken in yogurt and spices for 1 hour.","Grill or pan-fry chicken until charred.","Saute onion, garlic and ginger until golden.","Add tomato sauce and simmer for 15 minutes.","Stir in cream and grilled chicken. Simmer 10 more minutes and serve."],
    timerSeconds: 3600,
  },
  {
    title: "Greek Salad",
    sourceImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
    cuisine: "Greek", diet: "Veg", difficulty: "Easy", cookingTime: 15, rating: 4.4,
    description: "Fresh cucumbers, tomatoes, olives and feta with olive oil dressing.",
    ingredients: ["2 cucumbers","4 tomatoes","1 red onion","200g feta cheese","100g black olives","3 tbsp olive oil","1 tsp dried oregano","Salt"],
    steps: ["Chop cucumbers, tomatoes and red onion into chunky pieces.","Place in a large bowl with black olives.","Crumble feta cheese on top.","Drizzle generously with olive oil.","Sprinkle oregano and salt. Toss lightly and serve."],
    timerSeconds: 900,
  },
  {
    title: "Beef Tacos",
    sourceImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    cuisine: "Mexican", diet: "Non-Veg", difficulty: "Easy", cookingTime: 25, rating: 4.7,
    description: "Spiced ground beef in crispy shells with fresh salsa and sour cream.",
    ingredients: ["500g ground beef","8 taco shells","1 onion","2 cloves garlic","2 tbsp taco seasoning","Salsa","Sour cream","Cheddar cheese","Shredded lettuce"],
    steps: ["Heat oil in a pan and sauté diced onion and garlic until soft.","Add ground beef and cook until browned, breaking it apart.","Stir in taco seasoning with a splash of water and simmer 5 minutes.","Warm taco shells in the oven for 3 minutes.","Fill shells with beef and top with salsa, cheese, sour cream and lettuce."],
    timerSeconds: 1500,
  },
  {
    title: "Vegetable Stir Fry",
    sourceImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    cuisine: "Chinese", diet: "Vegan", difficulty: "Easy", cookingTime: 20, rating: 4.3,
    description: "Colourful vegetables tossed in a savory soy-ginger sauce.",
    ingredients: ["1 cup broccoli florets","1 bell pepper sliced","1 cup snap peas","2 carrots sliced","3 tbsp soy sauce","1 tbsp sesame oil","1 tsp fresh ginger","2 cloves garlic","1 tsp cornstarch"],
    steps: ["Mix soy sauce, sesame oil and cornstarch in a small bowl and set aside.","Heat a wok or large pan on high heat with a splash of oil.","Add garlic and ginger, stir fry for 30 seconds until fragrant.","Add carrots and broccoli first, stir fry for 3 minutes.","Add bell pepper and snap peas, pour the sauce over, toss until glossy and serve with rice."],
    timerSeconds: 1200,
  },
  {
    title: "Pancakes",
    sourceImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    cuisine: "American", diet: "Veg", difficulty: "Easy", cookingTime: 20, rating: 4.6,
    description: "Fluffy buttermilk pancakes with maple syrup and fresh berries.",
    ingredients: ["1.5 cups all-purpose flour","2 tbsp sugar","1 tsp baking powder","0.5 tsp baking soda","1 cup buttermilk","2 eggs","2 tbsp melted butter","Maple syrup","Fresh berries"],
    steps: ["Whisk flour, sugar, baking powder and baking soda in a large bowl.","In another bowl beat eggs, buttermilk and melted butter together.","Pour wet ingredients into dry and stir gently — lumps are okay, do not overmix.","Heat a non-stick pan over medium heat and lightly butter it.","Pour ladlefuls of batter, cook until bubbles form on surface, flip and cook 1 more minute. Serve with maple syrup and berries."],
    timerSeconds: 1200,
  },
  {
    title: "Miso Ramen",
    sourceImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    cuisine: "Japanese", diet: "Veg", difficulty: "Medium", cookingTime: 40, rating: 4.8,
    description: "Rich miso broth with noodles, soft-boiled egg and toppings.",
    ingredients: ["200g ramen noodles","3 tbsp white miso paste","1L vegetable broth","2 tbsp soy sauce","1 tbsp sesame oil","2 soft boiled eggs","2 sheets nori","Spring onions","Sweet corn"],
    steps: ["Bring vegetable broth to a gentle simmer in a pot.","Whisk miso paste into the broth until fully dissolved — do not boil.","Add soy sauce and sesame oil, taste and adjust seasoning.","Cook ramen noodles separately according to packet, drain and divide into bowls.","Pour hot miso broth over noodles and top with halved soft-boiled egg, nori, corn and spring onions."],
    timerSeconds: 2400,
  },

  // ── 3 NEW RECIPES ──────────────────────────────────────────────────────────

  {
    title: "Pad Thai",
    sourceImage: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    cuisine: "Thai", diet: "Non-Veg", difficulty: "Medium", cookingTime: 25, rating: 4.7,
    description: "Stir-fried rice noodles with shrimp, egg, peanuts and tangy tamarind sauce.",
    ingredients: [
      "200g flat rice noodles",
      "200g shrimp, peeled and deveined",
      "2 eggs",
      "3 tbsp tamarind paste",
      "2 tbsp fish sauce",
      "1 tbsp sugar",
      "2 cloves garlic, minced",
      "3 spring onions, chopped",
      "1 cup bean sprouts",
      "4 tbsp roasted peanuts, crushed",
      "1 lime, cut into wedges",
      "2 tbsp vegetable oil",
    ],
    steps: [
      "Soak rice noodles in warm water for 20 minutes until pliable, then drain.",
      "Mix tamarind paste, fish sauce and sugar in a small bowl to make the sauce.",
      "Heat oil in a wok over high heat. Add garlic and shrimp, stir fry for 2 minutes until shrimp turns pink.",
      "Push shrimp to one side, crack in the eggs and scramble until just set, then mix with the shrimp.",
      "Add drained noodles and pour the sauce over. Toss everything together for 2 minutes.",
      "Add bean sprouts and spring onions, toss for 1 more minute.",
      "Serve topped with crushed peanuts and a wedge of lime on the side.",
    ],
    timerSeconds: 1500,
  },
  {
    title: "Chocolate Lava Cake",
    sourceImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    cuisine: "American", diet: "Veg", difficulty: "Medium", cookingTime: 20, rating: 4.9,
    description: "Warm individual chocolate cakes with a gooey molten center, served with vanilla ice cream.",
    ingredients: [
      "200g dark chocolate (70%)",
      "100g unsalted butter",
      "3 whole eggs",
      "3 egg yolks",
      "80g caster sugar",
      "40g all-purpose flour",
      "1 tsp vanilla extract",
      "Pinch of salt",
      "Butter and cocoa powder for greasing ramekins",
      "Vanilla ice cream to serve",
    ],
    steps: [
      "Preheat oven to 200°C (390°F). Butter 4 ramekins and dust with cocoa powder.",
      "Melt dark chocolate and butter together in a heatproof bowl over a pot of simmering water, stirring until smooth. Remove from heat.",
      "In a separate bowl whisk eggs, egg yolks and sugar together until pale and slightly thickened.",
      "Fold the egg mixture into the melted chocolate, then sift in flour, vanilla and salt. Fold gently until just combined.",
      "Divide the batter equally among the 4 prepared ramekins.",
      "Bake for exactly 12 minutes — the edges should be set but the center should still wobble.",
      "Run a knife around the edge, invert onto a plate immediately and serve with a scoop of vanilla ice cream.",
    ],
    timerSeconds: 720,
  },
  {
    title: "Butter Chicken",
    sourceImage: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
    cuisine: "Indian", diet: "Non-Veg", difficulty: "Hard", cookingTime: 50, rating: 4.9,
    description: "Tender chicken in a velvety, mildly spiced tomato and butter sauce — India's most loved curry.",
    ingredients: [
      "600g chicken thighs, cut into pieces",
      "1 cup plain yogurt",
      "2 tsp tandoori masala",
      "1 tsp turmeric",
      "3 tbsp butter",
      "1 large onion, finely chopped",
      "4 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "400g tomato puree",
      "1 tsp garam masala",
      "1 tsp cumin",
      "1 tsp chili powder",
      "150ml heavy cream",
      "Salt to taste",
      "Fresh coriander to garnish",
    ],
    steps: [
      "Marinate chicken in yogurt, tandoori masala and turmeric for at least 30 minutes (overnight is best).",
      "Grill or pan-fry marinated chicken on high heat until charred on the outside. Set aside.",
      "Melt butter in a large pan over medium heat. Add onion and cook for 8 minutes until golden.",
      "Add garlic and ginger, cook for 2 minutes, then add cumin, chili powder and garam masala. Stir for 1 minute.",
      "Pour in tomato puree and simmer for 15 minutes until the sauce thickens and the butter starts to separate.",
      "Add the grilled chicken pieces and stir to coat in the sauce. Simmer for 10 minutes.",
      "Stir in heavy cream, season with salt and simmer for 3 more minutes. Garnish with coriander and serve with naan or rice.",
    ],
    timerSeconds: 3000,
  },
];

const seedDB = async () => {
  await connectDB();
  console.log("Clearing old recipes...");
  await Recipe.deleteMany({});
  console.log("Uploading images to Cloudinary...\n");
  const recipes = [];
  for (const r of rawRecipes) {
    process.stdout.write("  Uploading: " + r.title + "...");
    try {
      const result = await cloudinary.uploader.upload(r.sourceImage, {
        folder: "recipehub",
        transformation: [{ width: 800, height: 600, crop: "fill" }],
      });
      const { sourceImage, ...rest } = r;
      recipes.push({ ...rest, image: result.secure_url });
      console.log(" ✅");
    } catch (err) {
      console.log(" ❌ " + err.message + " (keeping original URL)");
      const { sourceImage, ...rest } = r;
      recipes.push({ ...rest, image: sourceImage });
    }
  }
  await Recipe.insertMany(recipes);
  console.log("\n✅ Seeded " + recipes.length + " recipes successfully");
  process.exit(0);
};

seedDB();
