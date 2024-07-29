import Timer from "./components/Timer";
import Goals from "./components/Goals";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 gap-4 font-retro">
      <div>
        {" "}
        <h1 className="text-2xl font-bold p-4 text-zinc-600">Meteor</h1>
      </div>
      <div className="text-white text-xl flex-col p-4 flex items-center justify-center">
        {" "}
        <Timer />
        <Goals />
      </div>
    </div>
  );
};

export default App;
