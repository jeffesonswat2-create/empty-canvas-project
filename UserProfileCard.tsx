import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserProfileCardProps {
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  joinDate?: string;
}

const UserProfileCard = ({
  email = "agnaldo.cardoso@lrdistribuidora.com.br",
  phone = "(11) 98765-4321",
  document = "12.345.678/0001-90",
  address = "São Paulo, SP",
  joinDate = "Janeiro de 2023",
}: UserProfileCardProps) => {
  return (
    <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Informações do Usuário</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Perfil
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <p className="text-foreground">{email}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="text-foreground">{phone}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">CNPJ</p>
            <p className="text-foreground">{document}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Localização</p>
            <p className="text-foreground">{address}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Cliente desde</p>
            <p className="text-foreground">{joinDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
