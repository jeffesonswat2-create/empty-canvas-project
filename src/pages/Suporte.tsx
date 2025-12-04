import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Suporte = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Suporte</h1>
        <p className="text-muted-foreground mt-1">Entre em contato com nossa equipe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="p-2 rounded-full bg-primary/20 w-fit">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg mt-2">Telefone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">(11) 4000-1234</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="p-2 rounded-full bg-accent/20 w-fit">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-lg mt-2">E-mail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">suporte@simplix.com.br</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="p-2 rounded-full bg-success/20 w-fit">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <CardTitle className="text-lg mt-2">Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Seg-Sex: 8h às 18h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Abrir Chamado
          </CardTitle>
          <CardDescription>Descreva seu problema e entraremos em contato</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input id="assunto" placeholder="Resumo do problema" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" placeholder="Ex: Fiscal, Financeiro, etc." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descreva detalhadamente o problema..." 
                rows={5}
              />
            </div>
            <Button className="w-full md:w-auto">Enviar Chamado</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suporte;
