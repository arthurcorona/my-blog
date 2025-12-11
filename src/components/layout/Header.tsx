import { Link } from 'react-router-dom';
import { Terminal, LogIn, LogOut, User, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <span className="font-mono font-semibold text-lg">
          Rat<span className="text-primary">Hole</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Posts
          </Link>
          <Link 
            to="/suggestions" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="h-4 w-4" />
            Sugestões
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username} />
                    <AvatarFallback className="bg-primary/10 text-primary font-mono text-sm">
                      {profile?.username?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-mono text-xs">
                      {profile?.username?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile?.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {isAdmin ? 'Admin' : 'Reader'}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
