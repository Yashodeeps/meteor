import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolTipButtonProps {
  children: React.ReactNode;
  tooltipContent: string | React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  offset?: number;
}

const ToolTipButton = ({
  children,
  tooltipContent,
  side = "top",
  offset = 8,
}: ToolTipButtonProps) => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={offset}
          side={side}
          className="bg-transparent text-white text-md"
        >
          {" "}
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ToolTipButton;
