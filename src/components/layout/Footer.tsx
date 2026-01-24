import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { contactData } from '@/data/portfolioData';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-xl font-heading font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-primary">E</span>ka
            <span className="text-primary">.</span>
          </motion.a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Eka Syarif Maulana. Made with{' '}
            <Heart className="w-4 h-4 inline text-destructive mx-1" fill="currentColor" />
            in Indonesia
          </p>

          {/* Quick Links */}
          <div className="flex gap-4">
            {contactData.socialLinks.slice(0, 4).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
