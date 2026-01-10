import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/posts/PostGrid';
import { NewPostForm } from '@/components/posts/NewPostForm';
import { supabase } from '@/integrations/supabase/client';
import type { PostWithAuthor, Post, Profile, Tag, AppRole } from '@/types/database';
import { Code2, Sparkles, Plus } from 'lucide-react';

const Index = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const isAdmin = profile?.role === 'admin';

  /**
   * FUNÇÃO REUTILIZÁVEL PARA CARREGAR POSTS
   * - admin = true  -> vê todos (draft + published)
   * - admin = false -> só published
   */
  const loadPosts = async (admin: boolean) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (!admin) {
        // usuários não-admin (ou anônimos) só veem publicados
        query = query.eq('status', 'published');
      }

      const { data: postsData, error: postsError } = await query;
      console.log('postsData (anon/admin=false):', postsData, postsError); //log teste

      if (postsError) throw postsError;

      const postsWithTags: PostWithAuthor[] = await Promise.all(
        (postsData || []).map(async (postRow: any) => {
          const { data: postTags } = await supabase
            .from('post_tags')
            .select(`
              tag:tags(*)
            `)
            .eq('post_id', postRow.id);

          const tags = (postTags || []).map((pt: any) => pt.tag as Tag);

          const post: PostWithAuthor = {
            id: postRow.id,
            title: postRow.title,
            slug: postRow.slug,
            content: postRow.content,
            excerpt: postRow.excerpt,
            cover_image: postRow.cover_image,
            status: postRow.status,
            author_id: postRow.author_id,
            created_at: postRow.created_at,
            updated_at: postRow.updated_at,
            author: {
              id: postRow.author.id,
              username: postRow.author.username,
              avatar_url: postRow.author.avatar_url,
              created_at: postRow.author.created_at,
              role: postRow.author.role as AppRole,
            },
            tags,
          };

          return post;
        })
      );

      setPosts(postsWithTags);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Recarrega os posts de acordo com o perfil atual
   */
  const reloadPosts = async () => {
    const admin = profile?.role === 'admin';
    await loadPosts(!!admin);
  };

  /**
   * Publicar um post (mudar status de draft -> published)
   */
  const publishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', postId);

      if (error) throw error;

      await reloadPosts();
    } catch (error) {
      console.error('Erro ao publicar post:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tenta buscar o usuário logado
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          // Se o erro for "Auth session missing", tratamos como não logado
          if ((authError as any).message?.includes('Auth session missing')) {
            console.warn('Nenhuma sessão de auth. Carregando posts públicos como anônimo.');
            setProfile(null);
            await loadPosts(false); // <-- carrega posts published para anônimo
            return; // <-- sai da função aqui
          }

          // Outros erros, ainda assim logamos
          throw authError;
        }

        let currentProfile: Profile | null = null;

        if (authData?.user) {
          // Usuário logado → tenta buscar perfil
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError) throw profileError;

          if (profileData) {
            const typedProfile: Profile = {
              id: (profileData as any).id,
              username: (profileData as any).username,
              avatar_url: (profileData as any).avatar_url ?? null,
              created_at: (profileData as any).created_at,
              role: ((profileData as any).role ?? 'reader') as AppRole,
            };

            setProfile(typedProfile);
            currentProfile = typedProfile;
          } else {
            setProfile(null);
          }
        } else {
          // Sem usuário logado
          setProfile(null);
        }

        const admin = currentProfile?.role === 'admin';

        // Carrega posts conforme role (ou sem login)
        await loadPosts(!!admin);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Em qualquer erro inesperado, garante pelo menos posts públicos:
        try {
          await loadPosts(false);
        } catch (e) {
          console.error('Erro adicional ao carregar posts públicos:', e);
        }
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Form só para admin */}
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

        <PostGrid
          posts={posts}
          isLoading={isLoading || isCheckingAuth}
          isAdmin={isAdmin}
          onPublishPost={publishPost}
        />
      </section>
    </Layout>
  );
};

export default Index;