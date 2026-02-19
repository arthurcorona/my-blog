import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/posts/PostGrid';
import { NewPostForm } from '@/components/posts/NewPostForm';
import { api } from "@/lib/api"; 
import { useAuth } from "@/contexts/AuthContext"; 
import { Post } from "@/types";
import { Code2, Sparkles, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; 

const Index = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { toast } = useToast();

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Post[]>('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Não foi possível carregar os posts." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const publishPost = async (postId: string) => {
    try {
      await api.put(`/posts/${postId}`, { status: 'published' });
      
      toast({ title: "Sucesso", description: "Post publicado!" });
      loadPosts(); 
    } catch (error) {
      console.error('Erro ao publicar:', error);
      toast({ variant: "destructive", title: "Erro", description: "Falha ao publicar." });
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadPosts();
    }
  }, [authLoading, user]); 

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Seja bem vindo,
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Café, devaneios, ideias e reflexões.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code2 className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Últimos Posts</h2>
            <span className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
            </span>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowNewPostForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/40"
            >
              <Plus className="h-4 w-4" />
              {showNewPostForm ? 'Fechar' : 'Novo post'}
            </button>
          )}
        </div>

        {/* Aqui garantimos que passamos 'author' corretamente */}
        {isAdmin && showNewPostForm && user && (
          <NewPostForm
            author={user} 
            onCreated={() => {
              setShowNewPostForm(false);
              loadPosts();
            }}
            onCancel={() => setShowNewPostForm(false)}
          />
        )}

        <PostGrid
          posts={posts}
          isLoading={isLoading || authLoading}
          isAdmin={isAdmin}
          onPublishPost={publishPost}
        />
      </section>
    </Layout>
  );
};

export default Index;