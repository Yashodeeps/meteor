import Timer from "./components/Timer";
import Goals from "./components/Goals";
import { ModeToggle } from "./components/mode-toggle";

const BackgroundMedia = () => {
  return (
    <div className="absolute top-0 left-0   w-full min-h-screen overflow-hidden z-0">
      {/* <video
        className="min-w-full min-h-screen absolute object-cover"
        src="../space.mp4"
        autoPlay
        loop
        muted
      /> */}
      <img
        className="min-w-full min-h-screen absolute object-cover"
        src="/default.jpg"
        alt="space"
      />
    </div>
  );
};

const App = () => {
  return (
    <div className="relative flex flex-col h-full  font-retro ">
      <BackgroundMedia />
      <div className="relative z-10 h-full ">
        <div>
          <img className="w-32 m-6 " src="/meteor.png" alt="logo" />
        </div>
        <div className="dark:text-white text-xl h-full flex items-center justify-center ">
          <Timer />
          <div className="absolute top-8 right-8 flex flex-col gap-5">
            <ModeToggle />
            <Goals />
            {/* <ChromeShortcuts /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
