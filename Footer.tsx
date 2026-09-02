import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface FooterProps {
  categories: string[];
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer id="footer-subscribe-section" className="mt-16 border-t border-slate-200 bg-white pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
                <div className="w-3 h-3 bg-white rounded-xs"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 italic">
                DevJournal
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Thoughtful essays, architectural insights, and practical guides for software engineers, systems thinkers, and interface designers.
            </p>
          </div>

          {/* Quick Category Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Browse Topics
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {categories.filter((c) => c !== 'All').map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Join the Dispatch
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated essays and design breakdowns delivered to your inbox every Thursday morning.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You are subscribed! Check your inbox for confirmation.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DevJournal. Content loaded from static JSON.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms</span>
            <span className="hover:text-slate-700 cursor-pointer">RSS Feed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
