import React from 'react';
import { Leaf, ShieldAlert, Map, Sparkles, Award, TrendingUp, HelpCircle, ArrowRight, Zap, Target, BookOpen, Users } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (tab: string) => void;
  onSetUser: (user: any) => void;
}

export default function LandingView({ onNavigate, onSetUser }: LandingViewProps) {
  // Preset demo logins for quick evaluation
  const loginAs = (email: string) => {
    // We can simulate landing directly in those views
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    })
    .then(res => {
      if (!res.ok) throw new Error('Authentication failed');
      return res.json();
    })
    .then(data => {
      if (data && data.user) {
        onSetUser(data.user);
        if (data.user.role === 'institution') {
          onNavigate('institution');
        } else if (data.user.role === 'city_admin' || data.user.role === 'municipality_officer') {
          onNavigate('city');
        }
      }
    })
    .catch(err => {
      console.error('Quick login failed', err);
    });
  };

  return (
    <div id="landing-container" className="bg-slate-900 text-white min-h-screen selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-radial from-slate-800 via-slate-900 to-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* SDG Align Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" /> Aligned with UN SDG 11 & SDG 12
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight mb-6">
              Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Waste Data</span> into Sustainable City Intelligence
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              An AI-powered Waste Intelligence Platform facilitating data-driven decision-making, predictive forecast analysis, and dynamic heatmaps to help smart cities achieve SDG 11.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                id="btn-get-started"
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 transition duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </button>
              <button
                id="btn-explore-about"
                onClick={() => onNavigate('about')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-4 rounded-xl border border-slate-700 transition duration-200"
              >
                Learn More
              </button>
            </div>

            {/* Quick Demo Buttons for Evaluators */}
            <div className="mt-12 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl max-w-lg w-full flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest text-center font-medium">
                ⚡ Reviewer Quick-Access Portals
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => loginAs('marriot@ecocity.ai')}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  Guest Institution
                </button>
                <button
                  onClick={() => loginAs('admin@ecocity.ai')}
                  className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  Guest City Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Goals Alignment Section */}
      <div className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Strategic UN SDGs Integration</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Connecting local institutions to municipal planning loops through transparent ecological tracking.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SDG 11 Card */}
            <div className="p-8 bg-gradient-to-br from-amber-900/20 to-orange-950/20 border border-amber-500/20 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl rounded-2xl mb-6 shadow-md shadow-amber-500/10">11</div>
                <h3 className="text-xl font-bold mb-3 text-amber-300">SDG 11: Sustainable Cities</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Empowers local municipal administrators with micro-level geographic analytics to coordinate bin distribution, schedule custom waste pickups, and optimize smart city parameters to dramatically reduce landfill footprints.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-amber-400">
                <span>● Heatmaps</span>
                <span>● Urban indexes</span>
                <span>● Predictive grids</span>
              </div>
            </div>

            {/* SDG 12 Card */}
            <div className="p-8 bg-gradient-to-br from-emerald-990/20 to-teal-950/10 border border-emerald-500/20 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-2xl rounded-2xl mb-6 shadow-md shadow-emerald-500/10">12</div>
                <h3 className="text-xl font-bold mb-3 text-emerald-300">SDG 12: Responsible Consumption</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Provides standard restaurants, resorts, and hostels with precise food conservation forecasting models, alerting kitchen operators to scale daily food preparation volumes relative to attendance patterns.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
                <span>● Reporting metrics</span>
                <span>● Resource efficiency</span>
                <span>● Actionable tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Platform Infrastructure</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">Real-time analytical suites configured for instant deployment across commercial and governmental sectors.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Map className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base mb-2">Smart City GIS Heatmap</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Visualizes geographic zones color-coded dynamically by low, medium, and high waste generation. Hotspots respond dynamically as raw reports change.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base mb-2">Predictive AI Forecasts</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Applies predictive forecasting algorithms on historical activities and holidays to anticipate tomorrow's attendance and organic waste levels.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base mb-2">Sustainability Index</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ranks city blocks using a custom formula weighted by waste reduction, recycling efficiency, collection indices, and resource conservation.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base mb-2">Actionable AI Engine</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Translates historical numbers and active reports into tailored municipal strategies and commercial waste mitigation guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action & Preview Section */}
      <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-800/30 border border-slate-700/50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Empowering Municipal Solid Waste Optimization</h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                Are you a restaurant manager planning tomorrow's meals, or a city council officer coordinating container logistics? EcoNexus connects the dots automatically. Register your profile to get immediate diagnostic indexes.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition"
                >
                  Create Main Profile
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-3 rounded-xl text-sm border border-slate-700 transition"
                >
                  View Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-bold text-slate-300 text-sm tracking-wide">ECONEXUS</p>
            <p className="mt-1 text-slate-500">Waste Intelligence & Predictive Eco-Infrastructure Platform</p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">About SDGs</button>
            <button onClick={() => onNavigate('login')} className="hover:text-emerald-400 transition">Portal Account</button>
            <span className="text-slate-700">|</span>
            <span>Version 1.2.0 (Stable Production)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
