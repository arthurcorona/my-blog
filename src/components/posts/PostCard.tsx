import { Link } from 'react-router-dom';
import { User as UserIcon, Calendar, ArrowRight } from "lucide-react"; // Importando os ícones certos
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from "@/types"; // Usando o tipo oficial Post
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <Link to={`/posts/${post.slug}`}>
      <Card 
        className="h-full card-hover bg-card/50 backdrop-blur-sm animate-slide-up group border-border/50"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {post.cover_image && (
          <div className="relative overflow-hidden rounded-t-lg aspect-video">
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
          </div>
        )}
        
        <CardHeader className="space-y-3 pb-3">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-normal"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <UserIcon className="h-3.5 w-3.5" />
              {post.author.username}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(post.created_at), "d 'de' MMM", { locale: ptBR })}
            </span>
          </div>
          
          <span className="flex items-center gap-1 text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Ler mais
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}