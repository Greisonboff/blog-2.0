import { useBlog } from '@/contexts/BlogContext';
import PostCard from '@/components/PostCard';

const Home = () => {
  const { posts } = useBlog();

  const sorted = [...posts].sort((a, b) =>
    new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
  );

  return (
    <main className="blog-container">
      <h1 className="mb-8 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Últimas publicações
      </h1>
      {sorted.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum post publicado ainda.</p>
      ) : (
        <div className="space-y-6">
          {sorted.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
