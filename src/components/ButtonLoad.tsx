import { Loader2, LoaderCircle } from "lucide-react";

interface ButtonLoadProps {
  title: string;
  loading: boolean;
  onClick?: () => void;
  className?: string;
  type: "button" | "submit";
}
export function ButtonLoad({
  title,
  loading,
  onClick,
  className,
  type,
}: ButtonLoadProps) {
  return (
    <button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center ${className}`}
    >
      {loading ? (
        <LoaderCircle className="animate-spin text-foreground" size={20} />
      ) : (
        title
      )}
    </button>
  );
}
