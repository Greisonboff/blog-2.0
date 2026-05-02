import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Loading() {
  const [stage, setStage] = useState(0);

  const messages = [
    "",
    "Ligando os motores...",
    "Aquecendo os circuitos...",
    "Carregando os dados...",
    "Quase lá...",
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3000),
      setTimeout(() => setStage(4), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex fixed items-center justify-center h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.3)] z-50">
      <div className="flex flex-col items-center relative">
        <div className="flex ">
          {stage === 0 ? (
            <LoaderCircle className="animate-spin text-foreground" size={48} />
          ) : (
            <>
              <img
                className="w-[180px]"
                src="Loading 50 _ Among_Us.gif"
                alt="loading"
              />
              <p className="text-lg font-medium text-foreground bg-white px-4 py-2 rounded-full text-center mb-4 w-fit h-fit mt-[30px] translate-x-[-30%]">
                {messages[stage]}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
