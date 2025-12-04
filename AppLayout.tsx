import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/hooks/useTheme";
import { useLayoutDensity } from "@/hooks/useLayoutDensity";

const AppLayout = () => {
  const navigate = useNavigate();
  
  // Inicializar tema e densidade
  useTheme();
  useLayoutDensity();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const authData = localStorage.getItem('simplix_auth');
    
    if (!authData) {
      // Se não houver sessão, redirecionar para login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AppHeader />
          <div className="flex-1 overflow-y-auto scrollbar-none">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
