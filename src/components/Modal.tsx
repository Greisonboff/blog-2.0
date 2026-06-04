import { X } from "lucide-react";

interface ModalProps {
  title: string;
  handleClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

function Modal({ title, handleClose, children, className }: ModalProps) {
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`animate-fade-in mx-4 w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg ${className || ""}`}
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-card-foreground">
            {title}
          </h3>

          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
