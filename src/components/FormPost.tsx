interface FormPostProps {
  titulo: string;
  setTitulo: React.Dispatch<React.SetStateAction<string>>;
  conteudo: string;
  setConteudo: React.Dispatch<React.SetStateAction<string>>;
  imagemUrl: File | string | null;
  setImagemUrl: React.Dispatch<React.SetStateAction<File | string | null>>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  errors: Record<string, string>;
  handleCancel?: () => void;
  submitText?: string;
}
function FormPost({
  titulo,
  setTitulo,
  conteudo,
  setConteudo,
  imagemUrl,
  setImagemUrl,
  handleSubmit,
  errors,
  handleCancel,
  submitText = "Publicar",
}: FormPostProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          URL da imagem (opcional)
        </label>
        <div className="flex flex-col items-center pt-4">
          {imagemUrl && (
            <img
              src={
                typeof imagemUrl === "string"
                  ? imagemUrl
                  : URL.createObjectURL(imagemUrl!)
              }
              alt="Avatar do usuário"
              className="mb-2  w-[200px] object-cover max-h-[200px]"
            />
          )}

          <input
            id="imagem"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(e) => setImagemUrl(e.target.files?.[0] || null)}
          />

          <div className="flex gap-3 mt-2">
            <label
              htmlFor="imagem"
              className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {imagemUrl ? "Alterar imagem" : "Adicionar imagem"}
            </label>
            {imagemUrl ? (
              <button
                type="button"
                className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={() => {
                  setImagemUrl(null);
                }}
              >
                Remover imagem
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Título *
        </label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Digite o título do post"
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-destructive">{errors.titulo}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Conteúdo *
        </label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={8}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Escreva o conteúdo do seu post (mín. 10 caracteres)"
        />
        {errors.conteudo && (
          <p className="mt-1 text-sm text-destructive">{errors.conteudo}</p>
        )}
      </div>

      <div className="flex gap-3 justify-center items-center">
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {submitText}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormPost;
