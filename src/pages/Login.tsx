import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem('simplix_auth');

    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth.user) {
          navigate("/app/perfil");
        }
      } catch (error) {
        localStorage.removeItem('simplix_auth');
      }
    }
  }, [navigate]);

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
