import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CommentSection } from '@/components/comments/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { PostWithAuthor, Post, Profile, Tag } from '@/types/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, User, Clock, Tag as TagIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [relatedTags, setRelatedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles(*)
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (postError) throw postError;
        if (!postData) {
          setIsLoading(false);
          return;
        }

        // Fetch tags
        const { data: postTags } = await supabase
          .from('post_tags')
          .select(`
            tag:tags(*)
          `)
          .eq('post_id', postData.id);

        const tags = (postTags || []).map((pt: { tag: Tag }) => pt.tag);

        setPost({
          ...(postData as Post & { author: Profile }),
          tags
        });

        // Fetch all tags for "related tags" section
        const { data: allTags } = await supabase
          .from('tags')
          .select('*')
          .limit(10);

        setRelatedTags(allTags || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-12">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container max-w-4xl py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Layout>
      <article className="container max-w-4xl py-12">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para posts
        </Link>

        {/* Header */}
        <header className="space-y-6 mb-12 animate-fade-in">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} className="tag-badge">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={post.author.avatar_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-mono text-sm">
                  {post.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.author.username}</p>
                <p className="text-xs text-muted-foreground">Autor</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime} min de leitura
              </span>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative rounded-xl overflow-hidden mb-12 animate-slide-up">
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-content text-lg leading-relaxed mb-16 animate-fade-in">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-4 text-foreground/80">
                {paragraph}
              </p>
            )
          ))}
        </div>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="py-8 border-t border-border/50 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Tags Relacionadas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <div className="border-t border-border/50 pt-12">
          <CommentSection postId={post.id} />
        </div>
      </article>
    </Layout>
  );
};

export default PostDetail;
