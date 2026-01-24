import { motion } from 'framer-motion';
import { Download, ArrowDown, Briefcase, Code2 } from 'lucide-react';
import { heroData } from '@/data/portfolioData';
import { ParticlesBackground } from '@/components/effects/ParticlesBackground';
import { DecryptedText, SplitText } from '@/components/effects/TextEffects';
import { ShinyButton, BorderBeamButton } from '@/components/effects/Buttons';

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.p
            className="text-muted-foreground text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hello, I'm
          </motion.p>

          {/* Name with Decrypted Effect */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DecryptedText text={heroData.name} delay={500} />
          </motion.h1>

          {/* Rotating Roles */}
          <motion.div
            className="text-2xl md:text-4xl font-heading font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SplitText 
              texts={heroData.professions.map(p => p.title)} 
              className="justify-center"
            />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {heroData.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ShinyButton variant="primary">
              <Download className="w-4 h-4 mr-2 inline" />
              Unduh Resume
            </ShinyButton>
            <BorderBeamButton onClick={scrollToProjects}>
              <Code2 className="w-4 h-4" />
              Lihat Karya
            </BorderBeamButton>
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="glass px-6 py-3 rounded-xl flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-primary">4+</p>
                <p className="text-xs text-muted-foreground">Years Exp.</p>
              </div>
            </motion.div>

            <motion.div
              className="glass px-6 py-3 rounded-xl flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Code2 className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm">Scroll Down</span>
          <ArrowDown className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
};
