import { useState } from 'react';
import { ArrowUp, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SuggestionWithAuthor } from '@/types/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SuggestionCardProps {
  suggestion: SuggestionWithAuthor;
  onVoteChange?: () => void;
}

export function SuggestionCard({ suggestion, onVoteChange }: SuggestionCardProps) {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(suggestion.has_voted || false);
  const [votesCount, setVotesCount] = useState(suggestion.upvotes_count);

  const handleVote = async () => {
    if (!user) {
      toast.error('Faça login para votar');
      return;
    }

    setIsVoting(true);

    try {
      if (hasVoted) {
        const { error } = await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestion.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setHasVoted(false);
        setVotesCount((prev) => prev - 1);
        toast.success('Voto removido');
      } else {
        const { error } = await supabase
          .from('suggestion_votes')
          .insert({
            suggestion_id: suggestion.id,
            user_id: user.id
          });

        if (error) throw error;

        setHasVoted(true);
        setVotesCount((prev) => prev + 1);
        toast.success('Voto registrado!');
      }

      onVoteChange?.();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Erro ao processar voto');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="card-hover bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={suggestion.status === 'reviewed' ? 'default' : 'secondary'}
                className={suggestion.status === 'reviewed' ? 'bg-primary/10 text-primary border-primary/20' : ''}
              >
                {suggestion.status === 'reviewed' ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Revisado</>
                ) : (
                  <><Clock className="h-3 w-3 mr-1" /> Pendente</>
                )}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg">{suggestion.title}</h3>
          </div>

          <Button
            variant={hasVoted ? 'default' : 'outline'}
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-0.5 min-w-14"
            onClick={handleVote}
            disabled={isVoting}
          >
            <ArrowUp className={`h-4 w-4 ${hasVoted ? '' : 'text-muted-foreground'}`} />
            <span className="text-sm font-bold">{votesCount}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {suggestion.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Por @{suggestion.author.username}</span>
          <span>
            {format(new Date(suggestion.created_at), "d 'de' MMM", { locale: ptBR })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
