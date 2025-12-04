import { useState, useEffect } from "react";
import { HelpCircle, Camera, User, Settings, HelpCircleIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  userName?: string;
  userCompany?: string;
}

const AppHeader = ({ 
  userName = "Agnaldo Cardoso",
  userCompany = "LR Distribuidora de Livros e Revistas LTDA"
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("userAvatar") || null
  );
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem("userName") || userName,
    email: localStorage.getItem("userEmail") || "agnaldo.cardoso@lrdistribuidora.com.br",
    phone: localStorage.getItem("userPhone") || "(11) 98765-4321",
    location: localStorage.getItem("userLocation") || "São Paulo, SP"
  });
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Escutar mudanças na foto de perfil
  useEffect(() => {
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem("userAvatar");
      setAvatarUrl(newAvatar);
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem("userAvatar", result);
        setPhotoDialogOpen(false);
        toast({
          title: "✅ Foto atualizada",
          description: "Sua foto de perfil foi alterada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUserInfo = () => {
    setUserInfo(tempUserInfo);
    localStorage.setItem("userName", tempUserInfo.name);
    localStorage.setItem("userEmail", tempUserInfo.email);
    localStorage.setItem("userPhone", tempUserInfo.phone);
    localStorage.setItem("userLocation", tempUserInfo.location);
    setEditDialogOpen(false);
    toast({
      title: "✅ Informações atualizadas",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast({
      title: "👋 Até logo!",
      description: "Você saiu do sistema com sucesso.",
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="empresa-info">
          <h2 className="text-base font-semibold text-foreground">{userCompany}</h2>
          <p className="text-xs text-muted-foreground opacity-60">CNPJ: 12.345.678/0001-90</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-secondary/50 rounded-lg p-2 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-primary">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userInfo.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{userInfo.name}</p>
                <p className="text-xs text-muted-foreground">{userCompany}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            <DropdownMenuLabel className="text-foreground">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => navigate("/app/user-profile")}
              className="text-foreground hover:bg-secondary hover:text-primary focus:bg-secondary focus:text-primary cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setEditDialogOpen(true)}
              className="text-foreground hover:bg-secondary hover:text-primary focus:bg-secondary focus:text-primary cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Editar Informações
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/app/configuracoes")}
              className="text-foreground hover:bg-secondary hover:text-primary focus:bg-secondary focus:text-primary cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/app/ajuda")}
              className="text-foreground hover:bg-secondary hover:text-primary focus:bg-secondary focus:text-primary cursor-pointer"
            >
              <HelpCircleIcon className="h-4 w-4 mr-2" />
              Ajuda
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => setLogoutDialogOpen(true)}
              className="text-destructive hover:bg-secondary hover:text-destructive focus:bg-secondary focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog para alterar foto */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Alterar foto de perfil</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Escolha uma imagem para seu perfil. Formatos aceitos: JPG, PNG.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userInfo.name} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
                  {getInitials(userInfo.name)}
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
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </Label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar informações */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar informações</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atualize suas informações pessoais.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">Nome completo</Label>
              <Input
                id="name"
                value={tempUserInfo.name}
                onChange={(e) => setTempUserInfo({ ...tempUserInfo, name: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={tempUserInfo.email}
                onChange={(e) => setTempUserInfo({ ...tempUserInfo, email: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-foreground">Telefone</Label>
              <Input
                id="phone"
                value={tempUserInfo.phone}
                onChange={(e) => setTempUserInfo({ ...tempUserInfo, phone: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-foreground">Localização</Label>
              <Input
                id="location"
                value={tempUserInfo.location}
                onChange={(e) => setTempUserInfo({ ...tempUserInfo, location: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">CNPJ</Label>
              <Input
                value="12.345.678/0001-90"
                disabled
                className="bg-background/50 border-border text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setTempUserInfo(userInfo);
                setEditDialogOpen(false);
              }}
              className="text-foreground hover:bg-secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveUserInfo}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar logout */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Deseja realmente sair?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você será desconectado do sistema e precisará fazer login novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-secondary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AppHeader;
