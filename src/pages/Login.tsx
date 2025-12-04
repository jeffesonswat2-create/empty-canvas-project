import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/perfil");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(135deg, hsl(222 17% 6%) 0%, hsl(202 100% 62% / 0.15) 100%)",
        }}
      />
      <div className="relative z-10 w-full flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
