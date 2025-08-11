import TimerManager from "./components/TimerManager";

import Toolbar from "./components/Toolbar";

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
      <div className="relative z-10 h-full bg-transparent ">
        <div>
          <img
            className=" absolute top-3 left-3 w-32  "
            src="/meteor.png"
            alt="logo"
          />
        </div>
        <div className="dark:text-white text-xl h-full flex items-center justify-center ">
          <TimerManager />
          <div className="absolute top-20 left-8 flex flex-col gap-5">
            {/* <Goals />
            <Shortcuts /> */}
            <Toolbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
