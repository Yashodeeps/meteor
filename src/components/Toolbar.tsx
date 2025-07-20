import { Timer } from "lucide-react";

import { Button } from "./ui/button";
import ToolTipButton from "./ToolTipButton";

const Toolbar = () => {
  return (
    <div className="flex flex-col gap-2 ">
      <ToolTipButton tooltipContent="Add mission timers" side="right">
        <Button size={"icon"} variant="ghost" className="hover:bg-sky-900">
          <Timer />
        </Button>
      </ToolTipButton>
    </div>
  );
};

export default Toolbar;
