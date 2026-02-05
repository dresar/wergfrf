import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExperience } from '@/hooks/useExperience';

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const { experiences = [], isLoading } = useExperience();

  if (isLoading) {
    return (
      <section id="experience" className="py-6 md:py-12 relative bg-card/30 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  const formatDate = (dateString: string | Date | undefined) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const locale = t('common.present') === 'Sekarang' ? 'id-ID' : 'en-US';
      return date.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="py-6 md:py-8 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
            {t('nav.experience')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3">
            {t('sections.experience.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('sections.experience.subtitle')}
          </p>
        </motion.div>

        {/* Experience Grid/Slider */}
        <div className="relative">
          {/* Mobile: Horizontal Scroll / Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="min-w-[85vw] md:min-w-0 snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-strong rounded-2xl p-6 hover:glow-primary transition-all duration-300 h-full flex flex-col border border-border/50 dark:bg-card/50 bg-white shadow-sm hover:shadow-md">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-heading font-bold mb-1 leading-tight line-clamp-2">{exp.role}</h3>
                      <div className="text-primary font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="line-clamp-1">{exp.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                      <Calendar className="w-4 h-4" />
                      {formatDate(exp.startDate)} - {exp.isCurrent ? t('common.present') : (exp.endDate ? formatDate(exp.endDate) : t('common.present'))}
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
