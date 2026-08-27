"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Read stored preference or use system preference
    const storedTheme = localStorage.getItem("baznas-bvd-theme") as Theme;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initialTheme: Theme;
    if (storedTheme) {
        initialTheme = storedTheme;
    } else {
        initialTheme = systemPrefersDark ? "dark" : "light";
    }

    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all classes related to theme
    root.removeAttribute("data-mode");
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      root.setAttribute("data-mode", "dark");
      root.classList.add("dark");
    } else {
      root.setAttribute("data-mode", "light");
      root.classList.add("light");
    }
    
    localStorage.setItem("baznas-bvd-theme", theme);

  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
