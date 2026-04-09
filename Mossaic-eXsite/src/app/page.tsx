"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Force light mode on initial load
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("nx-theme", "light");
  }, []);

  const toggleTheme = () => {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nx-theme", next);
  };

  return (
    <main>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <HeroSection />
      <Footer />
    </main>
  );
}
