import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loadin";
import { Pagination } from "@/components/Pagination";
import { DeleteModal } from "@/components/DeleteModal";
import CardMyPost from "@/components/CardMyPost";
import EditPostModal from "@/components/EditPostModal";
import { Post } from "@/types/blog";

const MeusPosts = () => {
  const { user } = useAuth();

  const { excluirPost } = useBlog();

  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [editPost, setEditPost] = useState<Post | null>(null);

  const [searchParams] = useSearchParams();

  const page = (searchParams.get("page") as string) || "1";

  const { data, isFetching } = useQuery({
    queryKey: ["posts my posts", page],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_API_URL}/post/my-posts${
          page ? `?page=${page}` : ""
        }`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user }),
        },
      ).then((res) => res.json()),
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const confirmDelete = async () => {
    if (deleteId) {
      const res = await excluirPost(deleteId);

      if (!res?.isValid) {
        return;
      }
      setDeleteId(null);
      toast.success("Post excluído!");
    }
  };

  const totalLikes =
    data?.posts?.reduce((acc, post) => acc + post.likesData.likesTotal, 0) || 0;

  return (
    <main className="blog-container max-w-2xl">
      {isFetching && <Loading />}
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Meus Posts
      </h1>
      <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
        <span>
          {data?.posts?.length} post{data?.posts?.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" /> {totalLikes} curtida
          {totalLikes !== 1 ? "s" : ""}
        </span>
      </div>

      {data?.posts?.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Você ainda não publicou nenhum post.
        </p>
      ) : (
        <div className="space-y-3">
          {data?.posts?.map((post) => (
            <div
              key={post._id}
              className="animate-fade-in rounded-lg border bg-card p-4"
            >
              <CardMyPost
                post={post}
                startEdit={() => setEditPost(post)}
                setDeleteId={setDeleteId}
              />
            </div>
          ))}

          <Pagination
            currentPage={Number(page)}
            totalPages={data?.totalPages || 1}
          />
        </div>
      )}

      <EditPostModal post={editPost} onClose={() => setEditPost(null)} />

      {/* Delete confirmation modal */}
      {deleteId && (
        <DeleteModal
          cancelDelete={() => setDeleteId(null)}
          confirmDelete={confirmDelete}
          title="Excluir post"
        />
      )}
    </main>
  );
};

export default MeusPosts;
