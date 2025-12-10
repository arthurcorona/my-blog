import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SuggestionCard } from '@/components/suggestions/SuggestionCard';
import { SuggestionForm } from '@/components/suggestions/SuggestionForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { SuggestionWithAuthor, Suggestion, Profile } from '@/types/database';
import { Lightbulb, LogIn, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Suggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestionWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('upvotes_count', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map(s => s.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
      const profilesMap = new Map((profiles || []).map((p: Profile) => [p.id, p]));

      // Check if current user has voted on each suggestion
      let suggestionsWithVotes: SuggestionWithAuthor[] = (data || []).map((s) => ({
        ...s,
        author: profilesMap.get(s.user_id) as Profile,
        has_voted: false
      }));

      if (user) {
        const { data: votes } = await supabase
          .from('suggestion_votes')
          .select('suggestion_id')
          .eq('user_id', user.id);

        const votedIds = new Set((votes || []).map((v: { suggestion_id: string }) => v.suggestion_id));
        
        suggestionsWithVotes = suggestionsWithVotes.map((s) => ({
          ...s,
          has_voted: votedIds.has(s.id)
        }));
      }

      setSuggestions(suggestionsWithVotes);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative py-16 md:py-20">
          <div className="max-w-2xl space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Lightbulb className="h-4 w-4" />
              Feature Requests
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">
              Sugestões de Conteúdo
            </h1>
            
            <p className="text-muted-foreground leading-relaxed">
              Sugira temas para novos posts e vote nas sugestões que você mais gostaria de ver.
              As mais votadas têm prioridade!
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Suggestion Form / Login CTA */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {user ? (
              <div className="sticky top-24">
                <SuggestionForm onSuccess={fetchSuggestions} />
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 text-center">
                <LogIn className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Faça login para participar</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Envie sugestões e vote nos temas que você quer ver no blog.
                </p>
                <Button asChild className="w-full">
                  <Link to="/auth">Entrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Suggestions List */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Ordenado por votos</span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-40 rounded-lg bg-card/50 animate-pulse border border-border/50"
                  />
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-16">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2">Nenhuma sugestão ainda</h3>
                <p className="text-sm text-muted-foreground">
                  Seja o primeiro a sugerir um tema!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={suggestion.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SuggestionCard 
                      suggestion={suggestion} 
                      onVoteChange={fetchSuggestions}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Suggestions;
