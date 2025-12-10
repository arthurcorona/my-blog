import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/posts/PostGrid';
import { supabase } from '@/integrations/supabase/client';
import type { PostWithAuthor, Post, Profile, Tag, PostTag } from '@/types/database';
import { Code2, Sparkles } from 'lucide-react';

const Index = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
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

        // Fetch tags for each post
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
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
              Blog de Desenvolvimento
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Código, arquitetura e{' '}
              <span className="gradient-text">boas práticas</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Artigos técnicos sobre desenvolvimento de software, patterns, 
              ferramentas e tudo que envolve o mundo dev.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code2 className="h-4 w-4 text-primary" />
                <code className="font-mono text-xs bg-code px-2 py-1 rounded border border-code-border">
                  console.log("Hello, devs!")
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Últimos Posts</h2>
          <span className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </span>
        </div>

        <PostGrid posts={posts} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default Index;
