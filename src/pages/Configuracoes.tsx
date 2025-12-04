import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Moon, Sun, Monitor, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/useTheme";
import { useLayoutDensity } from "@/hooks/useLayoutDensity";

const Configuracoes = () => {
  const { theme, setTheme } = useTheme();
  const { density, setDensity } = useLayoutDensity();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize sua experiência</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Tema
            </CardTitle>
            <CardDescription>Escolha o tema da interface</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="escuro" id="escuro" />
                <Label htmlFor="escuro" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  Escuro
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="claro" id="claro" />
                <Label htmlFor="claro" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  Claro
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="automatico" id="automatico" />
                <Label htmlFor="automatico" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  Automático (Sistema)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Densidade do Layout
            </CardTitle>
            <CardDescription>Ajuste o espaçamento da interface</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={density} onValueChange={(value) => setDensity(value as any)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="compacto" id="compacto" />
                <Label htmlFor="compacto" className="cursor-pointer">
                  <span className="font-medium">Compacto</span>
                  <p className="text-xs text-muted-foreground">Mais informações na tela</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="padrao" id="padrao" />
                <Label htmlFor="padrao" className="cursor-pointer">
                  <span className="font-medium">Padrão</span>
                  <p className="text-xs text-muted-foreground">Espaçamento equilibrado</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="amplo" id="amplo" />
                <Label htmlFor="amplo" className="cursor-pointer">
                  <span className="font-medium">Amplo</span>
                  <p className="text-xs text-muted-foreground">Mais espaço entre elementos</p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
