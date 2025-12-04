import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        // Salvar sessão no localStorage
        localStorage.setItem('simplix_auth', JSON.stringify({
          user: { email, name: 'Agnaldo Costa' },
          timestamp: Date.now()
        }));
        
        toast.success("Login realizado com sucesso!");
        navigate("/app/perfil");
      } else {
        toast.error("Por favor, preencha todos os campos");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
        <div className="mb-8">
          <div className="text-center mb-3">
            <h2 className="text-4xl font-semibold mb-3" style={{ color: '#3BA3FF' }}>
              Simplix
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo(a)
          </h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail ou CPF</Label>
            <Input
              id="email"
              type="text"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border-border pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-muted-foreground">Lembrar-me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/recuperar-senha")}
              className="text-primary hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Ainda não é cliente?{" "}
            <button
              type="button"
              onClick={() => navigate("/criar-conta")}
              className="text-accent hover:underline font-semibold"
            >
              Crie sua conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
