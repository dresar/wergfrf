import { Suspense, lazy, useState, useEffect } from "react";
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
import { Preloader } from "@/components/ui/Preloader";
import { dataManager } from "@/services/dataManager";
import { FloatingWhatsApp } from '@/components/effects/FloatingWhatsApp';
import { ScrollToTop } from '@/components/effects/ScrollToTop';

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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have cached data for critical endpoints
    // If we do, we can skip the long loading animation
    const checkCache = () => {
      // Simple heuristic: check if profile data exists in localStorage
      // We assume dataManager uses the prefix defined in its config (default: portfolio_cache_)
      // This is a rough check to decide animation duration
      const hasCache = Object.keys(localStorage).some(key => key.startsWith('portfolio_cache_'));
      
      if (hasCache) {
        // Fast load for returning visitors (just enough time to prevent flicker)
        setTimeout(() => setIsLoading(false), 500);
      } else {
        // Longer animation for first-time visitors
        setTimeout(() => setIsLoading(false), 2500);
      }
    };

    checkCache();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ThemeApplicator />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {isLoading && <Preloader />}

          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <Suspense fallback={null}> {/* Fallback handled by Preloader initially */}
                <MaintenanceGuard>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  {/* Global Floating Elements */}
                  <FloatingWhatsApp />
                  <ScrollToTop />
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
