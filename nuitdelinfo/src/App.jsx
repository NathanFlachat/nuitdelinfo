import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Decathlon from "./pages/Decathlon";
import Femme from "./pages/Femme";
import Autre from "./pages/Autre";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/decathlon" element={<Decathlon />} />
          <Route path="/femme" element={<Femme />} />
          <Route path="/autre" element={<Autre />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}
