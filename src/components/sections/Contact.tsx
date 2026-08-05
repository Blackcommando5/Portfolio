"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

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

type FormStatus = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // 🔄 TODO: Replace "YOUR_FORM_ID" with your actual Formspree form ID
    // Sign up at https://formspree.io, create a form, and paste the ID here.
    const FORM_ID = "YOUR_FORM_ID";
    const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or want to connect? Drop me a message."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Left: Contact info */}
          <div className="space-y-6">
            <GlassCard>
              <h3 className="font-display text-lg font-bold text-accent-cyan mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-cyan transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors">
                    <Mail size={16} className="text-text-muted group-hover:text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="text-sm">{siteConfig.email}</p>
                  </div>
                </a>

                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-cyan transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors">
                    <Phone size={16} className="text-text-muted group-hover:text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="text-sm">{siteConfig.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <MapPin size={16} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-sm">{siteConfig.location}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social links */}
            <GlassCard>
              <h3 className="font-display text-lg font-bold text-accent-violet mb-4">
                Online
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass glass-hover text-sm text-text-secondary hover:text-accent-cyan"
                >
                  <GitHubIcon size={16} />
                  GitHub
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass glass-hover text-sm text-text-secondary hover:text-accent-cyan"
                >
                  <LinkedInIcon size={16} />
                  LinkedIn
                </a>
                <a
                  href={siteConfig.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass glass-hover text-sm text-text-secondary hover:text-accent-cyan"
                >
                  <ExternalLink size={16} />
                  Portfolio
                </a>
              </div>
            </GlassCard>
          </div>

          {/* Right: Contact form */}
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border-glass text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border-glass text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border-glass text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <GlowButton type="submit" variant="primary" className="w-full">
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </GlowButton>

              {/* Status messages */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-accent-green text-sm">
                  <CheckCircle size={16} />
                  Message sent! I&apos;ll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
