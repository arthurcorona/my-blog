import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/database';

type NewPostFormProps = {
  author: Profile;
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
  const [content, setContent] = useState(''); // markdown
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState(''); // <- NOVO: input de tags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Título é obrigatório.');
      return;
    }

    const slug = slugify(title);

    try {
      setIsSubmitting(true);

      // 1. Criar o post e retornar o registro criado (para usar o id)
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          excerpt: excerpt || content.slice(0, 180),
          content, // .md
          cover_image: coverImage || null,
          status: 'draft', // mantém como rascunho; mude para 'published' se quiser publicar direto
          author_id: author.id,
        })
        .select()
        .single();

      console.log('Resposta do Supabase (posts):', { postData, postError });

      if (postError) throw postError;
      if (!postData) throw new Error('Nenhum dado retornado ao criar o post.');

      // 2. Processar tags (se houver)
      if (tagsInput.trim()) {
        const tagNames = tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);

        for (const tagName of tagNames) {
          const tagSlug = slugify(tagName);

          // tag existente
          const { data: existingTag, error: tagSelectError } = await supabase
            .from('tags')
            .select('id')
            .eq('slug', tagSlug)
            .maybeSingle();

          if (tagSelectError) {
            console.error('Erro ao buscar tag existente:', tagSelectError);
            throw tagSelectError;
          }

          let tagId: string;

          if (existingTag) {
            // Tag já existe
            tagId = existingTag.id;
          } else {
            // 2.2. Criar nova tag
            const { data: newTag, error: tagInsertError } = await supabase
              .from('tags')
              .insert({
                name: tagName,
                slug: tagSlug,
              })
              .select()
              .single();

            if (tagInsertError) {
              console.error('Erro ao criar nova tag:', tagInsertError);
              throw tagInsertError;
            }

            tagId = newTag.id;
          }

          // 2.3. Associar tag ao post na tabela post_tags
          const { error: postTagError } = await supabase
            .from('post_tags')
            .insert({
              post_id: postData.id,
              tag_id: tagId,
            });

          if (postTagError) {
            console.error('Erro ao associar tag ao post:', postTagError);
            throw postTagError;
          }
        }
      }

      console.log('Post e tags criados com sucesso!');

      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setTagsInput('');

      if (onCreated) onCreated();
    } catch (err: any) {
      console.error('Erro completo ao criar post:', err);
      setErrorMsg(err.message || 'Erro ao criar post.');
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
          Excerpt (opcional)
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
        <p className="text-xs text-muted-foreground">
          Escreva em Markdown (.md). O conteúdo será salvo em texto puro no campo <code>content</code>.
        </p>
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

      {/* Campo de tags */}
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
          placeholder="react, typescript, vite"
        />
        <p className="text-xs text-muted-foreground">
          Digite as tags separadas por vírgula. Se não existirem, serão criadas automaticamente.
        </p>
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Status: será criado como <span className="font-semibold">rascunho</span>.
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