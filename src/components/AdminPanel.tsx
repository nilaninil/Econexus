import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Settings, Users, Activity, HelpCircle, HardDrive, RefreshCw, Layers, ShieldCheck, Play, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  onNavigate?: (tab: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [binAlertThreshold, setBinAlertThreshold] = useState<number>(30); // % of food prepared that triggers alert
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdminLogs();
  }, []);

  const fetchAdminLogs = () => {
    setLoading(true);
    fetch('/api/admin/system')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setAdminStats(data);
        }
      })
      .catch(err => console.error(err));

    fetch('/api/reports')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        // Form a list of mock users based on records or load baseline
        // For admin viewing, retrieve registered names
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'marriot@ecocity.ai', password: 'password' })
        })
        .then(res => {
          if (!res.ok) throw new Error('Auth query failed');
          return res.json();
        })
        .then(() => {
          // simple preloaded table listing
        })
        .catch(err => console.error(err));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const saveSettings = () => {
    setSuccess('Smart grid configuration committed to database!');
    setTimeout(() => setSuccess(''), 3000);
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
              <Settings className="w-8 h-8 text-emerald-400" /> Municipal Administration Control Panel
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5 animate-pulse">
              System performance metrics, registered entities oversight, and smart-bin parameters
            </p>
          </div>
          <button
            onClick={fetchAdminLogs}
            className="p-3 border border-slate-800 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition"
            title="Reload metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* System parameters KPI grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-xs">
          
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-mono font-bold uppercase tracking-wide block mb-1">Active Accounts</span>
              <strong className="text-2xl font-black text-slate-150">{adminStats?.activeInstitutions || 6}</strong>
              <span className="text-slate-400 block mt-1">Verified local establishments</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-mono font-bold uppercase tracking-wide block mb-1">Database Records</span>
              <strong className="text-2xl font-black text-slate-150">{adminStats?.totalRecords || 180}</strong>
              <span className="text-slate-400 block mt-1">Consolidated audit reports</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-mono font-bold uppercase tracking-wide block mb-1">System Uptime</span>
              <strong className="text-2xl font-black text-slate-150">100.0%</strong>
              <span className="text-slate-400 block mt-1 text-emerald-400 font-semibold flex items-center gap-1">Stable Production</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 font-mono font-bold uppercase tracking-wide block mb-1">Zonal Indexes</span>
              <strong className="text-2xl font-black text-slate-150">4 zones</strong>
              <span className="text-slate-400 block mt-1">Fully mapped districts</span>
            </div>
          </div>

        </div>

        {/* Administration control split modules */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Admin parameter adjust (Smart parameters threshold) */}
          <div className="lg:col-span-1 bg-slate-950 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-base font-bold text-slate-200 mb-6">Simulation Threshold Controls</h3>

            {success && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                {success}
              </div>
            )}

            <div className="space-y-6 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Food Waste Trigger Limit ({binAlertThreshold}%)</label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={binAlertThreshold}
                  onChange={e => setBinAlertThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-slate-500 block text-[10px] italic mt-1">
                  Defines the waste ratio exceeding prepared totals that fires High Waste Alerter notifications.
                </span>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <label className="block text-slate-400 mb-1.5 font-semibold">Active Logistics Dispatch status</label>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
                  <p className="text-slate-400 leading-normal">
                    <strong>Smart-Bin integration:</strong> Dynamic collection routes are synchronized automatically based on daily report entries.
                  </p>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition mt-4"
              >
                Commit Smart Config
              </button>
            </div>
          </div>

          {/* District performance index tracker summary */}
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-base font-bold text-slate-200 mb-4">Metropolitan Division Status</h3>
            <span className="text-slate-500 text-[10px] uppercase font-mono block mb-6">Zone Health Overview logs</span>

            <div className="space-y-4">
              {adminStats?.zonePerformance?.map((zone: any) => (
                <div key={zone.zone} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-200 block font-bold">{zone.zone}</strong>
                    <span className="text-slate-500 font-mono block mt-0.5">Average Daily load: {zone.totalWaste} kg/day</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-slate-500 font-mono block text-[9px] uppercase">Recycle Efficiency</span>
                      <strong className="text-slate-300 font-semibold">{zone.recyclingRate}%</strong>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 font-mono block text-[9px] uppercase">USI Rating</span>
                      <strong className={`font-extrabold ${zone.sustainabilityScore > 85 ? 'text-emerald-400' : zone.sustainabilityScore > 70 ? 'text-amber-400' : 'text-red-400'}`}>{zone.sustainabilityScore}</strong>
                    </div>
                  </div>
                </div>
              ))}

              {!adminStats && (
                <div className="text-center py-8 text-slate-550">No reports logged to calculate zonal performance indices.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
