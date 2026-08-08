"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

/* Brand icons (removed from lucide-react v1+) */
function GitHubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
function LinkedInIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/data";

/**
 * Direct contact only — no form.
 *
 * A form needs a backend, and a form whose backend is missing or misconfigured
 * fails silently: the visitor sees a success state and the message goes nowhere.
 * Email and phone links cannot fail that way, and the recipient is unambiguous.
 */
export function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get in Touch"
          subtitle="Open to full-time roles. Email is the fastest way to reach me."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Primary action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <GlowButton href={`mailto:${siteConfig.email}`} variant="primary">
              <Mail size={16} />
              Email me
            </GlowButton>
            <GlowButton
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              variant="secondary"
            >
              <Phone size={16} />
              Call
            </GlowButton>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Contact details */}
            <GlassCard>
              <h3 className="font-display text-lg font-bold text-accent-cyan mb-4">
                Contact
              </h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-cyan transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors shrink-0">
                    <Mail size={16} className="text-text-muted group-hover:text-accent-cyan" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="text-sm truncate">{siteConfig.email}</p>
                  </div>
                </a>

                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-cyan transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors shrink-0">
                    <Phone size={16} className="text-text-muted group-hover:text-accent-cyan" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="text-sm">{siteConfig.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-sm">{siteConfig.location}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Profiles */}
            <GlassCard>
              <h3 className="font-display text-lg font-bold text-accent-violet mb-4">
                Online
              </h3>
              <div className="space-y-2">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass glass-hover text-sm text-text-secondary hover:text-accent-cyan"
                >
                  <GitHubIcon size={16} />
                  GitHub
                  <ExternalLink size={12} className="ml-auto opacity-50" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass glass-hover text-sm text-text-secondary hover:text-accent-cyan"
                >
                  <LinkedInIcon size={16} />
                  LinkedIn
                  <ExternalLink size={12} className="ml-auto opacity-50" />
                </a>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
