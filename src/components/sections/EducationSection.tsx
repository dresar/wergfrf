import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Image, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEducation } from '@/hooks/useEducation';
import { useModalStore } from '@/store/modalStore';
import { ShinyButton } from '@/components/effects/Buttons';

export const EducationSection = () => {
  const { t } = useTranslation();
  const { openEducationGalleryModal, openEducationDocumentModal } = useModalStore();
  const { education = [], isLoading } = useEducation();

  if (isLoading) {
    return (
      <section id="education" className="py-20 md:py-32 relative flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="education" className="py-12 md:py-16 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
            {t('nav.education')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3">
            {t('sections.education.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('sections.education.subtitle')}
          </p>
        </motion.div>

        {/* Education Grid/Slider */}
        <div className="relative">
          {/* Mobile: Horizontal Scroll / Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                className="min-w-[85vw] md:min-w-0 snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-strong rounded-2xl p-5 hover:glow-primary transition-all duration-300 h-full flex flex-col border border-border/50">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-heading font-bold mb-1 leading-tight line-clamp-2">{edu.institution}</h3>
                      <p className="text-primary text-sm font-medium line-clamp-1">{edu.degree}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                     <p className="text-muted-foreground text-xs line-clamp-1">{edu.field}</p>
                     
                     <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {edu.startDate} - {edu.endDate || t('common.present')}
                        </div>
                        {edu.gpa && (
                          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md text-primary font-medium">
                            <Award className="w-3.5 h-3.5" />
                            {t('education.gpa')} {edu.gpa}
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border mt-auto">
                    {edu.gallery && edu.gallery.length > 0 && (
                      <ShinyButton
                        onClick={() => openEducationGalleryModal(edu)}
                        className="text-[10px] px-2.5 py-1.5 h-auto"
                      >
                        <Image className="w-3 h-3 mr-1.5" />
                        {t('education.gallery')}
                      </ShinyButton>
                    )}
                    {edu.attachments && edu.attachments.length > 0 && (
                      <ShinyButton
                        onClick={() => openEducationDocumentModal(edu.attachments[0], 'Document')}
                        className="text-[10px] px-2.5 py-1.5 h-auto"
                      >
                        <FileText className="w-3 h-3 mr-1.5" />
                        {t('education.docs')}
                      </ShinyButton>
                    )}
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
