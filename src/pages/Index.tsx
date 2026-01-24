import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { GlobalModal } from '@/components/GlobalModal';
import { BlobCursor } from '@/components/effects/BlobCursor';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Custom Cursor - Hidden on mobile */}
      <div className="hidden lg:block">
        <BlobCursor />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Global Modal System */}
      <GlobalModal />
    </div>
  );
};

export default Index;
