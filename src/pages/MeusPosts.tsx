import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBlog } from '@/contexts/BlogContext';
import { formatDate } from '@/lib/formatDate';
import { Pencil, Trash2, Heart, X } from 'lucide-react';
import { toast } from 'sonner';

const MeusPosts = () => {
  const { user } = useAuth();
  const { posts, editarPost, excluirPost } = useBlog();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editConteudo, setEditConteudo] = useState('');
  const [editImagem, setEditImagem] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!user) { navigate('/login'); return null; }

  const meusPosts = posts.filter(p => p.autorId === user.id);
  const totalLikes = meusPosts.reduce((acc, p) => acc + p.likes.length, 0);

  const startEdit = (post: typeof meusPosts[0]) => {
    setEditingId(post.id);
    setEditTitulo(post.titulo);
    setEditConteudo(post.conteudo);
    setEditImagem(post.imagemUrl || '');
  };

  const saveEdit = () => {
    if (!editTitulo.trim()) { toast.error('Título é obrigatório'); return; }
    if (editConteudo.trim().length < 10) { toast.error('Conteúdo deve ter no mínimo 10 caracteres'); return; }
    editarPost(editingId!, { titulo: editTitulo.trim(), conteudo: editConteudo.trim(), imagemUrl: editImagem.trim() || undefined });
    setEditingId(null);
    toast.success('Post atualizado!');
  };

  const confirmDelete = () => {
    if (deleteId) {
      excluirPost(deleteId);
      setDeleteId(null);
      toast.success('Post excluído!');
    }
  };

  return (
    <main className="blog-container max-w-2xl">
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">Meus Posts</h1>
      <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
        <span>{meusPosts.length} post{meusPosts.length !== 1 ? 's' : ''}</span>
        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {totalLikes} curtida{totalLikes !== 1 ? 's' : ''}</span>
      </div>

      {meusPosts.length === 0 ? (
        <p className="text-center text-muted-foreground">Você ainda não publicou nenhum post.</p>
      ) : (
        <div className="space-y-3">
          {meusPosts.map(post => (
            <div key={post.id} className="animate-fade-in rounded-lg border bg-card p-4">
              {editingId === post.id ? (
                <div className="space-y-3">
                  <input value={editTitulo} onChange={e => setEditTitulo(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <textarea value={editConteudo} onChange={e => setEditConteudo(e.target.value)} rows={5} className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={editImagem} onChange={e => setEditImagem(e.target.value)} placeholder="URL da imagem (opcional)" className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Salvar</button>
                    <button onClick={() => setEditingId(null)} className="rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-heading text-lg font-semibold text-card-foreground">{post.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(post.dataCriacao)} · {post.likes.length} curtida{post.likes.length !== 1 ? 's' : ''} · {post.comentarios.length} comentário{post.comentarios.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(post)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(post.id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="animate-fade-in mx-4 w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-card-foreground">Excluir post</h3>
              <button onClick={() => setDeleteId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Tem certeza? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancelar</button>
              <button onClick={confirmDelete} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MeusPosts;
