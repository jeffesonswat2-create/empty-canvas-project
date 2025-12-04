import { useEffect, useState } from "react";

type Theme = "claro" | "escuro" | "automatico";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("simplix_theme");
    return (saved as Theme) || "escuro";
  });

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove("theme-light", "theme-dark");
    
    if (newTheme === "automatico") {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "theme-dark" : "theme-light");
    } else if (newTheme === "claro") {
      root.classList.add("theme-light");
    } else {
      root.classList.add("theme-dark");
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("simplix_theme", theme);
  }, [theme]);

  // Listener para mudanças no sistema quando tema é automático
  useEffect(() => {
    if (theme === "automatico") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("automatico");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return { theme, setTheme };
};
