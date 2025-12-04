import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Book, Video, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Ajuda = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ajuda</h1>
        <p className="text-muted-foreground mt-1">Central de ajuda e documentação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="p-3 rounded-full bg-primary/20 w-fit">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Documentação</CardTitle>
            <CardDescription>Guias completos sobre todas as funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Acessar Docs</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="p-3 rounded-full bg-accent/20 w-fit">
              <Video className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="mt-4">Tutoriais em Vídeo</CardTitle>
            <CardDescription>Aprenda com vídeos passo a passo</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Ver Vídeos</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="p-3 rounded-full bg-success/20 w-fit">
              <MessageCircle className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="mt-4">FAQ</CardTitle>
            <CardDescription>Perguntas frequentes respondidas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Ver FAQ</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { q: "Como emitir uma NF-e?", a: "Acesse Fiscal > Nova NF-e e preencha os dados do cliente e produtos." },
            { q: "Como cadastrar um novo cliente?", a: "Vá em CRM > Clientes > Novo Cliente e preencha os dados." },
            { q: "Como gerar relatórios?", a: "Acesse Relatórios no menu e escolha o tipo de relatório desejado." },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                {faq.q}
              </p>
              <p className="text-sm text-muted-foreground mt-2 ml-6">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajuda;
