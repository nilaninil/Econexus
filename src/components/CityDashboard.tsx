import React, { useState, useEffect } from 'react';
import { DailyReport, ZoneMetrics } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { Leaf, Calendar, ShieldAlert, Sparkles, Filter, Droplet, Zap, Trash2, TrendingUp, Building2, HelpCircle } from 'lucide-react';

interface CityDashboardProps {
  onNavigate: (tab: string) => void;
}

export default function CityDashboard({ onNavigate }: CityDashboardProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [zoneMetrics, setZoneMetrics] = useState<ZoneMetrics[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, avgWater: 0, avgElec: 0 });

  useEffect(() => {
    fetchReports();
    fetchZoneMetrics();
  }, [sectorFilter, zoneFilter]);

  const fetchReports = () => {
    let url = '/api/reports?';
    if (sectorFilter !== 'all') url += `type=${sectorFilter}&`;
    if (zoneFilter !== 'all') url += `zone=${zoneFilter}&`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
          calculateStats(data);
        } else {
          setReports([]);
          setStats({ today: 0, week: 0, month: 0, avgWater: 0, avgElec: 0 });
        }
      })
      .catch(err => {
        console.error(err);
        setReports([]);
        setStats({ today: 0, week: 0, month: 0, avgWater: 0, avgElec: 0 });
      });
  };

  const fetchZoneMetrics = () => {
    fetch('/api/sustainability-index')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setZoneMetrics(data);
        } else {
          setZoneMetrics([]);
        }
      })
      .catch(err => {
        console.error(err);
        setZoneMetrics([]);
      });
  };

  const calculateStats = (data: DailyReport[]) => {
    if (data.length === 0) return;
    
    // Sort array descending order is historical
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
    const latestDate = sorted[0]?.date;
    
    // Total Today: Latest single logged date
    const todaySum = sorted
      .filter(r => r.date === latestDate)
      .reduce((sum, r) => sum + r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste, 0);

    // Total Week (say last 7 days from latestDate)
    const sevenDaysAgo = new Date(latestDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    const weekSum = sorted
      .filter(r => r.date >= sevenDaysAgoStr && r.date <= latestDate)
      .reduce((sum, r) => sum + r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste, 0);

    // Total Month Sum
    const monthSum = sorted.reduce((sum, r) => sum + r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste, 0);

    // Average Utilities
    const avgWater = Math.round(data.reduce((sum, r) => sum + r.waterUsage, 0) / data.length);
    const avgElec = Math.round(data.reduce((sum, r) => sum + r.electricityUsage, 0) / data.length);

    setStats({
      today: Math.round(todaySum),
      week: Math.round(weekSum),
      month: Math.round(monthSum),
      avgWater,
      avgElec
    });
  };

  // Compile Chart data for Daily/Weekly trend
  const getTrendData = () => {
    // Group reports by date or week
    const grouped: { [key: string]: number } = {};
    reports.forEach(r => {
      const totalWaste = r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste;
      grouped[r.date] = (grouped[r.date] || 0) + totalWaste;
    });

    // Convert to sorted array
    return Object.keys(grouped)
      .map(date => ({
        date,
        waste: parseFloat(grouped[date].toFixed(1))
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-15); // Show last 15 active reporting dates
  };

  // Compile pie chart sector data
  const getSectorData = () => {
    const sectors = ['Resort', 'Restaurant', 'College', 'Hostel', 'Event Hall'];
    const sectorSums: { [key: string]: number } = {};
    
    // Default baseline values
    sectors.forEach(s => { sectorSums[s] = 0; });

    reports.forEach(r => {
      const totalWaste = r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste;
      sectorSums[r.institutionType] = (sectorSums[r.institutionType] || 0) + totalWaste;
    });

    const totalAll = Object.values(sectorSums).reduce((sum, val) => sum + val, 0) || 1;

    return Object.keys(sectorSums)
      .map(k => ({
        name: k,
        value: parseFloat(sectorSums[k].toFixed(1)),
        percentage: Math.round((sectorSums[k] / totalAll) * 100)
      }))
      .filter(item => item.value > 0);
  };

  // Compile resource consumption over time
  const getResourceData = () => {
    const grouped: { [key: string]: { water: number, electricity: number } } = {};
    reports.forEach(r => {
      if (!grouped[r.date]) grouped[r.date] = { water: 0, electricity: 0 };
      grouped[r.date].water += r.waterUsage;
      grouped[r.date].electricity += r.electricityUsage;
    });

    return Object.keys(grouped)
      .map(date => ({
        date,
        water: grouped[date].water,
        electricity: grouped[date].electricity
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10);
  };

  const SECTOR_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-slate-900 text-white min-h-screen py-8 px-6">
      
      {/* City Title Header with Quick Filters */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              City Waste Intelligence Aggregates
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              SDG 11 Global Sustainability Dashboard for Metropolitan Authorities
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Zone filter select */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-350">
              <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="bg-slate-950 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950 text-slate-100">All Zones</option>
                <option value="Zone A" className="bg-slate-950 text-slate-100">North District (Zone A)</option>
                <option value="Zone B" className="bg-slate-950 text-slate-100">East Central (Zone B)</option>
                <option value="Zone C" className="bg-slate-950 text-slate-100">South Bay (Zone C)</option>
                <option value="Zone D" className="bg-slate-950 text-slate-100">West Industrial (Zone D)</option>
              </select>
            </div>

            {/* Sector filter select */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-350">
              <Building2 className="w-3.5 h-3.5 mr-2 text-slate-500" />
              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                className="bg-slate-950 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950 text-slate-100">All Sectors</option>
                <option value="Resort" className="bg-slate-950 text-slate-100">Resorts</option>
                <option value="Restaurant" className="bg-slate-950 text-slate-100">Restaurants</option>
                <option value="College" className="bg-slate-950 text-slate-100">Colleges</option>
                <option value="Hostel" className="bg-slate-950 text-slate-100">Hostels</option>
                <option value="Event Hall" className="bg-slate-950 text-slate-100">Event Halls</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI counters (SDG 11 overview) */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-2">Total Waste Today</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-extrabold text-slate-100">{stats.today.toLocaleString()}</strong>
            <span className="text-xs text-emerald-400 font-mono font-semibold">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Latest logged daily records</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-2">Generated This Week</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-extrabold text-slate-100">{stats.week.toLocaleString()}</strong>
            <span className="text-xs text-emerald-400 font-mono font-semibold">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Last 7 calendar days total</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-400"></div>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-2">Consolidated Monthly</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-extrabold text-slate-100">{stats.month.toLocaleString()}</strong>
            <span className="text-xs text-teal-400 font-mono font-semibold">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Full database cumulative logging</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block tracking-wider mb-2">Urban Sustainability</span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-extrabold text-slate-100">
              {zoneMetrics.length > 0 ? Math.round(zoneMetrics.reduce((sum, z) => sum + z.sustainabilityScore, 0) / zoneMetrics.length) : 78}%
            </strong>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Integrated Zonal index score</span>
        </div>

      </div>

      {/* Main Charts block */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mb-10">
        
        {/* Trend line graph (Main analytics) */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-200">Waste Fluctuations and Trends</h3>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Aggregate daily dispatch load (kg)</span>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTrendData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 9 }} />
                  <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: 11, color: '#fff' }} />
                  <Area type="monotone" dataKey="waste" name="Total Waste" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWaste)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sector breakdown pie chart */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-2">Waste by Industrial Sector</h3>
            <span className="text-slate-550 text-[10px] uppercase font-mono block mb-4">Percentage volume contributions</span>
            
            {reports.length > 0 ? (
              <div className="h-56 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSectorData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {getSectorData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: 11, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text badge */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-300">
                    {getSectorData().length}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Sectors</span>
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-500 text-xs">No active sector data to display</div>
            )}
          </div>

          {/* Color definitions index list */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[10px]">
            {getSectorData().map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-350">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}></span>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="font-mono text-slate-500">{item.value.toFixed(0)} kg ({item.percentage}%)</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Dynamic Resource tracking under SDG 11 */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Resource efficiencies (electricity & water line grids) */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">Carbon & Resource footprint tracking</h3>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Dynamic utility expenditure over date series</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getResourceData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 9 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{ fill: '#3b82f6', fontSize: 9 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fill: '#f59e0b', fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: 11, color: '#fff' }} />
                <Bar yAxisId="left" dataKey="water" name="Water (Liters)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="electricity" name="Electricity (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick redirect panels for Government Officers */}
        <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase block mb-1">
              Active Municipal Protocols
            </span>
            <h3 className="text-lg font-extrabold text-slate-200 mb-3">AI Intervention Loop</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Our live GIS system and sustainability formula detect low-performing blocks immediately. If Zone C or B drops below target margins, notifications are auto-dispatched to smart-bins and regional trucks.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('heatmap')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between px-4"
            >
              <span>View Interactive Zonal Heatmap</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onNavigate('sustainability')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-250 border border-slate-800 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between px-4"
            >
              <span>Inspect Sustainability Index Score</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between px-4"
            >
              <span>Run AI Forecasting & Analytics Engine</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
