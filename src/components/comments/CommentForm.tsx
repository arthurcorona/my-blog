import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, Send } from "lucide-react"; // Adicionei o Send
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { api } from "@/lib/api"; // Importando nossa API
import { toast } from '@/hooks/use-toast'; // Ajuste o import do toast se necessário

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
  // CORREÇÃO 1: Removemos 'profile'. Tudo que precisamos está em 'user'.
  const { user } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema)
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    try {
      // O backend pega o user_id automaticamente pelo token se estiver logado
      await api.post('/comments', {
        post_id: postId,
        content: data.content,
        guest_name: user ? undefined : (data.guest_name || 'Anônimo'),
        parent_id: parentId || null
      });

      toast({
        title: user ? 'Comentário publicado!' : 'Comentário enviado!',
        description: user ? undefined : 'Seu comentário pode passar por moderação.'
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o comentário."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!user && (
        <div className="space-y-2">
          <Label htmlFor="guest_name" className="flex items-center gap-2 text-sm">
            <UserIcon className="h-4 w-4" />
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
          placeholder={user ? 'Escreva seu comentário...' : 'Escreva seu comentário...'}
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
            Comentando como <span className="text-primary font-medium">{user.name}</span>
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