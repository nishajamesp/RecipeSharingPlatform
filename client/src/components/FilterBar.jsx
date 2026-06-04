import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, setFilter, resetFilters } from "../redux/recipeSlice";
import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

function FilterBar() {
  const dispatch = useDispatch();
  const { searchTerm, filters } = useSelector((state) => state.recipes);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectClass =
    "text-sm border border-gray-200 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer";

  // ── Voice Search ──────────────────────────────────────────────
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Voice search not supported. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      dispatch(setSearchTerm(transcript));
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        setErrorMsg("Microphone access denied. Please allow mic permission.");
      } else if (event.error === "no-speech") {
        setErrorMsg("No speech detected. Please try again.");
      } else {
        setErrorMsg("Voice search failed. Please try again.");
      }
    };

    recognition.start();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">

      {/* Search bar + mic button */}
      <div className="relative flex items-center w-full md:w-1/2">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search recipes or ingredients..."
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="w-full pl-5 pr-14 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm shadow-sm"
        />

        {/* Mic button */}
        <button
          onClick={handleVoiceSearch}
          title="Search by voice"
          aria-label="Voice search"
          className={`absolute right-2 p-2.5 rounded-full transition ${
            isListening
              ? "bg-red-500 text-white animate-pulse shadow-lg"
              : "bg-orange-100 text-orange-500 hover:bg-orange-200"
          }`}
        >
          <FaMicrophone />
        </button>
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-pulse">
          <FaMicrophone />
          Listening... speak now
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.cuisine}
          onChange={(e) => dispatch(setFilter({ key: "cuisine", value: e.target.value }))}
          className={selectClass}
        >
          {["All","Italian","American","Indian","Greek","Mexican","Chinese","Japanese"].map(
            (c) => <option key={c}>{c}</option>
          )}
        </select>

        <select
          value={filters.diet}
          onChange={(e) => dispatch(setFilter({ key: "diet", value: e.target.value }))}
          className={selectClass}
        >
          {["All", "Vegan", "Vegetarian", "Non-Veg"].map(
            (d) => <option key={d}>{d}</option>
          )}
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => dispatch(setFilter({ key: "difficulty", value: e.target.value }))}
          className={selectClass}
        >
          {["All", "Easy", "Medium", "Hard"].map(
            (d) => <option key={d}>{d}</option>
          )}
        </select>

        <select
          value={filters.time}
          onChange={(e) => dispatch(setFilter({ key: "time", value: e.target.value }))}
          className={selectClass}
        >
          <option value="all">Any Time</option>
          <option value="15">Under 15 min</option>
          <option value="30">Under 30 min</option>
          <option value="60">Under 60 min</option>
        </select>

        <button
          onClick={() => dispatch(resetFilters())}
          className="text-sm text-orange-600 font-medium hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
