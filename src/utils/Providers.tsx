import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { TimeProvider } from "./TimeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TimeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TimeProvider>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
