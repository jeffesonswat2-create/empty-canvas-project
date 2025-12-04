import { useEffect, useState } from "react";

type Density = "compacto" | "padrao" | "amplo";

export const useLayoutDensity = () => {
  const [density, setDensity] = useState<Density>(() => {
    const saved = localStorage.getItem("simplix_density");
    return (saved as Density) || "padrao";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove("density-compact", "density-default", "density-spacious");
    
    // Aplica nova classe
    if (density === "compacto") {
      root.classList.add("density-compact");
    } else if (density === "amplo") {
      root.classList.add("density-spacious");
    } else {
      root.classList.add("density-default");
    }
    
    // Salva no localStorage
    localStorage.setItem("simplix_density", density);
  }, [density]);

  return { density, setDensity };
};
