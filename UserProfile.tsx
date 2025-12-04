import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Edit, Building2, Save, X, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("userAvatar") || null
  );
  const userName = localStorage.getItem("userName") || "Agnaldo Cardoso";
  
  const [userInfo, setUserInfo] = useState({
    email: "agnaldo.cardoso@lrdistribuidora.com.br",
    phone: "(11) 98765-4321",
    document: "12.345.678/0001-90",
    address: "São Paulo, SP",
    joinDate: "Janeiro de 2023",
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);

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
        
        // Notificar outros componentes sobre a atualização
        window.dispatchEvent(new Event("avatarUpdated"));
        
        setPhotoDialogOpen(false);
        toast({
          title: "✅ Foto de perfil atualizada com sucesso",
          description: "Sua nova foto já está visível no sistema.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setEditedInfo(userInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
    toast({
      title: "Sucesso",
      description: "Informações atualizadas com sucesso.",
      duration: 3000,
    });
  };

  const handleInputChange = (field: keyof typeof userInfo, value: string) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  return (
    <>
      <main className="flex-1 p-8 overflow-auto bg-background">
        <div className="w-full h-full space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Perfil do Usuário
            </h2>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* Foto de Perfil Card */}
          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-foreground">Foto de Perfil</CardTitle>
              <CardDescription className="text-muted-foreground">
                Personalize sua imagem de perfil do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-[150px] w-[150px] border-4 border-primary">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-semibold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div 
                  className="absolute bottom-2 right-2 bg-primary rounded-full p-3 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                  onClick={() => setPhotoDialogOpen(true)}
                >
                  <Camera className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Formatos aceitos: JPG, PNG (máximo 2MB)
                </p>
                <Button
                  onClick={() => setPhotoDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Alterar foto de perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Information Card */}
          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow animate-fade-in w-full min-h-[calc(100vh-280px)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Informações do Usuário</CardTitle>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* E-mail Field */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-2" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1 block">E-mail</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-background border-border text-foreground focus:border-primary"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.email}</p>
                  )}
                </div>
              </div>
              
              {/* Phone Field */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-2" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1 block">Telefone</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                      className="bg-background border-border text-foreground focus:border-primary"
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.phone}</p>
                  )}
                </div>
              </div>
              
              {/* CNPJ Field */}
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-2" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1 block">CNPJ</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editedInfo.document}
                      onChange={(e) => handleInputChange('document', formatCNPJ(e.target.value))}
                      className="bg-background border-border text-foreground focus:border-primary"
                      placeholder="00.000.000/0000-00"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.document}</p>
                  )}
                </div>
              </div>
              
              {/* Location Field */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-2" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1 block">Localização</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editedInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-background border-border text-foreground focus:border-primary"
                    />
                  ) : (
                    <p className="text-foreground">{userInfo.address}</p>
                  )}
                </div>
              </div>
              
              {/* Join Date Field */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-2" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1 block">Cliente desde</Label>
                  <p className="text-foreground">{userInfo.joinDate}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={handleSave}
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Dialog para alterar foto */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Alterar foto de perfil</DialogTitle>
            <DialogDescription className="text-muted-foreground">
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
              className="hover:bg-secondary"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
