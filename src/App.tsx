import Timer from "./components/Timer";
import Goals from "./components/Goals";

const BackgroundVideo = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <video
        className="min-w-full min-h-full absolute object-cover"
        src="../public/space.mp4"
        autoPlay
        loop
        muted
      />
    </div>
  );
};

const App = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-zinc-900 font-retro ">
      <BackgroundVideo />
      <div className="relative z-10">
        {" "}
        <div>
          {" "}
          <img className="w-32 m-6 " src="/meteor.png" alt="logo" />
        </div>
        <div className="text-white text-xl flex-col p-4 flex items-center justify-center">
          {" "}
          <Timer />
          <Goals />
        </div>
      </div>
    </div>
  );
};

export default App;
