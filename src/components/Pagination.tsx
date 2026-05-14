import { useNavigate } from "react-router-dom";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: Props) {
  const navigate = useNavigate();

  function onPageChange(page: number) {
    navigate(`?page=${page}`);

    scrollTo({ behavior: "smooth", top: 0 });
  }

  const style = "border border-muted rounded px-3 py-1 text-sm hover:bg-muted";

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 justify-center mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={
              page === currentPage ? "font-bold !bg-gray-200 " + style : style
            }
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
