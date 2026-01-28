import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/hooks/useProjects';
import { useProjectCategories } from '@/hooks/useProjectCategories';
import { useModalStore } from '@/store/modalStore';
import { AISummaryModal } from '@/components/ui/AISummaryModal';
import { Button } from '@/components/ui/button';

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categories } = useProjectCategories();
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const { openProjectModal } = useModalStore();
  const { projects = [], isLoading, isError } = useProjects();
  const [aiProject, setAiProject] = useState<any>(null);
  const [summaryIndices, setSummaryIndices] = useState<Record<number, number>>({});

  const filters = useMemo(() => [
    { id: 'all', label: t('projects.all_projects') },
    ...categories.map((c: any) => ({ id: c.id, label: c.name }))
  ], [categories, t]);

  const filteredProjects = projects.filter((project: any) =>
    activeFilter === 'all' ? true : project.category === activeFilter
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterId: number | 'all') => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      const section = document.getElementById('projects');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      const section = document.getElementById('projects');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 md:py-32 relative flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  if (isError) {
    return (
      <section id="projects" className="py-20 md:py-32 relative flex flex-col justify-center items-center text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Gagal Memuat Proyek</h3>
        <p className="text-muted-foreground mb-6">Terjadi kesalahan saat mengambil data proyek.</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Coba Lagi
        </Button>
      </section>
    );
  }

  return (
    <section id="projects" className="py-12 md:py-16 relative">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
            {t('nav.projects')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3">
            {t('sections.projects.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('sections.projects.subtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project: any) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => openProjectModal(project)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {project.github_url && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => window.open(project.github_url, '_blank')}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech: any) => (
                      <span
                        key={tech.id}
                        className="text-xs px-2 py-1 bg-secondary rounded-md"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-secondary rounded-md">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <button
                      onClick={() => setAiProject(project)}
                      className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      AI Summary
                    </button>
                    <button
                      onClick={() => openProjectModal(project)}
                      className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                      {t('common.read_more')} <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t('projects.no_projects')}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      <AISummaryModal
        isOpen={!!aiProject}
        onClose={() => setAiProject(null)}
        projectTitle={aiProject?.title || ''}
        projectDescription={aiProject?.description || ''}
      />
    </section>
  );
};
