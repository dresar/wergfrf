import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Projects = lazy(() => import("./pages/admin/Projects"));
const ProjectForm = lazy(() => import("./pages/admin/ProjectForm"));
const Inbox = lazy(() => import("./pages/admin/Inbox"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Skills = lazy(() => import("./pages/admin/Skills"));
const ExperienceManager = lazy(() => import("./pages/admin/ExperienceManager"));
const EducationManager = lazy(() => import("./pages/admin/EducationManager"));
const CertificateManager = lazy(() => import("./pages/admin/CertificateManager"));
const WATemplateManager = lazy(() => import("./pages/admin/WATemplateManager"));
const ContentEditor = lazy(() => import("./pages/admin/ContentEditor"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { ThemeApplicator } from "@/components/effects/ThemeApplicator";

// Admin Layout Wrapper
const AdminLayout = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThemeApplicator />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/projects" element={<Projects />} />
                    <Route path="/admin/projects/new" element={<ProjectForm />} />
                    <Route path="/admin/projects/:id" element={<ProjectForm />} />
                    <Route path="/admin/inbox" element={<Inbox />} />
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route path="/admin/skills" element={<Skills />} />
                    <Route path="/admin/experience" element={<ExperienceManager />} />
                    <Route path="/admin/education" element={<EducationManager />} />
                    <Route path="/admin/certificates" element={<CertificateManager />} />
                    <Route path="/admin/wa-templates" element={<WATemplateManager />} />
                    <Route path="/admin/content" element={<ContentEditor />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
