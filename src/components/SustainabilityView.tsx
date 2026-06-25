import React, { useState, useEffect } from 'react';
import { ZoneMetrics } from '../types';
import { Award, Leaf, TrendingUp, HelpCircle, ArrowRight, Activity, Zap, Star, ShieldCheck, Clipboard, Trophy, ArrowLeft, Cpu, Sparkles, Scale, Lock, Eye, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SustainabilityViewProps {
  onNavigate?: (tab: string) => void;
}

export default function SustainabilityView({ onNavigate }: SustainabilityViewProps) {
  const [metrics, setMetrics] = useState<ZoneMetrics[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('Resort');
  const [loading, setLoading] = useState(false);

  const [activeWeightCard, setActiveWeightCard] = useState<string | null>(null);
  
  // AI recommendations states
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsLogs, setRecsLogs] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<{
    predictedHotspots: { title: string; description: string }[];
    mitigationStrategy: { step: string; text: string }[];
  } | null>(null);
  const [recsError, setRecsError] = useState<string | null>(null);

  const generateAIRecommendations = async () => {
    setRecsLoading(true);
    setRecsError(null);
    setRecommendations(null);
    setRecsLogs([]);

    // Force refresh frontend metrics & leaderboards to sync new data
    fetchMetrics();
    fetchLeaderboard();

    const steps = [
      "Initializing IBM Granite™ Core AI Engine orchestration node...",
      "Polling live database registries from Metropool configuration...",
      "Extracting leadership indicators: Zone D vs Zone B divergence statistics...",
      "Scanning enterprise operations for <75 audit compliance alarms...",
      "Structuring predictive risk vectors in Entity Extraction format...",
      "Mapping tailored mitigation checklists to SDG 11 and SDG 12 frameworks..."
    ];

    // progressive workflow wait loops for ultra realistic live agent tracking feel
    for (let i = 0; i < steps.length; i++) {
      setRecsLogs(prev => [...prev, steps[i]]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      const res = await fetch('/api/ai/policy-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        throw new Error("The Advisory Node returned an invalid code structure.");
      }
      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setRecsError(err?.message || "Failed to finalize dynamic policy instructions.");
    } finally {
      setRecsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchLeaderboard();
  }, []);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/sustainability-index')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Sort from high score to low score for leadership
          const sorted = [...data].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
          setMetrics(sorted);
        } else {
          setMetrics([]);
        }
      })
      .catch(err => {
        console.error(err);
        setMetrics([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchLeaderboard = () => {
    fetch('/api/institution-leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          setLeaderboard([]);
        }
      })
      .catch(err => {
        console.error(err);
        setLeaderboard([]);
      });
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        
        {onNavigate && (
          <button
            onClick={() => onNavigate('landing')}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono bg-slate-950/40 border border-slate-800/80 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Portal
          </button>
        )}

        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
              <Award className="w-8 h-8 text-emerald-400" /> Urban Sustainability Index (USI)
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              SDG 11 metric benchmarking structural waste reduction, recycling purity, and smart logistics
            </p>
          </div>
          <button
            onClick={() => { fetchMetrics(); fetchLeaderboard(); }}
            className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 border border-slate-700 rounded-lg transition"
          >
            Refresh Indicators
          </button>
        </div>

        {/* Interactive Scoring Blueprint & IBM Granite AI Panel Card */}
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          {/* IBM Granite AI Advisory Panel */}
          <div id="ibm-granite-panel" className="lg:col-span-12 bg-slate-950/60 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            {/* Subtle aesthetic accent light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-indigo-400" /> IBM Granite AI Advisory
                </h3>
                <span className="text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded bg-indigo-500/10 uppercase tracking-widest">
                  Agent Node
                </span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
                Orchestrate an AI Agentic Workflow over live metropolitan leaderboard data to evaluate zone disparities (Zone D vs. Zone B) and draft targeted policy responses.
              </p>

              {/* Workflow log loader */}
              {recsLoading && (
                <div id="ai-workflow-logs" className="p-4 bg-slate-900 border border-slate-850 rounded-2xl mb-6 font-mono text-[10.5px]">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                    <span>AGENT WORKFLOW ACTIVE</span>
                  </div>
                  <div className="space-y-1.5 text-slate-400 transition-all duration-300">
                    {recsLogs.map((log, lidx) => (
                      <div key={lidx} className="flex gap-2">
                        <span className="text-indigo-450 font-bold">›</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action output recommendations panel */}
              {recommendations && !recsLoading && (
                <div id="ai-policy-output-panels" className="space-y-5 mb-6 overflow-y-auto max-h-[295px] pr-1 scrollbar-thin">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5 mb-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Predicted Hotspots
                    </h4>
                    <div className="space-y-2 font-sans">
                      {recommendations.predictedHotspots.map((spot, sidx) => (
                        <div key={sidx} className="p-3 bg-slate-900 border border-slate-850 rounded-xl relative hover:border-slate-700 transition">
                          <strong className="text-xs font-bold text-slate-150 block mb-1">
                            {spot.title}
                          </strong>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {spot.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5 mb-2.5">
                      <Sparkles className="w-4.5 h-4.5 text-indigo-450" /> Tailored Mitigation Strategy
                    </h4>
                    <div className="space-y-2">
                      {recommendations.mitigationStrategy.map((strat, sidx) => (
                        <div key={sidx} className="p-3 bg-slate-900 border border-slate-850 rounded-xl hover:border-slate-700 transition">
                          <strong className="text-xs font-mono text-emerald-400 block mb-1">
                            {strat.step}
                          </strong>
                          <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                            {strat.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {recsError && !recsLoading && (
                <div id="ai-policy-error" className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl mb-6 text-xs text-red-300">
                  ⚠️ {recsError}
                </div>
              )}

              {!recsLoading && !recommendations && !recsError && (
                <div id="ai-policy-idle" className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-850/60 border-dashed rounded-2xl text-center mb-6">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <strong className="text-sm font-semibold text-slate-300">No Policy Session Active</strong>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[245px] font-sans">
                    Click the trigger below to launch the IBM Granite agent workflow over the live metropolitan ledger.
                  </p>
                </div>
              )}
            </div>

            <button
              id="trigger-ai-rec-btn"
              type="button"
              onClick={generateAIRecommendations}
              disabled={recsLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase font-mono text-slate-950 bg-indigo-400 hover:bg-white active:bg-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/5 ${recsLoading ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {recsLoading ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Orchestrating Workflow...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-slate-950 fill-slate-950/20" />
                  Generate AI Policy Recommendations (Powered by IBM Granite)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Leaderboard and Chart area */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Zonal Leaderboards */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-3xl">
              <h3 className="text-base font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-400 fill-emerald-500/20" /> Metropolitan Leaderboard rankings
              </h3>

              <div className="space-y-4">
                {metrics.map((item, idx) => (
                  <div key={item.zone} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-6 hover:border-emerald-500/30 transition">
                    <div className="flex items-center gap-4">
                      {/* Rank number badge */}
                      <span className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-mono font-bold text-sm text-slate-400 border border-slate-800">
                        #{idx + 1}
                      </span>
                      <div>
                        <strong className="text-slate-200 text-sm font-extrabold">{item.zone}</strong>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">District Code: MSW-{item.zone.replace(' ','')}</span>
                      </div>
                    </div>

                    {/* Progress bar and Score */}
                    <div className="flex-1 max-w-sm hidden md:block">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                        <span>Index Progress</span>
                        <span>{item.sustainabilityScore}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                        <div
                          className={`h-full rounded-full ${item.sustainabilityScore > 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : item.sustainabilityScore > 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-red-500'}`}
                          style={{ width: `${item.sustainabilityScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Rating badge */}
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-slate-100">{item.sustainabilityScore}</span>
                      <span className={`block text-[10px] mt-0.5 uppercase font-bold tracking-wider ${item.sustainabilityScore > 85 ? 'text-emerald-400' : item.sustainabilityScore > 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {item.sustainabilityScore > 85 ? 'Excellent Class' : item.sustainabilityScore > 70 ? 'Satisfactory' : 'Needs Intervention'}
                      </span>
                    </div>
                  </div>
                ))}

                {metrics.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No active score benchmarks. Submit logs to trigger data calculus.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Graphical comparative diagnostics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between h-full min-h-[350px]">
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Benchmarking Diagnostics</h3>
                <span className="text-slate-550 text-[10px] uppercase font-mono block mb-6">Zone Comparison parameters</span>
                
                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="zone" stroke="#666" tick={{ fill: '#666', fontSize: 9 }} />
                      <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: 11, color: '#fff' }} />
                      <Bar dataKey="sustainabilityScore" name="Overall Index" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Intervention triggers */}
              <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3 text-xs pt-4 border-t border-slate-800 mt-6">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-[10.5px] leading-relaxed">
                  Zones averaging scores lower than <strong>75</strong> automatically alert city administrators to execute smart bin placement or public coordination audits.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Commercial Sector-wise Leaderboards */}
        <div className="mt-10 bg-slate-950/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> Commercial Sector Leaderboards
              </h3>
              <p className="text-xs text-slate-400 mt-1">Benchmarking individual commercial, healthcare, and campus facilities across all 4 zones.</p>
            </div>

            {/* Selector buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-900 p-1 border border-slate-850 rounded-xl">
              {['Resort', 'Restaurant', 'College', 'Hostel', 'Event Hall'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg font-mono transition capitalize cursor-pointer ${selectedSector === sec ? 'bg-slate-800 text-emerald-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-850/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-mono uppercase text-slate-500">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Establishment</th>
                  <th className="py-4 px-6">District Zone</th>
                  <th className="py-4 px-6 text-right">Waste per Visit Cap (kg)</th>
                  <th className="py-4 px-6 text-right">Operational Consumed Rate</th>
                  <th className="py-4 px-6 text-right">Sustainability Index Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {(() => {
                  const filtered = leaderboard.filter(item => item.type === selectedSector);
                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-mono text-xs">
                          No active commercial logs registered under the {selectedSector} category.
                        </td>
                      </tr>
                    );
                  }

                  return filtered.map((item, idx) => {
                    const rankNum = idx + 1;
                    let rankBadge = `${rankNum}`;
                    let rankClass = "bg-slate-900 border border-slate-800 text-slate-400";
                    if (rankNum === 1) {
                      rankClass = "bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-400/10";
                    } else if (rankNum === 2) {
                      rankClass = "bg-slate-300 text-slate-950 font-bold";
                    } else if (rankNum === 3) {
                      rankClass = "bg-amber-700 text-slate-100 font-bold";
                    }

                    return (
                      <tr key={item.institutionId} className="hover:bg-slate-900/40 transition">
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono ${rankClass}`}>
                            {rankBadge}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <strong className="text-slate-200 font-medium">{item.name}</strong>
                            <span className="text-slate-500 text-[10px] font-mono mt-0.5">ID: {item.institutionId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                          {item.zone}
                        </td>
                        <td className="py-4 px-6 text-right text-slate-200 font-mono text-xs">
                          {item.wastePerCapita} kg/capita
                        </td>
                        <td className="py-4 px-6 text-right text-slate-200 font-mono text-xs">
                          {item.efficiencyRate}% eaten
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-200">
                          <span className={`inline-block font-mono text-sm ${item.sustainabilityScore >= 80 ? 'text-emerald-450' : item.sustainabilityScore >= 60 ? 'text-teal-400' : 'text-amber-500'}`}>
                            {item.sustainabilityScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsible AI Considerations */}
        <div id="responsible-ai-considerations" className="mt-10 bg-slate-950/60 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Responsible AI Considerations
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
            Our platform adheres to rigorous governance frameworks. The EcoNexus platform is designed, monitored, and continuously optimized under strict protocols enforcing security, safety, and lack of algorithmic bias:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
            <div id="rai-fairness-card" className="p-5 bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Scale className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <strong className="text-slate-150 text-sm font-bold block mb-1.5">Algorithmic Fairness</strong>
                <p className="text-slate-400 leading-relaxed">
                  Prevents geospatial environmental discrimination. All district sustainability indices are normalized against daily customer attendance parameters (waste per capita). This guarantees commercial spaces in high-density Zone A are assessed equitably alongside industrial sectors.
                </p>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400/80 block mt-4 font-semibold">Unbiased Zone Monitoring</span>
            </div>

            <div id="rai-privacy-card" className="p-5 bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Lock className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <strong className="text-slate-150 text-sm font-bold block mb-1.5">Strict Privacy Guardrails</strong>
                <p className="text-slate-400 leading-relaxed">
                  Individual commercial establishment performance histories are completely anonymized or aggregated at the sector and district level before policy generation. Municipal algorithms never store or transmit corporate payroll, unencrypted contractor records, or precise geofence logs.
                </p>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400/80 block mt-4 font-semibold">Data Anonymization</span>
            </div>

            <div id="rai-transparency-card" className="p-5 bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Eye className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <strong className="text-slate-150 text-sm font-bold block mb-1.5 font-sans">Calculation Transparency</strong>
                <p className="text-slate-400 leading-relaxed">
                  Core dynamic index evaluations operate with simple, open algebra instead of obscure black-box formulas. IBM Granite acts strictly under a digital copilot framework outputting reference audits that are fully auditable, checkable, and adjustable by human city controllers at any stage.
                </p>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400/80 block mt-4 font-semibold">Explainable Modeling</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
