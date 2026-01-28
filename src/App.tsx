import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

// Configure Query Client for Real-time In-Memory Caching
// Tidak menggunakan persistensi localStorage, data hanya hidup di memory (session)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap stale (basi) hampir seketika untuk memastikan real-time
      // namun diberi buffer kecil (5 detik) untuk mencegah duplicate request berlebihan
      // saat komponen re-render cepat.
      staleTime: 5000, 
      
      // Data disimpan di memory (cache) selama 10 menit jika tidak digunakan
      gcTime: 1000 * 60 * 10, 
      
      // Refetch saat window fokus kembali (user balik ke tab)
      refetchOnWindowFocus: true,
      
      // Retry 1 kali jika gagal, lalu error
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Memuat data real-time...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MaintenanceGuard>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
