import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

    setTimeout(() => {
      if (email && password) {
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
            <h2 className="text-4xl font-semibold mb-3 text-primary">
              Simplix
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo(a)
          </h1>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail ou CPF</Label>
            <Input
              id="email"
              type="text"
              placeholder="Digite seu e-mail ou CPF"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/recuperar-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Não tem uma conta?{" "}
              <Link to="/criar-conta" className="text-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
