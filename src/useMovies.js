import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovies() {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Error occurred while fetching movies!");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found!");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      getMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
