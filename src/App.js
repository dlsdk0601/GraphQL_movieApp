import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./routes/Movies";
import Movie from "./routes/Movie";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<Movie />} />
      </Routes>
    </BrowserRouter>
  );
}

// ph-pages를 위해서 나중에 package.json에 적어야할 항목
// "homepage": "https://dlsdk0601.github.io/GraphQL_movieApp"
