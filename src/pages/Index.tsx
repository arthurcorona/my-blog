import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/posts/PostGrid';
import { NewPostForm } from '@/components/posts/NewPostForm';
import { supabase } from '@/integrations/supabase/client';
import type { PostWithAuthor, Post, Profile, Tag } from '@/types/database';
import { Code2, Sparkles, Plus } from 'lucide-react';

const Index = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Pegar usuário atual
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (authData.user) {
          // 2. Buscar admin
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError) throw profileError;
          setProfile(profileData as Profile);
        } else {
          setProfile(null);
        }

        // 3. Buscar posts publicados
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles(*)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        const postsWithTags: PostWithAuthor[] = await Promise.all(
          (postsData || []).map(async (post: Post & { author: Profile }) => {
            const { data: postTags } = await supabase
              .from('post_tags')
              .select(`
                tag:tags(*)
              `)
              .eq('post_id', post.id);

            return {
              ...post,
              tags: (postTags || []).map((pt: { tag: Tag }) => pt.tag)
            };
          })
        );

        setPosts(postsWithTags);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    fetchData();
  }, []);

  const reloadPosts = async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const postsWithTags: PostWithAuthor[] = await Promise.all(
        (postsData || []).map(async (post: Post & { author: Profile }) => {
          const { data: postTags } = await supabase
            .from('post_tags')
            .select(`
              tag:tags(*)
            `)
            .eq('post_id', post.id);

          return {
            ...post,
            tags: (postTags || []).map((pt: { tag: Tag }) => pt.tag)
          };
        })
      );

      setPosts(postsWithTags);
    } catch (error) {
      console.error('Error reloading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <Layout>
      {/* Hero Section */}
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

      {/* Posts Section */}
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

        {/* Formulário só para admin */}
        {isAdmin && showNewPostForm && profile && (
          <NewPostForm
            author={profile}
            onCreated={() => {
              setShowNewPostForm(false);
              reloadPosts();
            }}
            onCancel={() => setShowNewPostForm(false)}
          />
        )}

        <PostGrid posts={posts} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default Index;