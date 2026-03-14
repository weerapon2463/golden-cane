// App.tsx — Main application without routing (for testing)

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CropProvider } from "./contexts/CropContext";
import Home from "./pages/Home";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CropProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            <Home />
          </TooltipProvider>
        </CropProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
