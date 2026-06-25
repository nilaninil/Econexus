import React, { useState, useEffect } from 'react';
import { User, DailyReport, PredictionResult } from '../types';
import { Leaf, Plus, List, Settings, Save, AlertTriangle, CloudRain, Zap, Users, Sparkles, Check, ChevronRight, Trophy, Award, Target } from 'lucide-react';

interface InstitutionDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate?: (tab: string) => void;
}

export default function InstitutionDashboard({ user, onLogout, onNavigate }: InstitutionDashboardProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'ai' | 'leaderboard'>('record');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>(user.type || 'Resort');

  const getLabel = (key: 'massTitle' | 'foodTab' | 'foodLabel' | 'aiPlanning' | 'dashboardTitle') => {
    const type = user.type; // 'Resort', 'Restaurant', 'College', 'Hostel', 'Event Hall'
    if (type === 'College') {
      switch (key) {
        case 'massTitle': return 'Campus Dining Mass Metrics (kg)';
        case 'foodTab': return 'Campus Canteen / Food Service';
        case 'foodLabel': return 'Organic/Dining';
        case 'aiPlanning': return 'Predictive AI Smart Campus Dining Planning';
        case 'dashboardTitle': return 'Campus Dining & Organic Dashboard';
      }
    }
    if (type === 'Hostel') {
      switch (key) {
        case 'massTitle': return 'Mess & Dining Mass Metrics (kg)';
        case 'foodTab': return 'Mess / Catering Service';
        case 'foodLabel': return 'Mess/Organic';
        case 'aiPlanning': return 'Predictive AI Smart Mess Hall Planning';
        case 'dashboardTitle': return 'Hostel Mess & Waste Dashboard';
      }
    }
    if (type === 'Event Hall') {
      switch (key) {
        case 'massTitle': return 'Catering & Banquet Mass Metrics (kg)';
        case 'foodTab': return 'Banquet / Event Catering';
        case 'foodLabel': return 'Catering/Organic';
        case 'aiPlanning': return 'Predictive AI Smart Banquet Planning';
        case 'dashboardTitle': return 'Event Catering & Waste Dashboard';
      }
    }
    // Default (Resort, Restaurant, others)
    switch (key) {
      case 'massTitle': return 'Kitchen Mass Metrics (kg)';
      case 'foodTab': return 'Kitchen / Food Service';
      case 'foodLabel': return 'Kitchen/Food';
      case 'aiPlanning': return 'Predictive AI Smart Kitchen planning';
      case 'dashboardTitle': return 'My Kitchen Dashboard';
    }
  };

  // Form Reporting state (cleared by default to prevent incorrect prefilled entries)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitors, setVisitors] = useState('');
  const [foodPrepared, setFoodPrepared] = useState('');
  const [foodConsumed, setFoodConsumed] = useState('');
  const [foodWasted, setFoodWasted] = useState('');

  // Waste category divisions
  const [foodWaste, setFoodWaste] = useState('');
  const [plasticWaste, setPlasticWaste] = useState('');
  const [paperWaste, setPaperWaste] = useState('');
  const [organicWaste, setOrganicWaste] = useState('');
  const [otherWaste, setOtherWaste] = useState('');

  // Resources
  const [waterUsage, setWaterUsage] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');

  useEffect(() => {
    fetchReports();
    fetchPrediction();
    fetchLeaderboard();
  }, [user.id]);

  const fetchReports = () => {
    fetch(`/api/reports?institutionId=${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]);
        }
      })
      .catch(err => {
        console.error(err);
        setReports([]);
      });
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

  const fetchPrediction = () => {
    fetch('/api/ai/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId: user.id })
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
      });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    const payload = {
      institutionId: user.id,
      date,
      visitors,
      foodPrepared,
      foodConsumed,
      foodWasted,
      foodWaste,
      plasticWaste,
      paperWaste,
      organicWaste,
      otherWaste,
      waterUsage,
      electricityUsage
    };

    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSuccess('Report successfully stored in database!');
          
          // Clear form fields following successful write
          setVisitors('');
          setFoodPrepared('');
          setFoodConsumed('');
          setFoodWasted('');
          setFoodWaste('');
          setPlasticWaste('');
          setPaperWaste('');
          setOrganicWaste('');
          setOtherWaste('');
          setWaterUsage('');
          setElectricityUsage('');

          // Refresh list, predictions & leaderboard
          fetchReports();
          fetchPrediction();
          fetchLeaderboard();
          setTimeout(() => setSuccess(''), 4000);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Top Banner Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                {user.type} Portal
              </span>
              <span className="text-slate-500 text-xs font-mono">Location: {user.zone}</span>
            </div>
            <h2 className="text-2xl font-bold mt-1 text-slate-200">{user.name}</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-mono">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 border border-slate-800 rounded-lg transition"
              >
                ← Back to Main Portal
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 text-slate-300 px-4 py-2 border border-slate-700 rounded-lg transition"
            >
              Log Out Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Module Sub-tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xl mb-8">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${activeTab === 'record' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Plus className="w-3.5 h-3.5" /> Log Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${activeTab === 'history' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <List className="w-3.5 h-3.5" /> History ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${activeTab === 'ai' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Forecast
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${activeTab === 'leaderboard' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Trophy className="w-3.5 h-3.5" /> Leaderboards
          </button>
        </div>

        {/* Tab content panel */}
        {activeTab === 'record' && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form column */}
            <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" /> Daily SDG-12 reporting form
              </h3>

              {success && (
                <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 bg-emerald-500 text-slate-950 rounded-full" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleReportSubmit} className="space-y-6">
                
                {/* Dates & Attendance */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Log Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Visitors / Attendance Count</label>
                    <input
                      type="number"
                      required
                      value={visitors}
                      onChange={e => setVisitors(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-300"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 my-4"></div>                 {/* Weights section */}
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">{getLabel('massTitle')}</h4>
                  <span className="text-[10px] text-slate-500 font-mono italic">Enter total waste to auto-sync detail below!</span>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Food Prepared</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={foodPrepared}
                      onChange={e => setFoodPrepared(e.target.value)}
                      placeholder="e.g. 80.0"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Food Consumed</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={foodConsumed}
                      onChange={e => setFoodConsumed(e.target.value)}
                      placeholder="e.g. 68.4"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Total Food Wasted</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={foodWasted}
                      onChange={e => {
                        setFoodWasted(e.target.value);
                        // Auto-assign detailed kitchen/food waste so they always match perfectly!
                        setFoodWaste(e.target.value);
                      }}
                      placeholder="e.g. 11.6"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-300 border-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Waste breakdown Details */}
                <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">Detailed Waste Segregation (kg)</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-450 mb-0.5">{getLabel('foodLabel')}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={foodWaste}
                      onChange={e => setFoodWaste(e.target.value)}
                      placeholder="Sync'd"
                      className="w-full bg-slate-900 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Plastics</label>
                    <input
                      type="number"
                      step="0.1"
                      value={plasticWaste}
                      onChange={e => setPlasticWaste(e.target.value)}
                      placeholder="e.g. 2.1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Paper</label>
                    <input
                      type="number"
                      step="0.1"
                      value={paperWaste}
                      onChange={e => setPaperWaste(e.target.value)}
                      placeholder="e.g. 1.2"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Organic/Grad</label>
                    <input
                      type="number"
                      step="0.1"
                      value={organicWaste}
                      onChange={e => setOrganicWaste(e.target.value)}
                      placeholder="e.g. 1.5"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Other trash</label>
                    <input
                      type="number"
                      step="0.1"
                      value={otherWaste}
                      onChange={e => setOtherWaste(e.target.value)}
                      placeholder="e.g. 0.5"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                </div>

                {/* Resource Utilities */}
                <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">Smart Grid Utilities Track</h4>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Water Expense (Liters)</label>
                    <input
                      type="number"
                      value={waterUsage}
                      onChange={e => setWaterUsage(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Electricity (kWh)</label>
                    <input
                      type="number"
                      value={electricityUsage}
                      onChange={e => setElectricityUsage(e.target.value)}
                      placeholder="e.g. 210"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4" /> {loading ? "Cataloging data..." : "Write Daily Report to Registry"}
                </button>

              </form>
            </div>

            {/* Quick tips & AI predictive digest */}
            <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border border-emerald-500/20 p-6 rounded-2xl">
                <h4 className="font-bold text-sm text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Real-time Efficiency Advice
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Based on your previous reports, plate surplus averages <strong>{reports.length > 0 ? (reports.reduce((sum, r) => sum + r.foodWasted, 0) / reports.length).toFixed(1) : "12.0"} kg/day</strong>.
                </p>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Scale back prepared buffer margin to 5% instead of 15% on weekdays.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Plastics waste accounts for ~22% of trash. Implement organic packaging.</span>
                  </div>
                </div>
              </div>

              {prediction && (
                <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
                    Tomorrow's Waste Forecast
                  </h4>
                  <span className="text-xs text-slate-500 block mb-4">Expected Date: {prediction.date}</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Attendance</span>
                      <strong className="text-sm font-bold text-slate-200">{prediction.expectedAttendance}</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Prep (kg)</span>
                      <strong className="text-sm font-bold text-slate-200">{prediction.expectedFoodPrepared}</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Waste (kg)</span>
                      <strong className="text-sm font-bold text-amber-400">{prediction.expectedFoodWaste}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-800/80 pt-3">
                    {prediction.alerts.map((alert, i) => (
                      <div key={i} className={`p-2.5 rounded-lg text-xs leading-tight ${alert.type === 'warning' ? 'bg-amber-950/20 border border-amber-500/20 text-amber-300' : 'bg-blue-950/10 border border-blue-500/10 text-blue-300'}`}>
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 overflow-hidden">
            <h3 className="text-lg font-bold mb-4 text-slate-200">Catalog of Submissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-mono">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Prepared (kg)</th>
                    <th className="py-3 px-4">Wasted (kg)</th>
                    <th className="py-3 px-4">Segregated trash (kg)</th>
                    <th className="py-3 px-4">Utilities (Water/Elec)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-800/20 text-slate-300 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{rep.date}</td>
                      <td className="py-3.5 px-4">{rep.visitors} visitors</td>
                      <td className="py-3.5 px-4">{rep.foodPrepared} kg</td>
                      <td className="py-3.5 px-4 text-amber-500 font-semibold">{rep.foodWasted} kg</td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-500 font-mono">Plastics:</span> {rep.plasticWaste} | <span className="text-slate-500 font-mono">Paper:</span> {rep.paperWaste} | <span className="text-slate-500 font-mono">Org:</span> {rep.organicWaste}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {rep.waterUsage} L | {rep.electricityUsage} kWh
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No previous logs recorded. Use the form tab to create reports.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">{getLabel('aiPlanning')}</h3>
              </div>

              {prediction ? (
                <div className="space-y-6">
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Our neural forecasting model evaluates your history of registrations, calendar events, holidays, and regional patterns to generate tomorrow's consumption targets.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
                      <font className="text-slate-500 text-[10px] uppercase font-mono block mb-1">Expected Attendance</font>
                      <strong className="text-2xl font-bold text-slate-100">{prediction.expectedAttendance}</strong>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
                      <font className="text-slate-500 text-[10px] uppercase font-mono block mb-1">Procurement Target (kg)</font>
                      <strong className="text-2xl font-bold text-slate-100">{prediction.expectedFoodPrepared}</strong>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
                      <font className="text-slate-500 text-[10px] uppercase font-mono block mb-1">Expected Organic Waste (kg)</font>
                      <strong className="text-2xl font-bold text-teal-400">{prediction.expectedFoodWaste}</strong>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-350">Mitigation Strategy Alerts</h4>
                  <div className="space-y-3">
                    {prediction.alerts.map((alert, idx) => (
                      <div key={idx} className={`p-4 rounded-xl flex items-start gap-3 border ${alert.type === 'warning' ? 'bg-amber-950/20 border-amber-500/20 text-amber-350' : 'bg-slate-900 border-slate-800 text-teal-300'}`}>
                        <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${alert.type === 'warning' ? 'text-amber-400' : 'text-teal-400'}`} />
                        <div className="text-xs leading-relaxed">{alert.message}</div>
                      </div>
                    ))}
                  </div>

                  {/* Operational Optimization indices */}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div>
                      <strong className="text-emerald-400 block mb-0.5">Dynamic Waste Coefficient</strong>
                      <span className="text-slate-400">Your average cooking waste buffer matches optimal targets. Keep it up!</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded text-right shrink-0">
                      Ideal Prep Range: {(prediction.expectedFoodPrepared * 0.9).toFixed(1)} - {(prediction.expectedFoodPrepared * 1.05).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Hand-shaking forecasting engine. Submit at least one daily log to synthesize active predictions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard panel */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Hero block with comparative results */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full inline-block">
                  Aura Analytics Standing
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-yellow-400 shrink-0" />
                  Sector Standing: {(() => {
                    const myRows = leaderboard.filter(item => item.type === user.type);
                    const idx = myRows.findIndex(i => i.institutionId === user.id);
                    return idx !== -1 ? `#${idx + 1} of ${myRows.length}` : "Not Ranked";
                  })()}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Your establishment ranks against all other registered <strong className="text-emerald-400">{user.type}s</strong> across the metropolitan zone. Higher sustainability score earns premium municipal carbon relief credits.
                </p>
              </div>

              {/* Fast stats cards */}
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="bg-slate-900 border border-slate-800 px-5 py-4 rounded-2xl shrink-0 min-w-[140px]">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">Global ranking</span>
                  <div className="text-xl font-extrabold text-slate-100">
                    {(() => {
                      const idx = leaderboard.findIndex(i => i.institutionId === user.id);
                      return idx !== -1 ? `#${idx + 1} of ${leaderboard.length}` : '—';
                    })()}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 px-5 py-4 rounded-2xl shrink-0 min-w-[140px]">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">ECO Score</span>
                  <div className="text-xl font-extrabold text-emerald-400">
                    {(() => {
                      const mine = leaderboard.find(i => i.institutionId === user.id);
                      return mine ? `${mine.sustainabilityScore}%` : '—';
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Separator / Sector tab header */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-200">Sector-wise Competitor Arrays</h4>
                  <p className="text-xs text-slate-400">Displaying real dynamic performance indexes generated from daily logs.</p>
                </div>
                
                {/* Sector Switcher Pill bar */}
                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
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

              {/* Competitors List Grid */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-mono uppercase text-slate-500">
                        <th className="py-4 px-6 text-center w-16">Rank</th>
                        <th className="py-4 px-6">Establishment</th>
                        <th className="py-4 px-6">District Zone</th>
                        <th className="py-4 px-6 text-right">Waste (Per Visitor / Total)</th>
                        <th className="py-4 px-6 text-right">Purity / Consumed</th>
                        <th className="py-4 px-6 text-right">Overall ECO Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {(() => {
                        const filtered = leaderboard.filter(item => item.type === selectedSector);
                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                                No registered municipal establishments in the {selectedSector} sector yet.
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((item, idx) => {
                          const isMe = item.institutionId === user.id;
                          const rankNum = idx + 1;
                          
                          // Style rank badge
                          let rankBadge = `${rankNum}`;
                          let rankClass = "bg-slate-800 text-slate-400";
                          if (rankNum === 1) {
                            rankClass = "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/10";
                          } else if (rankNum === 2) {
                            rankClass = "bg-slate-300 text-slate-950 font-bold";
                          } else if (rankNum === 3) {
                            rankClass = "bg-amber-700 text-slate-100 font-bold";
                          }

                          return (
                            <tr 
                              key={item.institutionId} 
                              className={`transition duration-150 ${isMe ? 'bg-emerald-500/5 hover:bg-emerald-500/10 font-medium' : 'hover:bg-slate-900/40'}`}
                            >
                              <td className="py-4 px-6 text-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono ${rankClass}`}>
                                  {rankBadge}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-200">{item.name}</span>
                                    {isMe && (
                                      <span className="bg-emerald-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono animate-pulse shrink-0">
                                        This is You
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-slate-500 text-[10px] font-mono leading-none mt-0.5">ID: {item.institutionId}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-slate-400 text-xs font-mono">{item.zone}</span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-slate-200 text-xs font-mono">{item.wastePerCapita} kg/visit</span>
                                  <span className="text-slate-500 text-[10px] font-mono mt-0.5">Total: {item.totalWaste} kg</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-slate-200 text-xs font-mono">{item.purityRate}% pur</span>
                                  <span className="text-slate-500 text-[10px] font-mono mt-0.5">{item.efficiencyRate}% eaten</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <span className={`inline-block font-mono font-bold text-sm ${item.sustainabilityScore >= 80 ? 'text-emerald-450' : item.sustainabilityScore >= 60 ? 'text-teal-400' : 'text-amber-500'}`}>
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
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
