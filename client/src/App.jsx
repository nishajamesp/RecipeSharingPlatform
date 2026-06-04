import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from './components/Header';
import Footer from './components/Footer';
import RecipeDetails from "./pages/RecipeDetails";
import Favourites from './pages/Favourites';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./pages/AddRecipe";

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
