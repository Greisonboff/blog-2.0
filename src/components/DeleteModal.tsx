import { X } from "lucide-react";

type DeleteModalProps = {
  cancelDelete: () => void;
  confirmDelete: () => void;
  title: string;
  description?: string;
};

export function DeleteModal({
  cancelDelete,
  confirmDelete,
  title,
  description = "Tem certeza? Esta ação não pode ser desfeita.",
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="animate-fade-in mx-4 w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-card-foreground">
            {title}
          </h3>
          <button
            onClick={cancelDelete}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={cancelDelete}
            className="rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
