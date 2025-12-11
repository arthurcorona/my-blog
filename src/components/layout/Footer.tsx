import { Terminal, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              Rat<span className="text-primary">Hole</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            <Link 
              to="/suggestions" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sugestões
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/arthurcorona"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com/imarthurcorona"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RatHole,
            <span className="text-primary"></span> devaneios e ideias.
          </p>
        </div>
      </div>
    </footer>
  );
}
