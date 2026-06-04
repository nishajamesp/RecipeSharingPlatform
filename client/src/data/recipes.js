const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
    cuisine: "Italian",
    diet: "Non-Veg",
    difficulty: "Medium",
    cookingTime: 30,
    rating: 4.8,
    description: "Classic Roman pasta with eggs, cheese, pancetta and black pepper.",
    ingredients: [
      "400g spaghetti", "200g pancetta", "4 egg yolks", "100g Pecorino Romano",
      "100g Parmesan", "Black pepper", "Salt"
    ],
    steps: [
      "Boil spaghetti in salted water until al dente.",
      "Fry pancetta until crispy.",
      "Mix egg yolks with grated cheese and pepper.",
      "Combine hot pasta with pancetta, remove from heat.",
      "Add egg mixture and toss quickly. Serve immediately."
    ],
    timerSeconds: 1800
  },
  {
    id: 2,
    title: "Avocado Toast",
    image: "https://www.allrecipes.com/thmb/8NccFzsaq0_OZPDKmf7Yee-aG78=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AvocadoToastwithEggFranceC4x3-bb87e3bbf1944657b7db35f1383fabdb.jpg",
    cuisine: "American",
    diet: "Vegan",
    difficulty: "Easy",
    cookingTime: 10,
    rating: 4.5,
    description: "Creamy mashed avocado on toasted sourdough with toppings.",
    ingredients: [
      "2 slices sourdough bread", "1 ripe avocado", "Lemon juice",
      "Salt & pepper", "Chili flakes", "Cherry tomatoes"
    ],
    steps: [
      "Toast the bread until golden.",
      "Mash avocado with lemon juice, salt and pepper.",
      "Spread onto toast.",
      "Top with cherry tomatoes and chili flakes."
    ],
    timerSeconds: 600
  },
  {
    id: 3,
    title: "Chicken Tikka Masala",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    cuisine: "Indian",
    diet: "Non-Veg",
    difficulty: "Hard",
    cookingTime: 60,
    rating: 4.9,
    description: "Tender chicken in a rich, spiced tomato-cream sauce.",
    ingredients: [
      "500g chicken breast", "1 cup yogurt", "2 tbsp tikka masala paste",
      "400ml tomato sauce", "200ml heavy cream", "1 onion", "Garlic", "Ginger"
    ],
    steps: [
      "Marinate chicken in yogurt and spices for 1 hour.",
      "Grill or pan-fry chicken until charred.",
      "Sauté onion, garlic and ginger.",
      "Add tomato sauce and simmer 15 mins.",
      "Add cream and chicken. Simmer 10 more mins."
    ],
    timerSeconds: 3600
  },
  {
    id: 4,
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500",
    cuisine: "Greek",
    diet: "Vegetarian",
    difficulty: "Easy",
    cookingTime: 15,
    rating: 4.4,
    description: "Fresh cucumbers, tomatoes, olives and feta with olive oil dressing.",
    ingredients: [
      "2 cucumbers", "4 tomatoes", "1 red onion", "200g feta cheese",
      "100g black olives", "Olive oil", "Oregano", "Salt"
    ],
    steps: [
      "Chop cucumbers, tomatoes and onion into chunks.",
      "Add olives and crumbled feta.",
      "Drizzle with olive oil.",
      "Season with oregano and salt. Toss and serve."
    ],
    timerSeconds: 900
  },
  {
    id: 5,
    title: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
    cuisine: "Mexican",
    diet: "Non-Veg",
    difficulty: "Easy",
    cookingTime: 25,
    rating: 4.7,
    description: "Spiced ground beef in crispy shells with fresh salsa and sour cream.",
    ingredients: [
      "500g ground beef", "Taco shells", "1 onion", "2 cloves garlic",
      "Taco seasoning", "Salsa", "Sour cream", "Cheddar cheese", "Lettuce"
    ],
    steps: [
      "Brown ground beef with onion and garlic.",
      "Add taco seasoning and a splash of water.",
      "Simmer until sauce thickens.",
      "Fill taco shells and top with salsa, cheese, sour cream."
    ],
    timerSeconds: 1500
  },
  {
    id: 6,
    title: "Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
    cuisine: "Chinese",
    diet: "Vegan",
    difficulty: "Easy",
    cookingTime: 20,
    rating: 4.3,
    description: "Colourful vegetables tossed in a savory soy-ginger sauce.",
    ingredients: [
      "Broccoli", "Bell peppers", "Snap peas", "Carrots", "3 tbsp soy sauce",
      "1 tbsp sesame oil", "Ginger", "Garlic", "Cornstarch"
    ],
    steps: [
      "Heat oil in a wok on high heat.",
      "Add garlic and ginger, stir 30 seconds.",
      "Add hard vegetables first, then soft ones.",
      "Mix soy sauce and cornstarch, pour over.",
      "Toss until glossy and serve with rice."
    ],
    timerSeconds: 1200
  },
  {
    id: 7,
    title: "Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
    cuisine: "American",
    diet: "Vegetarian",
    difficulty: "Easy",
    cookingTime: 20,
    rating: 4.6,
    description: "Fluffy buttermilk pancakes with maple syrup and fresh berries.",
    ingredients: [
      "1.5 cups flour", "2 tbsp sugar", "1 tsp baking powder",
      "1 cup buttermilk", "2 eggs", "2 tbsp butter", "Maple syrup", "Berries"
    ],
    steps: [
      "Mix dry ingredients in one bowl.",
      "Whisk wet ingredients in another.",
      "Combine both — don't over-mix, lumps are okay.",
      "Pour ladlefuls onto a buttered pan.",
      "Cook until bubbles form, flip and cook 1 more minute."
    ],
    timerSeconds: 1200
  },
  {
    id: 8,
    title: "Miso Ramen",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
    cuisine: "Japanese",
    diet: "Vegetarian",
    difficulty: "Medium",
    cookingTime: 40,
    rating: 4.8,
    description: "Rich miso broth with noodles, soft-boiled egg and toppings.",
    ingredients: [
      "Ramen noodles", "3 tbsp white miso", "1L vegetable broth",
      "Soy sauce", "Sesame oil", "Soft boiled eggs", "Nori", "Spring onions", "Corn"
    ],
    steps: [
      "Bring broth to a simmer.",
      "Whisk in miso paste until dissolved.",
      "Add soy sauce and sesame oil.",
      "Cook noodles separately, place in bowl.",
      "Pour broth over, top with egg, nori and spring onions."
    ],
    timerSeconds: 2400
  }
];

export default recipes;