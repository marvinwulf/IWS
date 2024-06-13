"use client";

import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false); // Initialize as false for light mode

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="relative w-16 h-8 flex items-center cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
      <div
        className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          darkMode ? "translate-x-8 bg-gray-800" : "bg-gray-200"
        }`}
      ></div>
    </div>
  );
};

export default ThemeToggle;
