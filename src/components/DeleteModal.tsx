import { X } from "lucide-react";
import { M } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import Modal from "./Modal";

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
    <Modal title={title} handleClose={cancelDelete}>
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
    </Modal>
  );
}
