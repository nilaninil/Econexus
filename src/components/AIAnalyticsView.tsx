import React, { useState, useEffect } from 'react';
import { PredictionResult, AIInsight, User } from '../types';
import { 
  Sparkles, RefreshCw, AlertTriangle, Lightbulb, ArrowLeft
} from 'lucide-react';

interface AIAnalyticsViewProps {
  currentUser: User | null;
  onNavigate?: (tab: string) => void;
}

export default function AIAnalyticsView({ currentUser, onNavigate }: AIAnalyticsViewProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingPred, setLoadingPred] = useState(false);
  const [loadingIns, setLoadingIns] = useState(false);
  const [institutionSelect, setInstitutionSelect] = useState<string>('all');
  const [institutions, setInstitutions] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    fetchInstitutions();
    triggerPrediction();
    triggerInsights();
  }, [institutionSelect]);

  const fetchInstitutions = () => {
    // Collect all registered institutions to populate dropdown selector
    fetch('/api/reports')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) return;
        const unique: { [key: string]: string } = {};
        data.forEach((r: any) => { 
          if (r && r.institutionId) {
            unique[r.institutionId] = r.institutionName || 'Unknown'; 
          }
        });
        const list = Object.keys(unique).map(k => ({ id: k, name: unique[k] }));
        setInstitutions(list);
      })
      .catch(err => {
        console.error(err);
        setInstitutions([]);
      });
  };

  const triggerPrediction = () => {
    setLoadingPred(true);
    const body = institutionSelect === 'all' ? {} : { institutionId: institutionSelect };
    
    fetch('/api/ai/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setPrediction(data);
        } else {
          setPrediction(null);
        }
      })
      .catch(err => {
        console.error(err);
        setPrediction(null);
      })
      .finally(() => setLoadingPred(false));
  };

  const triggerInsights = () => {
    setLoadingIns(true);
    const body = institutionSelect === 'all' ? {} : { institutionId: institutionSelect };
    
    fetch('/api/ai/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setInsights(data);
        } else {
          setInsights([]);
        }
      })
      .catch(err => {
        console.error(err);
        setInsights([]);
      })
      .finally(() => setLoadingIns(false));
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

        {/* Title Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
              <Sparkles className="text-emerald-400 w-7 h-7" /> AI Analytics & Predictive Engine
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5 animate-pulse">
              Synthesizing historical trends, holidays, and dining coefficients for SDG 11-12
            </p>
          </div>

          {/* Quick Dropdown Focus */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-500 mr-2 font-mono">Select Target Asset:</span>
            <select
              value={institutionSelect}
              onChange={e => setInstitutionSelect(e.target.value)}
              className="bg-slate-950 font-bold focus:outline-none text-emerald-400 cursor-pointer"
            >
              <option value="all" className="bg-slate-950 text-slate-100">Integrated City-Wide</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id} className="bg-slate-950 text-slate-100">{inst.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prediction & Recommendations Split Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Tomorrow's forecast details (ML prediction) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">System Forecasting Matrix</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Tomorrow's Expected Load Indexes</span>
                </div>
                <button
                  onClick={triggerPrediction}
                  className="p-2 border border-slate-800 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition"
                  title="Recalculate AI forecasting indices"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingPred ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

              {prediction ? (
                <div>
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-center mb-6 font-mono">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Forecast Horizon Projection Target</span>
                    <strong className="block text-sm text-emerald-400 mt-0.5">{prediction.date}</strong>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <span className="text-[10px] text-slate-400 block mb-1">Expected Attendance</span>
                      <strong className="text-xl md:text-2xl font-extrabold text-slate-200">{prediction.expectedAttendance}</strong>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">visitors</span>
                    </div>
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <span className="text-[10px] text-slate-400 block mb-1">Prepared target</span>
                      <strong className="text-xl md:text-2xl font-extrabold text-slate-200">{prediction.expectedFoodPrepared}</strong>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">kilograms</span>
                    </div>
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <span className="text-[10px] text-slate-400 block mb-1">Expected waste</span>
                      <strong className="text-xl md:text-2xl font-extrabold text-teal-400">{prediction.expectedFoodWaste}</strong>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">conserved kg</span>
                    </div>
                  </div>

                  {/* Prediction strategy card indicators */}
                  <div className="mt-8">
                    <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-slate-400 mb-3 block">
                      ⚠ Operational Procurement Alerts
                    </h4>
                    <div className="space-y-3">
                      {prediction.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl flex items-start gap-3 border ${alert.type === 'warning' ? 'bg-amber-950/20 border-amber-500/20 text-amber-300' : 'bg-slate-900/40 border-slate-800 text-slate-300'}`}
                        >
                          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.type === 'warning' ? 'text-amber-400' : 'text-teal-400'}`} />
                          <p className="text-xs leading-relaxed">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Waiting on baseline database feeds. Use quick-switch to log activities first.
                </div>
              )}
            </div>
          </div>

          {/* AI insights & Recommendations (Gemini or heuristic recommendations) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-3xl">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Decision-Support Insights</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Actionable strategies for city officers</span>
                </div>
                <button
                  onClick={triggerInsights}
                  className="p-2 border border-slate-800 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingIns ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex gap-4 hover:border-emerald-500/20 transition duration-150">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${insight.type === 'pattern' ? 'bg-blue-500/10 text-blue-400' : insight.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {insight.type}
                      </span>
                      <h4 className="font-bold text-sm text-slate-200 mt-2">{insight.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))}

                {insights.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No insights computed for selection. Recalculate above.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
