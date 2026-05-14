import { useAuth } from "@/contexts/AuthContext";
import { defaultAvatar } from "@/lib/utils";
import { useState } from "react";

type AvatarFileProps = {
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
};

export function AvatarFile({ avatarFile, setAvatarFile }: AvatarFileProps) {
  const { user } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(user?.img?.url || defaultAvatar);

  const isDefaultAvatar = avatarUrl === defaultAvatar;

  return (
    <div className="flex flex-col items-center">
      <img
        src={avatarFile ? URL.createObjectURL(avatarFile!) : avatarUrl}
        alt="Avatar do usuário"
        className="mb-2 h-32 w-32 rounded-full object-cover"
      />

      <input
        id="avatar"
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
      />
      <div className="flex gap-3 mt-2">
        <label
          htmlFor="avatar"
          className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {avatarFile || !isDefaultAvatar
            ? "Alterar avatar"
            : "Adicionar avatar"}
        </label>
        {avatarFile || !isDefaultAvatar ? (
          <button
            type="button"
            className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => {
              setAvatarUrl(defaultAvatar);
              setAvatarFile(null);
            }}
          >
            Remover avatar
          </button>
        ) : null}
      </div>
    </div>
  );
}
