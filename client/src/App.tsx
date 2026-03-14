// App.tsx — Main application with routing

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CropProvider } from "./contexts/CropContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import CalculatorPage from "./pages/Calculator";
import Trends from "./pages/Trends";
import Guide from "./pages/Guide";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compare" component={Compare} />
        <Route path="/calculator" component={CalculatorPage} />
        <Route path="/trends" component={Trends} />
        <Route path="/guide" component={Guide} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CropProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            <WouterRouter base={import.meta.env.BASE_URL}>
              <AppRoutes />
            </WouterRouter>
          </TooltipProvider>
        </CropProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
