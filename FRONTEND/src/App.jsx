import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [preference, setPreference] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!preference.trim()) {
      setError("Please enter your movie preference.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMovies([]);

      const response = await axios.post("https://movie-recommendation-app-ux4f.onrender.com/api/recommend", {
        userInput: preference,
      });

      setMovies(response.data.recommendations);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>AI Movie Recommendation</h1>
        <p>Tell us what kind of movie you want to watch.</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="Example: comedy movies with college life"
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Finding Movies..." : "Get Recommendations"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="movie-list">
          {movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <h3>{movie.title}</h3>
              <p>
                <strong>Year:</strong> {movie.year}
              </p>
              <p>{movie.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;