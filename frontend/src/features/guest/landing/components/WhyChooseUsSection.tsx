import { Tv, ListChecks, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: Tv,
    title: 'HD Streaming',
    description: 'Enjoy crystal-clear 4K HDR video with Dolby Atmos surround sound on any device.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: ListChecks,
    title: 'Personalized Watchlists',
    description: 'Curate your own library. Save titles, track what you\'ve watched, and never lose your place.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Accounts',
    description: 'Your data is protected with industry-grade JWT authentication and role-based access control.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Optimized streaming engine ensures minimal buffering and instant playback, anywhere.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
];

const WhyChooseUsSection = (): JSX.Element => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Why Choose <span className="text-primary">Viewix</span>?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            A premium streaming experience designed from the ground up for movie lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group p-6 rounded-2xl border ${feature.bg} hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
