import { useState } from "react";
import type { Post } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { formatDate } from "@/lib/formatDate";
import {
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  const { toggleLike, adicionarComentario } = useBlog();
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  const isLiked = user ? post.likesData.hasLiked : false;
  const previewText =
    post.content.length > 150
      ? post.content.slice(0, 150) + "..."
      : post.content;

  const handleLike = () => {
    if (!user) {
      toast.error("Faça login para curtir");
      return;
    }
    toggleLike(post.likesData.hasLiked ? "unlike" : "like", post._id);
  };

  const handleComment = async () => {
    if (!user) {
      toast.error("Faça login para comentar");
      return;
    }
    if (!novoComentario.trim()) return;

    try {
      const res = await Promise.resolve(
        adicionarComentario(post._id, novoComentario.trim()),
      );

      if (res?.isValid) {
        setNovoComentario("");
        toast.success("Comentário adicionado!");
      } else {
        toast.error("Erro ao adicionar comentário");
      }
    } catch (error) {
      // Handle the error here
    }
  };

  return (
    <article className="animate-fade-in overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      {post.images && (
        <img
          src={post.images}
          alt={post.title}
          className="h-52 w-full object-cover sm:h-64"
        />
      )}
      <div className="p-5 sm:p-6">
        <h2 className="font-heading text-xl font-bold text-card-foreground sm:text-2xl">
          {post.title}
        </h2>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{post.user?.name}</span>
          <span>·</span>
          <time>{formatDate(post.createdAt)}</time>
        </div>

        <p className="mt-3 whitespace-pre-line leading-relaxed text-secondary-foreground">
          {expanded ? post.content : previewText}
        </p>

        {post.content.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {expanded ? "Ver menos" : "Ler mais"}
          </button>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4 border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? "text-like" : "text-muted-foreground hover:text-like"}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {post.likesData.likesTotal}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments.length}
            {showComments ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 animate-fade-in space-y-3 border-t pt-4">
            {user && (
              <div className="flex gap-2">
                <input
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  placeholder="Escreva um comentário..."
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleComment}
                  disabled={!novoComentario.trim()}
                  className="rounded-md bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
            {post.comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhum comentário ainda.
              </p>
            ) : (
              post.comments.map((c, i) => (
                <div key={i} className="rounded-md bg-muted p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {c.user?.name}
                    </span>
                    <span>·</span>
                    <time>{formatDate(c.commentedAt)}</time>
                  </div>
                  <p className="mt-1 text-sm text-secondary-foreground">
                    {c.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
