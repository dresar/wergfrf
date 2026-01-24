import { motion } from 'framer-motion';
import { Download, ArrowRight, Linkedin, Github, Twitter, Instagram, CheckCircle, Briefcase } from 'lucide-react';
import { heroData } from '@/data/portfolioData';
import { ParticlesBackground } from '@/components/effects/ParticlesBackground';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { ShinyButton, BorderBeamButton } from '@/components/effects/Buttons';

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Greeting */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-4 flex items-center justify-center lg:justify-start gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Halo, Saya <span className="text-2xl">👋</span>
            </motion.p>

            {/* Name with Gradient */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
                {heroData.name}
              </span>
            </motion.h1>

            {/* Role with Typewriter Effect */}
            <motion.div
              className="text-xl md:text-2xl lg:text-3xl font-heading font-medium text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TypewriterText 
                texts={heroData.professions.map(p => p.title)} 
              />
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {heroData.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ShinyButton variant="primary">
                <Download className="w-4 h-4 mr-2 inline" />
                Unduh Resume
              </ShinyButton>
              <BorderBeamButton onClick={scrollToProjects}>
                Lihat Karya
                <ArrowRight className="w-4 h-4 ml-2" />
              </BorderBeamButton>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Image with Floating Badges */}
          <motion.div
            className="order-1 lg:order-2 relative flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Glow Effect Behind Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Border Beam Animation */}
            <motion.div
              className="absolute w-72 h-72 md:w-[340px] md:h-[340px] lg:w-[420px] lg:h-[420px] rounded-3xl"
              style={{
                background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent 30%)',
                padding: '3px',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-3xl bg-background" />
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="relative w-64 h-80 md:w-80 md:h-[400px] lg:w-96 lg:h-[480px] rounded-3xl overflow-hidden border-2 border-border/50 z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://placehold.co/600x800/1a1a1a/00D2D3?text=Your+Photo"
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Badge - Top Right */}
            <motion.div
              className="absolute -top-4 -right-4 md:top-4 md:right-0 lg:-right-8 glass-strong px-4 py-3 rounded-2xl z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">50+</p>
                  <p className="text-xs text-muted-foreground">Project Selesai</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge - Bottom Left */}
            <motion.div
              className="absolute -bottom-4 -left-4 md:bottom-8 md:left-0 lg:-left-8 glass-strong px-4 py-3 rounded-2xl z-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">5+</p>
                  <p className="text-xs text-muted-foreground">Tahun Pengalaman</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
