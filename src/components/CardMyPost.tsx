import Image from "@/components/Image";
import { formatDate } from "@/lib/formatDate";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface CardMyPostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    images?: string;
    createdAt: string;
    likesData: {
      likesTotal: number;
    };
    comments: any[];
  };
  startEdit: (post: CardMyPostProps["post"]) => void;
  setDeleteId: (id: string | null) => void;
}

function CardMyPost({ post, startEdit, setDeleteId }: CardMyPostProps) {
  const [expanded, setExpanded] = useState(false);

  const previewText =
    post.content.length > 150
      ? post.content.slice(0, 150) + "..."
      : post.content;

  return (
    <>
      <div>
        <Image
          src={post.images}
          alt={post.title}
          className="h-52 w-full object-cover sm:h-64 rounded-md mb-2"
        />
        <h3 className="truncate font-heading text-lg font-semibold text-card-foreground ">
          {post.title}
        </h3>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p>{expanded ? post.content : previewText}</p>

          {post.content.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {expanded ? "Ver menos" : "Ler mais"}
            </button>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>{formatDate(post.createdAt)}</p>
              <p>
                {post.likesData.likesTotal} curtida
                {post.likesData.likesTotal !== 1 ? "s" : ""} ·{" "}
                {post.comments.length} comentário
                {post.comments.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => startEdit(post)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteId(post._id)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardMyPost;
