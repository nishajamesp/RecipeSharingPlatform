# 🍴 RecipeHub — MERN Stack Recipe Sharing Platform

A full-stack recipe sharing web application built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse recipes, register an account, add their own recipes with images, and save favourites.

🔗 **Live Demo:** [recipe-sharing-platform-sand-theta.vercel.app](https://recipe-sharing-platform-sand-theta.vercel.app)  
🖥️ **Backend API:** [recipesharingplatform-6tle.onrender.com](https://recipesharingplatform-6tle.onrender.com)

---

## 📸 Features

- 🔍 **Browse Recipes** — search by name or ingredient, filter by cuisine, diet, difficulty and time
- 👤 **Authentication** — register and login with JWT-based auth
- ➕ **Add Recipe** — upload your own recipe with image (stored on Cloudinary)
- ❤️ **Favourites** — save and manage your favourite recipes (per user, synced to MongoDB)
- ⏱️ **Cooking Timer** — interactive countdown timer on each recipe page
- ✅ **Step Tracker** — check off ingredients and steps as you cook
- 📱 **Responsive** — works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Axios | HTTP requests to backend |
| Tailwind CSS | Styling |
| Vite | Build tool |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Multer | File upload handling |

### Deployment
| Service | What's deployed |
|---|---|
| Vercel | React frontend |
| Render | Express backend |
| MongoDB Atlas | Cloud database |
| Cloudinary | Recipe images |

---

## 📁 Project Structure

```
RecipeSharingPlatform/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   └── FilterBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RecipeDetails.jsx
│   │   │   ├── AddRecipe.jsx
│   │   │   ├── Favourites.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── recipeSlice.js
│   │   │   └── favouriteSlice.js
│   │   └── utils/
│   │       └── api.js          # Axios instance with JWT interceptor
│   └── .env
│
└── server/                     # Express backend
    ├── config/
    │   ├── db.js               # MongoDB connection
    │   ├── cloudinary.js       # Cloudinary config
    │   └── env.js              # dotenv loader
    ├── controllers/
    │   ├── authController.js
    │   ├── recipeController.js
    │   └── favouriteController.js
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification
    ├── middlewares/
    │   └── upload.js           # Multer memory storage
    ├── models/
    │   ├── User.js
    │   └── Recipe.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── recipeRoutes.js
    │   └── favouriteRoutes.js
    ├── seed/
    │   └── seedRecipes.js      # Seed 11 recipes with Cloudinary images
    └── server.js
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/recipe-sharing-platform.git
cd recipe-sharing-platform
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipehub
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database with sample recipes:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get logged-in user |

### Recipes
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/recipes` | Public | Get all recipes |
| GET | `/api/recipes/:id` | Public | Get single recipe |
| POST | `/api/recipes` | Protected | Create recipe (with image) |
| DELETE | `/api/recipes/:id` | Protected | Delete recipe |

### Favourites
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/favourites` | Protected | Get user's favourites |
| POST | `/api/favourites/:recipeId` | Protected | Add to favourites |
| DELETE | `/api/favourites/:recipeId` | Protected | Remove from favourites |

---

## 🌐 Deployment

### Deploy Frontend to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Click **Deploy**

### Deploy Backend to Render
1. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo
2. Set **Root Directory** to `server`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `npm start`
5. Add all environment variables from your `server/.env`
6. Click **Deploy**

---

## 🔑 Environment Variables Summary

### Server (`server/.env`)
```
PORT
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Client (`client/.env`)
```
VITE_API_URL
```

---

## 📦 Sample Recipes (Seed Data)

The seed script adds 11 recipes across different cuisines:

| Recipe | Cuisine | Diet | Time |
|---|---|---|---|
| Spaghetti Carbonara | Italian | Non-Veg | 30 min |
| Avocado Toast | American | Vegan | 10 min |
| Chicken Tikka Masala | Indian | Non-Veg | 60 min |
| Greek Salad | Greek | Veg | 15 min |
| Beef Tacos | Mexican | Non-Veg | 25 min |
| Vegetable Stir Fry | Chinese | Vegan | 20 min |
| Pancakes | American | Veg | 20 min |
| Miso Ramen | Japanese | Veg | 40 min |
| Pad Thai | Thai | Non-Veg | 25 min |
| Chocolate Lava Cake | American | Veg | 20 min |
| Butter Chicken | Indian | Non-Veg | 50 min |

---

## 👨‍💻 Author

Built as a MERN stack final project.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
