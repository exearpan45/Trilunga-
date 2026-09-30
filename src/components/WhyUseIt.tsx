import React from 'react';
import {
  Zap,
  ShieldCheck,
  Languages,
  UserX,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Plane,
  Briefcase,
  BookOpen,
  Send,
  Lock,
} from 'lucide-react';

export const WhyUseIt: React.FC = () => {
  const whyPoints = [
    {
      icon: Zap,
      title: 'Fast',
      description: 'Instant translations with a lightweight architecture that loads in milliseconds on any connection.',
    },
    {
      icon: Sparkles,
      title: 'Simple',
      description: 'Zero clutter, zero configuration. Clean, focused interface with seamless one-click controls.',
    },
    {
      icon: ShieldCheck,
      title: '100% Free',
      description: 'Built on open-source technologies with a ₹0 budget requirement. No credit cards or hidden paywalls.',
    },
    {
      icon: UserX,
      title: 'No Account',
      description: 'Start translating immediately without registering, logging in, or providing personal credentials.',
    },
    {
      icon: Languages,
      title: 'Three Useful Languages',
      description: 'Purpose-built for deep linguistic accuracy across English, Hindi (हिंदी), and Bengali (বাংলা).',
    },
    {
      icon: Lock,
      title: 'Privacy-Conscious',
      description: 'Your translation history stays strictly stored on your own device. Nothing is saved to central databases.',
    },
  ];

  const useCases = [
    {
      icon: GraduationCap,
      title: 'Students & Academics',
      description: 'Translate study materials, essay excerpts, and research notes between English, Hindi, and Bengali.',
    },
    {
      icon: MessageSquare,
      title: 'Everyday Communication',
      description: 'Chat effortlessly with friends, relatives, and neighbors across linguistic boundaries.',
    },
    {
      icon: Plane,
      title: 'Travel & Exploration',
      description: 'Navigate public transit, train stations, signs, and directions across India and Bangladesh.',
    },
    {
      icon: Send,
      title: 'Messaging & Social Media',
      description: 'Craft accurate text messages, WhatsApp updates, and community posts with proper Unicode scripts.',
    },
    {
      icon: BookOpen,
      title: 'Learning Languages',
      description: 'Compare syntax and expressions side-by-side to master spoken and written Hindi and Bengali.',
    },
    {
      icon: Briefcase,
      title: 'Basic Work Communication',
      description: 'Quickly draft workplace notices, emails, and collaborative notes for multilingual teams.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      {/* Why Use It? */}
      <div className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Use TriLingua?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Designed from the ground up as a fast, accessible, zero-cost translator for the community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Common Use Cases
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            See how learners, professionals, and travelers rely on TriLingua every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
