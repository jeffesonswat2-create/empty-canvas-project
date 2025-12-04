import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import loginHero from "@/assets/login-hero.jpg";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const authData = localStorage.getItem('simplix_auth');
    
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        // Se existe sessão válida, redirecionar para o Dashboard
        if (auth.user) {
          navigate("/app/perfil");
        }
      } catch (error) {
        // Se houver erro ao parsear, limpar localStorage
        localStorage.removeItem('simplix_auth');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${loginHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Content Container - Centered */}
      <div className="relative z-10 w-full flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
