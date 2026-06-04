import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Blog 2.0</span>. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};
