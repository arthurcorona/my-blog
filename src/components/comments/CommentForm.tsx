import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const commentSchema = z.object({
  content: z.string().min(3, 'Comentário muito curto').max(1000, 'Comentário muito longo'),
  guest_name: z.string().max(50, 'Nome muito longo').optional()
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema)
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    try {
      const commentData = {
        post_id: postId,
        content: data.content,
        user_id: user?.id || null,
        guest_name: user ? null : data.guest_name || 'Anônimo',
        parent_id: parentId || null
      };

      const { error } = await supabase.from('comments').insert(commentData);

      if (error) throw error;

      toast.success(
        user 
          ? 'Comentário publicado!' 
          : 'Comentário enviado para moderação'
      );
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Erro ao enviar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!user && (
        <div className="space-y-2">
          <Label htmlFor="guest_name" className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            Seu nome (opcional)
          </Label>
          <Input
            id="guest_name"
            placeholder="Nome para exibição"
            className="bg-secondary/50"
            {...register('guest_name')}
          />
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder={user ? 'Escreva seu comentário...' : 'Escreva seu comentário (será moderado antes de aparecer)...'}
          className="min-h-24 bg-secondary/50 resize-none"
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        {user && (
          <p className="text-xs text-muted-foreground">
            Comentando como <span className="text-primary font-medium">{profile?.username}</span>
          </p>
        )}
        
        <div className="flex gap-2 ml-auto">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isSubmitting} className="gap-2">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>
    </form>
  );
}
