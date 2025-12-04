import { useState } from "react";
import { Camera } from "lucide-react";
import PlanSummaryCard from "@/components/PlanSummaryCard";
import ActivityFeed from "@/components/ActivityFeed";
import StatsGrid from "@/components/StatsGrid";
import NotificationDemo from "@/components/NotificationDemo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Perfil = () => {
  const { toast } = useToast();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("userAvatar") || null
  );
  const userName = localStorage.getItem("userName") || "Agnaldo Cardoso";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "❌ Arquivo muito grande",
          description: "A imagem deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }

      // Validar formato
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        toast({
          title: "❌ Formato inválido",
          description: "Utilize apenas arquivos JPG ou PNG.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem("userAvatar", result);
        setPhotoDialogOpen(false);
        toast({
          title: "✅ Foto de perfil atualizada com sucesso",
          description: "Sua nova foto já está visível no sistema.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 space-y-6 bg-background">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Olá, Agnaldo!
          </h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta ao seu painel de controle
          </p>
        </div>

        {/* Stats Grid */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <StatsGrid />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <PlanSummaryCard />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <ActivityFeed />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <NotificationDemo />
          </div>
        </div>
      </main>

      {/* Dialog para alterar foto */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-[#151924] border-[#20283A] text-[#E7EEF6]">
          <DialogHeader>
            <DialogTitle className="text-[#E7EEF6]">Alterar foto de perfil</DialogTitle>
            <DialogDescription className="text-[#E7EEF6]/70">
              Escolha uma imagem para seu perfil. Formatos aceitos: JPG, PNG (máximo 2MB).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userName} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
                  {getInitials(userName)}
                </AvatarFallback>
              )}
            </Avatar>
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Escolher imagem
              </div>
              <Input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </Label>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPhotoDialogOpen(false)}
              className="text-[#E7EEF6] hover:bg-[#0F1115]"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Perfil;
