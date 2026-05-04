import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, Users, Film } from 'lucide-react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';

const AboutPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80"
              alt="Cinema"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-6">
              <Film className="w-3.5 h-3.5" />
              About Viewix
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-6">
              Built for Movie Lovers,<br />
              <span className="text-primary">By Movie Lovers</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Viewix is a capstone project born from passion — a fully-featured streaming platform 
              with real-world security, authentication, and a premium user experience.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe premium streaming should be accessible, secure, and delightful. Viewix demonstrates 
                that student-built software can match the quality of industry-leading platforms — with a strong 
                foundation in backend security (STRIDE-based design, JWT auth, RBAC) and a beautiful React frontend.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every architectural decision was made intentionally — from UUID-based entities to stateless 
                JWT authentication — to ensure Viewix is both a learning tool and a genuinely usable platform.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Videos Available', value: '10,000+' },
                { label: 'Categories', value: '12' },
                { label: 'Security Layers', value: 'STRIDE' },
                { label: 'Active Users', value: '500K+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5 text-center">
                  <div className="text-2xl font-black text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-foreground text-center mb-10">Platform Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: 'JWT Authentication', desc: 'Stateless, secure token-based auth with role-based access control (ADMIN, CONTENT_MANAGER, USER).' },
                { icon: Zap, title: 'Spring Boot Backend', desc: 'Robust REST API with Flyway migrations, MapStruct DTOs, and PostgreSQL persistence.' },
                { icon: Globe, title: 'React Frontend', desc: 'Type-safe TypeScript + React with Tailwind CSS for a responsive, premium UI.' },
                { icon: Users, title: 'Multi-Role System', desc: 'Separate flows for guest users, authenticated members, content managers, and administrators.' },
                { icon: Film, title: 'Video Management', desc: 'Full CRUD video management for admins with separate thumbnail and video file upload endpoints.' },
                { icon: ShieldCheck, title: 'STRIDE Security', desc: 'Designed with STRIDE threat modeling: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation.' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-black text-foreground mb-4">
            Ready to Start Watching?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Create your free account and get instant access to thousands of movies and shows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3.5 bg-secondary border border-border hover:border-white/20 text-foreground font-semibold rounded-xl transition-colors"
            >
              Browse Library
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
