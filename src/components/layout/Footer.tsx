
import React from 'react';
import { ExternalLink, Github, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 mt-auto relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground flex items-center">
              © {currentYear}{" "}
              <span className="hidden sm:inline mx-1">Smart Budget Management</span>
              <span className="mx-1 flex items-center">
                Made with <Heart size={12} className="mx-1 text-red-500" /> by Code with Edison
              </span>
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a 
              href="https://github.com/codewithedison" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors icon-animate"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a 
              href="mailto:contact@example.com" 
              className="text-muted-foreground hover:text-primary transition-colors icon-animate"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a 
              href="https://example.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors icon-animate"
              aria-label="Website"
            >
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
