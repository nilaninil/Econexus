import React, { useState, useEffect } from 'react';
import { DailyReport, ZoneMetrics } from '../types';
import { Map, ZoomIn, ZoomOut, Maximize2, Layers, Filter, Compass, Info, MapPin, ArrowLeft } from 'lucide-react';
import { ZONE_COORDINATES } from '../data/mockData';

interface HeatmapViewProps {
  onNavigate?: (tab: string) => void;
}

export default function HeatmapView({ onNavigate }: HeatmapViewProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [zoneStats, setZoneStats] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('Zone A');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchData();
  }, [sectorFilter]);

  const fetchData = () => {
    let url = '/api/reports?';
    if (sectorFilter !== 'all') url += `type=${sectorFilter}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(reportsData => {
        if (Array.isArray(reportsData)) {
          setReports(reportsData);
          calculateZoneStats(reportsData);
        } else {
          setReports([]);
          calculateZoneStats([]);
        }
      })
      .catch(err => {
        console.error(err);
        setReports([]);
        calculateZoneStats([]);
      });
  };

  const calculateZoneStats = (reps: DailyReport[]) => {
    const zones: ('Zone A' | 'Zone B' | 'Zone C' | 'Zone D')[] = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
    
    const aggregated = zones.map(zone => {
      const zoneReps = reps.filter(r => r.zone === zone);
      const totalWaste = zoneReps.reduce((sum, r) => sum + r.foodWasted + r.plasticWaste + r.paperWaste + r.organicWaste + r.otherWaste, 0);
      const uniqueDates = Array.from(new Set(zoneReps.map(r => r.date))).length || 1;
      const dailyAvg = totalWaste / uniqueDates;

      // Color coding thresholds: Low <= 110kg/day (Green/Safe), Medium 110-220kg/day (Yellow/Intermediate), High > 220kg/day (Red/At Risk)
      let severity: 'low' | 'medium' | 'high' = 'low';
      let colorClass = 'fill-emerald-500/30 stroke-emerald-400';
      let dotColor = 'bg-emerald-400';
      let labelColor = 'text-emerald-400';

      if (dailyAvg > 220) {
        severity = 'high';
        colorClass = 'fill-red-500/30 stroke-red-400';
        dotColor = 'bg-red-500 animate-pulse';
        labelColor = 'text-red-400';
      } else if (dailyAvg > 110) {
        severity = 'medium';
        colorClass = 'fill-amber-500/30 stroke-amber-400';
        dotColor = 'bg-amber-400';
        labelColor = 'text-amber-400';
      }

      return {
        zone,
        dailyAvg: parseFloat(dailyAvg.toFixed(1)),
        severity,
        colorClass,
        dotColor,
        labelColor,
        institutionsCount: Array.from(new Set(zoneReps.map(r => r.institutionId))).length
      };
    });

    setZoneStats(aggregated);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(2, prev + 0.2));
    } else {
      setZoomLevel(prev => Math.max(0.7, prev - 0.2));
    }
  };

  const activeZoneInfo = zoneStats.find(z => z.zone === selectedZone) || {
    zone: selectedZone,
    dailyAvg: 0,
    severity: 'low',
    dotColor: 'bg-emerald-400',
    institutionsCount: 0
  };

  // Coordinates data for SVG layout
  const zonesSVGPaths = {
    'Zone A': { path: 'M 20,20 L 280,20 L 280,180 L 120,180 Z', cx: 150, cy: 90, info: ZONE_COORDINATES['Zone A'] },
    'Zone B': { path: 'M 280,20 L 480,20 L 480,220 L 280,160 Z', cx: 380, cy: 110, info: ZONE_COORDINATES['Zone B'] },
    'Zone C': { path: 'M 20,200 L 120,180 L 280,180 L 280,380 L 20,380 Z', cx: 140, cy: 280, info: ZONE_COORDINATES['Zone C'] },
    'Zone D': { path: 'M 280,180 L 480,220 L 480,380 L 280,380 Z', cx: 380, cy: 290, info: ZONE_COORDINATES['Zone D'] }
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

        {/* Title & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
              <Map className="w-8 h-8 text-emerald-400" /> Interactive Smart City GIS Heatmap
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Live geographic visualization of solid waste density across metropolitan planning quadrants
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filters */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                className="bg-slate-950 text-slate-200 focus:outline-none text-emerald-400 font-bold cursor-pointer"
              >
                <option value="all" className="bg-slate-950 text-slate-100">Display All Sectors</option>
                <option value="Resort" className="bg-slate-950 text-slate-100">Resorts</option>
                <option value="Restaurant" className="bg-slate-950 text-slate-100">Restaurants</option>
                <option value="College" className="bg-slate-950 text-slate-100">Colleges</option>
                <option value="Hostel" className="bg-slate-950 text-slate-100">Hostels</option>
                <option value="Event Hall" className="bg-slate-950 text-slate-100">Event Halls</option>
              </select>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Interface */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Map Viewer Area */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            
            {/* Map controller buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => handleZoom('in')}
                className="p-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setMapOffset({ x:0, y:0 }); }}
                className="p-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Reset Vision"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Scale legend label */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl text-[10px] font-mono space-y-2">
              <span className="font-semibold text-slate-400 uppercase tracking-widest block mb-1">Density Index Map</span>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span>Low (&lt; 400kg/day)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span>Medium (400kg-1000kg)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> <span>High (&gt; 1000kg/day)</span></div>
            </div>

            {/* SVG Visual map */}
            <div className="flex-1 flex items-center justify-center p-4">
              <svg
                viewBox="0 0 500 400"
                className="w-full max-w-lg transition-transform duration-300 transform"
                style={{ transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)` }}
              >
                {/* Background Grid */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Draw Zones dynamically path */}
                {Object.keys(zonesSVGPaths).map(key => {
                  const zKey = key as 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';
                  const zInfo = zoneStats.find(z => z.zone === zKey) || { colorClass: 'fill-slate-800 stroke-slate-700' };
                  const isSelected = selectedZone === zKey;

                  return (
                    <g key={zKey} onClick={() => setSelectedZone(zKey)} className="cursor-pointer group">
                      <path
                        d={zonesSVGPaths[zKey].path}
                        className={`${zInfo.colorClass} ${isSelected ? 'stroke-white stroke-[2.5px] fill-opacity-50' : 'fill-opacity-30 hover:fill-opacity-40'} transition duration-150`}
                      />
                      {/* Name Label */}
                      <text
                        x={zonesSVGPaths[zKey].cx}
                        y={zonesSVGPaths[zKey].cy}
                        className="font-mono text-[9px] font-bold fill-white text-anchor-middle opacity-85 pointer-events-none uppercase text-center"
                        textAnchor="middle"
                      >
                        {zKey}
                      </text>
                      <text
                        x={zonesSVGPaths[zKey].cx}
                        y={zonesSVGPaths[zKey].cy + 13}
                        className="font-mono text-[8px] fill-slate-400 text-anchor-middle pointer-events-none"
                        textAnchor="middle"
                      >
                        {zInfo.dailyAvg || 0} kg/d
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Floating Compass Overlay */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <Compass className="w-4 h-4 animate-spin text-slate-700" style={{ animationDuration: '20s' }} />
              <span>GIS Layer Lock Standard v2.4</span>
            </div>

          </div>

          {/* Zone data sidebar statistics card */}
          <div className="space-y-6">
            
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mb-1">District Explorer</span>
              <h3 className="text-xl font-extrabold text-slate-200">{selectedZone} Metrics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed mb-6">
                {zonesSVGPaths[selectedZone as keyof typeof zonesSVGPaths].info.desc}
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-mono block uppercase">Average Daily Load</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <strong className="text-2xl font-extrabold text-slate-100">{activeZoneInfo.dailyAvg}</strong>
                    <span className="text-xs text-slate-400 font-mono">kg/day</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-mono block uppercase text-left">Sector Severity</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeZoneInfo.dotColor}`}></span>
                    <strong className="text-xs font-bold uppercase text-slate-300">{activeZoneInfo.severity} Risk</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-center">
                    <span className="text-[9px] text-slate-500 font-mono block uppercase">Institutions</span>
                    <strong className="text-base font-bold text-slate-200 mt-1 block">{activeZoneInfo.institutionsCount}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-center flex flex-col justify-center">
                    <span className="text-[9px] text-slate-500 font-mono block uppercase">Grid Code</span>
                    <strong className="text-xs font-mono font-bold text-slate-400 block mt-1">MSW-{selectedZone.replace(' ','')}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs space-y-3">
              <div className="flex gap-2.5">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Zones respond immediately. Adding new reports on the Institution Dashboard rechecks regional calculations and updates boundary visual maps on-the-fly.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
