import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createRecipe, resetCreateStatus } from "../redux/recipeSlice";
import { FaUpload, FaPlus, FaTrash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const CUISINES = ["Italian","Indian","Chinese","Japanese","Mexican","American","Greek","Thai","French","Other"];
const DIETS    = ["Veg","Vegan","Non-Veg"];
const DIFFS    = ["Easy","Medium","Hard"];

export default function AddRecipe() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // ── Pull state from Redux (no local loading/error needed) ──
  const { creating, createSuccess, createError } = useSelector((state) => state.recipes);

  const [form, setForm] = useState({
    title: "", cuisine: "Italian", diet: "Veg", difficulty: "Easy",
    cookingTime: "", rating: "", description: "", timerSeconds: "",
  });
  const [ingredients, setIngredients]   = useState([""]);
  const [steps, setSteps]               = useState([""]);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError]     = useState("");

  // ── Redirect to home when Redux reports success ────────────
  useEffect(() => {
    if (createSuccess) {
      dispatch(resetCreateStatus());
      navigate("/");
    }
  }, [createSuccess]);

  // ── Clean up Redux flags when leaving the page ─────────────
  useEffect(() => {
    return () => dispatch(resetCreateStatus());
  }, []);

  // ── Guard: not logged in ────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-lg font-medium mb-4">Please login to add a recipe.</p>
        <button onClick={() => navigate("/login")}
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">
          Go to Login
        </button>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setLocalError("");
  };

  const updateIngredient = (i, val) => {
    const updated = [...ingredients]; updated[i] = val; setIngredients(updated);
  };
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const updateStep = (i, val) => {
    const updated = [...steps]; updated[i] = val; setSteps(updated);
  };
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  // ── Submit → build FormData → dispatch createRecipe thunk ──
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!imageFile)                         { setLocalError("Please upload a recipe image."); return; }
    if (!form.title.trim())                 { setLocalError("Recipe title is required."); return; }
    if (!form.description.trim())           { setLocalError("Description is required."); return; }
    if (!form.cookingTime)                  { setLocalError("Cooking time is required."); return; }
    const cleanIngredients = ingredients.filter((i) => i.trim() !== "");
    const cleanSteps       = steps.filter((s) => s.trim() !== "");
    if (cleanIngredients.length === 0)      { setLocalError("Add at least one ingredient."); return; }
    if (cleanSteps.length === 0)            { setLocalError("Add at least one step."); return; }

    // Build FormData — backend expects multipart/form-data
    const fd = new FormData();
    fd.append("image",        imageFile);
    fd.append("title",        form.title.trim());
    fd.append("cuisine",      form.cuisine);
    fd.append("diet",         form.diet);
    fd.append("difficulty",   form.difficulty);
    fd.append("cookingTime",  form.cookingTime);
    fd.append("rating",       form.rating || "4.0");
    fd.append("description",  form.description.trim());
    fd.append("timerSeconds", form.timerSeconds || "0");
    // Arrays must be JSON-stringified for FormData
    fd.append("ingredients",  JSON.stringify(cleanIngredients));
    fd.append("steps",        JSON.stringify(cleanSteps));

    // Dispatch the async thunk — Redux handles loading/error/success
    dispatch(createRecipe(fd));
  };

  const displayError = localError || createError;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6 font-medium transition">
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-1">Add New Recipe</h1>
      <p className="text-gray-400 text-sm mb-8">Share your recipe — image is uploaded to Cloudinary automatically.</p>

      {/* Error banner */}
      {displayError && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
          ⚠️ {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Image Upload ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipe Image <span className="text-red-400">*</span>
          </label>
          <div
            onClick={() => document.getElementById("imgInput").click()}
            className={`relative border-2 border-dashed rounded-2xl cursor-pointer flex flex-col items-center justify-center transition
              ${imagePreview ? "border-orange-400 h-56" : "border-gray-300 hover:border-orange-400 h-48 bg-gray-50"}`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <FaUpload className="text-3xl text-orange-400 mb-3" />
                <p className="text-gray-500 text-sm font-medium">Click to upload image</p>
                <p className="text-gray-400 text-xs mt-1">JPG, PNG — will be saved to Cloudinary</p>
              </>
            )}
          </div>
          <input id="imgInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          {imagePreview && (
            <button type="button"
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="mt-2 text-xs text-red-500 hover:underline">
              ✕ Remove image
            </button>
          )}
        </div>

        {/* ── Basic Info ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Recipe Title <span className="text-red-400">*</span>
            </label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Spicy Chicken Curry"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {[
            { label: "Cuisine",    name: "cuisine",    options: CUISINES },
            { label: "Diet",       name: "diet",       options: DIETS },
            { label: "Difficulty", name: "difficulty", options: DIFFS },
          ].map(({ label, name, options }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <select name={name} value={form[name]} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cooking Time (min) <span className="text-red-400">*</span>
            </label>
            <input type="number" name="cookingTime" value={form.cookingTime} onChange={handleChange}
              placeholder="e.g. 30" min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1–5, optional)</label>
            <input type="number" name="rating" value={form.rating} onChange={handleChange}
              placeholder="e.g. 4.5" min="1" max="5" step="0.1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Timer (seconds, optional)</label>
            <input type="number" name="timerSeconds" value={form.timerSeconds} onChange={handleChange}
              placeholder="e.g. 1800 for 30 min" min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Briefly describe your recipe..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
        </div>

        {/* ── Ingredients ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ingredients <span className="text-red-400">*</span>
          </label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-orange-500 font-bold text-sm w-5 text-center shrink-0">{i + 1}.</span>
                <input value={ing} onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder={`e.g. 200g chicken breast`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)}
                    className="text-red-400 hover:text-red-600 transition p-2 shrink-0">
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIngredients([...ingredients, ""])}
            className="mt-3 flex items-center gap-2 text-orange-600 text-sm font-medium hover:text-orange-800 transition">
            <FaPlus size={11} /> Add Ingredient
          </button>
        </div>

        {/* ── Steps ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Instructions <span className="text-red-400">*</span>
          </label>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="mt-2.5 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <textarea value={step} onChange={(e) => updateStep(i, e.target.value)} rows={2}
                  placeholder={`Step ${i + 1} — what to do...`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)}
                    className="mt-2 text-red-400 hover:text-red-600 transition p-2 shrink-0">
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSteps([...steps, ""])}
            className="mt-3 flex items-center gap-2 text-orange-600 text-sm font-medium hover:text-orange-800 transition">
            <FaPlus size={11} /> Add Step
          </button>
        </div>

        {/* ── Submit ── */}
        <button type="submit" disabled={creating}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-3">
          {creating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Uploading to Cloudinary &amp; saving to MongoDB...
            </>
          ) : (
            <>
              <FaCheckCircle /> Publish Recipe
            </>
          )}
        </button>

      </form>
    </div>
  );
}
