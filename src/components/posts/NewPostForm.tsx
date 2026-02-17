import { useState } from 'react';
import { Post, User } from "@/types";
import { api } from "@/lib/api";//api nova top
import { useToast } from "@/hooks/use-toast";

type NewPostFormProps = {
  author: User;
  onCreated?: () => void;
  onCancel?: () => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remover acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const NewPostForm = ({ author, onCreated, onCancel }: NewPostFormProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState(''); 
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Título é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Processar tags para enviar como Array de Strings
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // dados do post pro back
      await api.post('/posts', {
        title,
        slug: slugify(title),
        excerpt: excerpt || content.slice(0, 180),
        content,
        cover_image: coverImage || null,
        status: 'draft',
        tags: tagsArray
      });

      toast({
        title: "Post criado!",
        description: "Seu rascunho foi salvo com sucesso."
      });

      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setTagsInput('');

      if (onCreated) onCreated();
    } catch (err: any) {
      console.error('Erro completo ao criar post:', err);
      setErrorMsg('Erro ao criar post. Tente novamente.');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao criar o post."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Criar novo post</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:underline"
          >
            Fechar
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do post"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="excerpt">
          Resumo (opcional)
        </label>
        <textarea
          id="excerpt"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Um resumo curto do post..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="content">
          Conteúdo (Markdown)
        </label>
        <textarea
          id="content"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px] resize-y font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`# Título\n\nSeu conteúdo em **Markdown** aqui...`}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="cover_image">
          URL da imagem de capa (opcional)
        </label>
        <input
          id="cover_image"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="tags">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="react, typescript, linux"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Status: <span className="font-semibold">Rascunho</span>
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar post'}
        </button>
      </div>
    </form>
  );
};