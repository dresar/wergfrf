import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeApplicator } from "@/components/effects/ThemeApplicator";
import MaintenanceGuard from "@/components/MaintenanceGuard";

const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => {
  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThemeApplicator />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <MaintenanceGuard>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MaintenanceGuard>
              </Suspense>
            </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    </PersistQueryClientProvider>
);
};

export default App;
