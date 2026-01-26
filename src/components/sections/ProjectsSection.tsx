import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/hooks/useProjects';
import { useProjectCategories } from '@/hooks/useProjectCategories';
import { useModalStore } from '@/store/modalStore';
import { AISummaryModal } from '@/components/ui/AISummaryModal';

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categories } = useProjectCategories();
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const { openProjectModal } = useModalStore();
  const { projects = [], isLoading } = useProjects();
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
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project: any, index: number) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="neon-card group rounded-2xl overflow-hidden h-full relative">
                  {/* Thumbnail */}
                  <div 
                    className="relative aspect-video bg-muted overflow-hidden cursor-pointer"
                    onClick={() => openProjectModal(project)}
                  >
                    {project.thumbnail ? (
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <span className="text-sm">{t('projects.no_thumbnail')}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm text-primary">
                        {project.category_details?.name?.toUpperCase() || 'PROJECT'}
                      </span>
                    </div>

                    {/* AI Insight Button (Always Visible) */}
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiProject(project);
                        }}
                        className="p-3 rounded-full bg-background/90 backdrop-blur-md shadow-lg border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 group/ai"
                        title={t('projects.ai_summary') || 'AI Insight'}
                      >
                        <Sparkles className="w-5 h-5 animate-pulse group-hover/ai:animate-none" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 3).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {(Array.isArray(project.techStack) ? project.techStack : []).length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          +{(project.techStack?.length || 0) - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border/50">
                        {/* Links */}
                        <div className="flex gap-2">
                            {project.demoUrl && (
                                <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
                                onClick={(e) => e.stopPropagation()}
                                title="Live Demo"
                                >
                                <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {project.repoUrl && (
                                <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
                                onClick={(e) => e.stopPropagation()}
                                title="Repository"
                                >
                                <Github className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* View Details Button */}
                        <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-sm ml-auto flex items-center gap-2"
                        >
                        {t('sections.projects.viewDetails') || "Detail"}
                        <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                currentPage === 1
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              Previous
            </button>
            <span className="flex items-center text-muted-foreground text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* AI Summary Modal */}
      <AISummaryModal 
        isOpen={!!aiProject} 
        onClose={() => {
            if (aiProject) {
                 const totalSummaries = aiProject.summaries?.length || 1;
                 setSummaryIndices(prev => ({
                   ...prev,
                   [aiProject.id]: ((prev[aiProject.id] || 0) + 1) % totalSummaries
                 }));
            }
            setAiProject(null);
        }} 
        project={aiProject} 
        startIndex={aiProject ? (summaryIndices[aiProject.id] || 0) : 0}
      />
    </section>
  );
};
