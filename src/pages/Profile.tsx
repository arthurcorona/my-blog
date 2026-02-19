import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Link as LinkIcon, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth() as { user: User | null };
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados locais para o formulário
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put('/auth/profile', {
        username,
        avatar_url: avatarUrl
      });
      
      toast.success('Perfil atualizado! Recarregue para ver as mudanças.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12 animate-fade-in">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
            <CardDescription>Gerencie suas informações públicas no RatHole</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-8">
              {/* Preview do Avatar */}
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-mono">
                    {username.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Preview do Avatar
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    {/* CORREÇÃO 3: Usando o nome correto do ícone importado */}
                    <UserIcon className="h-4 w-4" /> Nome de Usuário
                  </Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu nome no blog"
                    className="bg-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-secondary/10 cursor-not-allowed opacity-60"
                  />
                  <p className="text-[10px] text-muted-foreground italic">O email não pode ser alterado no momento.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> URL da Foto
                  </Label>
                  <Input 
                    id="avatar" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://suafoto.com/imagem.png"
                    className="bg-secondary/30"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end border-t border-border/50 pt-6">
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                <Save className="h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;