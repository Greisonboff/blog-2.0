import { useBlog } from "@/contexts/BlogContext";
import PostCard from "@/components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Gift } from "lucide-react";
import { Loading } from "@/components/ui/loadin";

const Home = () => {
  const { posts } = useBlog();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = (searchParams.get("page") as string) || "1";

  const { data, isFetching } = useQuery({
    queryKey: ["postsreq", page],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_API_URL}/post${page ? `?page=${page}` : ""}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => res.json()),
  });

  console.log("meus posts", data);

  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
  );

  return (
    <main className="blog-container">
      <h1 className="mb-8 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Últimas publicações
      </h1>

      {isFetching && <Loading />}
      {data?.posts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhum post publicado ainda.
        </p>
      ) : (
        <div className="space-y-6">
          {data?.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
