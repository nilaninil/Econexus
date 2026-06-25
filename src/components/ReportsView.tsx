import React, { useState, useEffect } from 'react';
import { DailyReport } from '../types';
import { FileText, Download, Filter, Calendar, MapPin, Building2, Eye, ShieldAlert, ArrowLeft } from 'lucide-react';

interface ReportsViewProps {
  onNavigate?: (tab: string) => void;
}

export default function ReportsView({ onNavigate }: ReportsViewProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [sectorType, setSectorType] = useState('all');
  const [zoneSelected, setZoneSelected] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchFilteredData();
  }, [sectorType, zoneSelected, startDate, endDate]);

  const fetchFilteredData = () => {
    let query = '/api/reports?';
    if (sectorType !== 'all') query += `type=${sectorType}&`;
    if (zoneSelected !== 'all') query += `zone=${zoneSelected}&`;
    if (startDate) query += `startDate=${startDate}&`;
    if (endDate) query += `endDate=${endDate}&`;

    fetch(query)
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

  const [csvUrl, setCsvUrl] = useState('');
  const [excelUrl, setExcelUrl] = useState('');

  useEffect(() => {
    if (reports.length === 0) {
      setCsvUrl('');
      return;
    }
    const headers = 'ID,Date,Institution,Sector,Zone,Prepared(kg),Consumed(kg),Wasted(kg),Visitors,Water(L),Electricity(kWh)\n';
    const rows = reports.map(r => 
      `"${r.id}","${r.date}","${r.institutionName}","${r.institutionType}","${r.zone}",${r.foodPrepared},${r.foodConsumed},${r.foodWasted},${r.visitors},${r.waterUsage},${r.electricityUsage}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [reports]);

  useEffect(() => {
    if (reports.length === 0) {
      setExcelUrl('');
      return;
    }
    const headers = 'ID\tDate\tInstitution\tSector\tZone\tPrepared(kg)\tConsumed(kg)\tWasted(kg)\tVisitors\tWater(L)\tElectricity(kWh)\n';
    const rows = reports.map(r => 
      `${r.id}\t${r.date}\t${r.institutionName}\t${r.institutionType}\t${r.zone}\t${r.foodPrepared}\t${r.foodConsumed}\t${r.foodWasted}\t${r.visitors}\t${r.waterUsage}\t${r.electricityUsage}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    setExcelUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [reports]);

  // Printable layout triggers PDF
  const triggerPrintPDF = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen py-8 px-6 print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto print:max-w-full">
        
        {onNavigate && (
          <button
            onClick={() => onNavigate('landing')}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono bg-slate-950/40 border border-slate-800/80 px-3 py-1.5 rounded-lg transition print:hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Portal
          </button>
        )}

        {/* Module Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 mb-10 print:hidden">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
              <FileText className="w-8 h-8 text-emerald-400" /> Compliance Reports & File Export
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Acquire certified daily auditing logs and download filtered datasets for external analytics
            </p>
          </div>

          {/* Quick simulation buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={csvUrl || undefined}
              onClick={e => { if (!csvUrl) e.preventDefault(); }}
              download={`EcoCity_Waste_Report_${new Date().toISOString().split('T')[0]}.csv`}
              className={`bg-slate-950 border border-slate-800 text-slate-350 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2.5 active:scale-97 ${csvUrl ? 'hover:bg-slate-850 hover:text-emerald-400' : 'opacity-50 cursor-not-allowed'}`}
            >
              <Download className="w-4 h-4" /> Export CSV Data
            </a>
            <a
              href={excelUrl || undefined}
              onClick={e => { if (!excelUrl) e.preventDefault(); }}
              download={`EcoCity_Analytics_Dump_${new Date().toISOString().split('T')[0]}.xls`}
              className={`bg-slate-950 border border-slate-800 text-slate-350 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2.5 active:scale-97 ${excelUrl ? 'hover:bg-slate-850 hover:text-emerald-400' : 'opacity-50 cursor-not-allowed'}`}
            >
              <Download className="w-4 h-4" /> Export Excel XML
            </a>
            <button
              onClick={triggerPrintPDF}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2.5 active:scale-97"
            >
              <Eye className="w-4 h-4" /> Print PDF Report
            </button>
          </div>
        </div>

        {/* Filter Toolbar selection */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl mb-8 print:hidden">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Set Audit Boundaries
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Sector filter */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Industrial Sector</label>
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs">
                <Building2 className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <select
                  value={sectorType}
                  onChange={e => setSectorType(e.target.value)}
                  className="bg-slate-900 focus:outline-none w-full text-slate-200 cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-slate-100">Consolidated (All)</option>
                  <option value="Resort" className="bg-slate-900 text-slate-100">Resorts</option>
                  <option value="Restaurant" className="bg-slate-900 text-slate-100">Restaurants</option>
                  <option value="College" className="bg-slate-900 text-slate-100">Colleges</option>
                  <option value="Hostel" className="bg-slate-900 text-slate-100">Hostels</option>
                  <option value="Event Hall" className="bg-slate-900 text-slate-100">Event Halls</option>
                </select>
              </div>
            </div>

            {/* Zone filter */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Distributing Zone</label>
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <select
                  value={zoneSelected}
                  onChange={e => setZoneSelected(e.target.value)}
                  className="bg-slate-900 focus:outline-none w-full text-slate-200 cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-slate-100">All Zones</option>
                  <option value="Zone A" className="bg-slate-900 text-slate-100">North Sector (Zone A)</option>
                  <option value="Zone B" className="bg-slate-900 text-slate-100">Central Hub (Zone B)</option>
                  <option value="Zone C" className="bg-slate-900 text-slate-100">South Bay (Zone C)</option>
                  <option value="Zone D" className="bg-slate-900 text-slate-100">West Area (Zone D)</option>
                </select>
              </div>
            </div>

            {/* Date Start */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Search Date From</label>
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent focus:outline-none w-full font-mono text-slate-200"
                />
              </div>
            </div>

            {/* Date End */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Search Date To</label>
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2" />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent focus:outline-none w-full font-mono text-slate-200"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Audit Sheet Table content panel */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 print:border-none print:p-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-200 print:text-black">Audit registry records ({reports.length})</h3>
            <span className="text-[10px] text-slate-550 font-mono print:hidden">Audit ID verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-300 print:text-slate-750 font-mono">
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Institution name</th>
                  <th className="py-3 px-4 font-bold">Sector Map</th>
                  <th className="py-3 px-4 font-bold">Zone</th>
                  <th className="py-3 px-4 font-bold text-rose-400">Prepared / Consumed / Wasted</th>
                  <th className="py-3 px-4 font-bold text-slate-300">Resources (Water/Elec)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300 text-slate-200 print:text-black">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-800/20 print:hover:bg-transparent transition text-slate-200 print:text-slate-800">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100 print:text-black">{rep.date}</td>
                    <td className="py-3.5 px-4 font-medium">{rep.institutionName}</td>
                    <td className="py-3.5 px-4">{rep.institutionType}</td>
                    <td className="py-3.5 px-4 font-mono text-center md:text-left">{rep.zone}</td>
                    <td className="py-3.5 px-4">
                      {rep.foodPrepared}kg prep | {rep.foodConsumed}kg food | <strong className="text-amber-400 font-extrabold">{rep.foodWasted}kg waste</strong>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 print:text-slate-700">
                      {rep.waterUsage}L water | {rep.electricityUsage}kWh elec
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">No logs match selection boundaries.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
