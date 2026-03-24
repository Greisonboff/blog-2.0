export function Loading() {
  return (
    <div className="flex absolute items-center justify-center h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.5)] z-50">
      <div className="flex flex-col items-center relative">
        <img
          className="w-[180px]"
          src="../../../public/Loading 50 _ Among_Us.gif"
          alt="loading"
        />
        <div className="flex items-center gap-1 absolute bottom-[22px]">
          <span className="w-3 h-3 bg-[#000] rounded-full animate-bounce [animation-duration:0.3s]"></span>
          <span className="w-3 h-3 bg-[#000] rounded-full animate-bounce [animation-duration:0.3s] [animation-delay:0.15s]"></span>
          <span className="w-3 h-3 bg-[#000] rounded-full animate-bounce [animation-duration:0.3s] [animation-delay:0.3s]"></span>
        </div>
      </div>
    </div>
  );
}
