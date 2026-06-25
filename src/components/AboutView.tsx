import React from 'react';
import { Target, Leaf, Map, Database, LineChart, ChevronRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (tab: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="bg-slate-900 text-white min-h-screen py-12 px-6 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation button */}
        <button
          onClick={() => onNavigate('landing')}
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition font-mono cursor-pointer group bg-slate-950/40 border border-slate-800/80 px-3 py-1.5 rounded-lg"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Main Portal
        </button>
        
        {/* Breadcrumb / Title */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-emerald-400 capitalize bg-emerald-500/10 px-3 py-1 rounded-full mb-4">
            Platform Mission Blueprint
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">EcoNexus</span>
          </h1>
          <p className="mt-4 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A production-ready data intelligence standard aligning commercial kitchen operations directly with metropolitan sustainable sanitation policies.
          </p>
        </div>

        {/* Vision Blueprint Grid */}
        <div className="bg-slate-800/40 border border-slate-700/40 p-8 rounded-3xl mb-12">
          <h2 className="text-xl font-bold mb-4 text-slate-200">Our Strategic Aim</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Traditional municipal solid waste (MSW) tracking relies heavily on post-disposal tonnage reports. By the time municipal offices detect a landfill surge, the opportunities for preventative reduction are lost. 
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            <strong>EcoNexus</strong> shifts waste management from <em>reactive collection</em> to <em>predictive mitigation</em>. By integrating point-of-consumption data from institutions (such as resorts and colleges) with municipal GIS scheduling systems, we close the loop on sustainable urban ecology.
          </p>
        </div>

        {/* SDG Target Alignment Details */}
        <h3 className="text-lg font-bold mb-6 text-slate-200">Dual SDG Framework Architecture</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          <div className="p-6 bg-amber-950/20 border border-amber-500/15 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-sm rounded-lg">11</span>
              <h4 className="font-bold text-amber-300 text-base">SDG 11: Sustainable Cities</h4>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Target 11.6:</strong> Special attention paid to municipal and other waste management, reducing adverse environmental impact per capita.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Data Implementation:</strong> Zone-by-zone waste density maps guide solid waste containment setups and dispatch trucks with low carbon emissions.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-emerald-950/20 border border-emerald-500/15 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm rounded-lg">12</span>
              <h4 className="font-bold text-emerald-300 text-base">SDG 12: Responsible Consumption</h4>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Target 12.3:</strong> halve per capita global food waste at the retail and user levels, and reduce food spills along production routes.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Data Implementation:</strong> Local kitchen forecasts, attendance modeling, and food consumption insights reduce systematic overproduction.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* AI & Algorithm Explanatory Details */}
        <div className="space-y-8 mb-12">
          <h3 className="text-xl font-bold text-slate-200">How It Works: The Algorithms</h3>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Dynamic Predictive Forecasts</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Applies double exponential smoothing models (or Gemini API regression prompts) correlating historic 30-day preparation indices against weekly cycles (such as weekend college exodus, or event hall reservations). It calculates specific optimal procurement targets to minimize kitchen overhead surplus.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Zonal GIS Heat Density</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Aggregates active institutional daily files into respective municipal blocks. Computes moving averages weightings based on volume size to map Low (Green), Medium (Yellow), and High (Red) waste saturation clusters automatically.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Urban Sustainability index (USI)</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Computes a multi-layered scorecard for each sector zone using: 
                <span className="block font-mono text-[10px] text-emerald-400 mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                  USI = (0.30 × ReductionScore) + (0.25 × OperationalEfficiency) + (0.25 × RecyclablePurity) + (0.20 × CollectionReliability)
                </span>
                This provides City Councils with clear metrics to evaluate educational campaigns or smart infrastructure investments.
              </p>
            </div>
          </div>
        </div>

        {/* Contact/Support */}
        <div className="p-8 bg-slate-850 border border-slate-700/60 rounded-3xl text-center">
          <h3 className="font-bold text-base text-slate-200 mb-2">Municipal Deployment & Research</h3>
          <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed mb-4">
            This application represents an open sandbox standard designed for cities seeking compliant greenhouse gas limits and optimized solid waste routing indexes. For integrations, contact smartcities@econexus.ai.
          </p>
        </div>

      </div>
    </div>
  );
}
