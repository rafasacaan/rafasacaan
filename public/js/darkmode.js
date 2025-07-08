"use strict";

const DARK_MODE_COLORS = {
  dark: {
    bg: "#141413",
    text: "#f0efea",
  },
  light: {
    bg: "#f0efea",
    text: "#141413",
  },
};

function setDarkMode(isDarkMode, animate = true) {
  // Handle class toggle and color updates in one batch for better performance
  requestAnimationFrame(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
    const colors = isDarkMode ? DARK_MODE_COLORS.dark : DARK_MODE_COLORS.light;

    // Set both properties at once to minimize repaints
    const style = document.documentElement.style;
    style.setProperty("--bg-color", colors.bg);
    style.setProperty("--text-color", colors.text);

    // Update the toggle switch state
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.checked = isDarkMode;
      if (!animate) {
        darkModeToggle.parentElement.classList.add("no-animate");
      }
    }
  });
}

function handleDarkModeToggle() {
  const isDarkMode = document.documentElement.classList.contains("dark-mode");
  const newMode = !isDarkMode;

  // Update localStorage and UI state together
  localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
  setDarkMode(newMode, true);
}

function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (!darkModeToggle) return; // Early return if toggle doesn't exist

  darkModeToggle.addEventListener("change", handleDarkModeToggle);

  // Check localStorage and set initial state without animation
  const savedDarkMode = localStorage.getItem("darkMode");
  setDarkMode(savedDarkMode === "enabled", false);

  // Remove the no-animate class after a short delay
  setTimeout(() => {
    darkModeToggle.parentElement.classList.remove("no-animate");
  }, 100);

  // Use once option for one-time cleanup
  window.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("preload");
        document.documentElement.classList.add("animations-enabled");
      });
    },
    { once: true },
  );
}

// Use immediate listener setup
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
  initDarkMode();
}
