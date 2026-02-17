import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api } from "@/lib/api"; // <--- Importando a API
import { toast } from 'sonner';

const suggestionSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(100, 'Título muito longo'),
  description: z.string().min(20, 'Descrição muito curta').max(500, 'Descrição muito longa')
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

interface SuggestionFormProps {
  onSuccess?: () => void;
}

export function SuggestionForm({ onSuccess }: SuggestionFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema)
  });

  const onSubmit = async (data: SuggestionFormData) => {
    // 1) Verifica se está logado
    if (!user) {
      toast.error('Faça login para enviar sugestões');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2) Envia para a API (Substituindo Supabase)
      // Não precisamos mandar user_id no corpo, o Backend pega do Token!
      await api.post('/suggestions', {
        title: data.title,
        description: data.description,
      });

      // 3) Sucesso
      toast.success('Sugestão enviada com sucesso!');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast.error('Erro ao enviar sugestão');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se não estiver logado, não renderiza o form
  if (!user) {
    return null;
  }

  return (
    <Card className="bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Sugira um tema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Tutorial sobre Docker"
              className="bg-secondary/50"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que gostaria de ver neste post..."
              className="min-h-24 bg-secondary/50 resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}