import React, { useState } from 'react';
import { User, ShieldAlert, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface LoginViewProps {
  onSetUser: (user: any) => void;
  onNavigate: (tab: string) => void;
}

export default function LoginView({ onSetUser, onNavigate }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'institution' | 'city_admin'>('institution');
  const [type, setType] = useState('Restaurant');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('Zone A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister 
      ? { name, type, email, phone, address, zone: role === 'city_admin' ? 'All' : zone, password, role }
      : { email, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      return data;
    })
    .then(data => {
      if (isRegister && data.user) {
        // Log in immediately after registration!
        onSetUser(data.user);
        if (data.user.role === 'city_admin') {
          onNavigate('city');
        } else {
          onNavigate('institution');
        }
      } else if (data.user) {
        onSetUser(data.user);
        if (data.user.role === 'institution') {
          onNavigate('institution');
        } else {
          onNavigate('city');
        }
      }
    })
    .catch(err => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Helper to log in instantly as guest accounts for seamless verification
  const handleQuickLogin = (guestEmail: string) => {
    setLoading(true);
    setError('');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: guestEmail, password: 'password' })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Guest login failed');
      return data;
    })
    .then(data => {
      if (data.user) {
        onSetUser(data.user);
        if (data.user.role === 'institution') {
          onNavigate('institution');
        } else {
          onNavigate('city');
        }
      }
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen py-16 px-6 relative flex flex-col justify-center items-center select-none bg-radial from-slate-900 via-slate-950 to-slate-950">
      
      {/* Decorative backdrop */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full z-10 flex flex-col">
        
        {/* Back navigation button */}
        <button
          onClick={() => onNavigate('landing')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-450 hover:text-emerald-400 transition font-mono self-start cursor-pointer group bg-slate-950/40 border border-slate-800/80 px-3 py-1.5 rounded-lg"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Main Portal
        </button>

        {/* Title branding block */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            EcoNexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Waste Portal</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            Secure Role-Based Smart City Access Gate
          </p>
        </div>

        {/* Guest credentials sandbox */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl mb-6">
          <span className="text-[10px] text-slate-400 font-mono font-semibold tracking-wider uppercase block text-center mb-2">
            ⚡ Quick-Switch Demo Sandbox Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('marriot@ecocity.ai')}
              className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 py-2 rounded-lg text-xs font-semibold"
            >
              Grand Plaza Resort (Inst.)
            </button>
            <button
              onClick={() => handleQuickLogin('statecollege@ecocity.ai')}
              className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 py-2 rounded-lg text-xs font-semibold"
            >
              Metro State Uni (Inst.)
            </button>
            <button
              onClick={() => handleQuickLogin('admin@ecocity.ai')}
              className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 py-2 rounded-lg text-xs font-semibold"
            >
              Dr. Sarah Carter (City Admin)
            </button>
            <button
              onClick={() => handleQuickLogin('officer@ecocity.ai')}
              className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 py-2 rounded-lg text-xs font-semibold"
            >
              John Martinez (Officer)
            </button>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 p-8 rounded-3xl shadow-xl">
          <div className="flex border-b border-slate-700 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 flex items-center justify-center gap-2 ${!isRegister ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 flex items-center justify-center gap-2 ${isRegister ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Account Role Type</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                  >
                    <option value="institution" className="bg-slate-900 text-slate-100">Business / Establishment Operator</option>
                    <option value="city_admin" className="bg-slate-900 text-slate-100">Municipal Administrator (City Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    {role === 'city_admin' ? "Administrator Full Name" : "Institution/Business Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'city_admin' ? "e.g. Inspector Davis" : "e.g. Hilton Garden, Pizza Hut"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                  />
                </div>

                {role !== 'city_admin' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Sector Type</label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      >
                        <option value="Resort" className="bg-slate-900 text-slate-100">Resort</option>
                        <option value="Restaurant" className="bg-slate-900 text-slate-100">Restaurant</option>
                        <option value="College" className="bg-slate-900 text-slate-100">College</option>
                        <option value="Hostel" className="bg-slate-900 text-slate-100">Hostel</option>
                        <option value="Event Hall" className="bg-slate-900 text-slate-100">Event Hall</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Region Zone</label>
                      <select
                        value={zone}
                        onChange={e => setZone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      >
                        <option value="Zone A" className="bg-slate-900 text-slate-100">North Sector (Zone A)</option>
                        <option value="Zone B" className="bg-slate-900 text-slate-100">Central Hub (Zone B)</option>
                        <option value="Zone C" className="bg-slate-900 text-slate-100">South Bay (Zone C)</option>
                        <option value="Zone D" className="bg-slate-900 text-slate-100">West Area (Zone D)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
                    <span className="text-xs text-emerald-400 font-mono block font-semibold mb-1">System privilege: Municipal Admin Access</span>
                    <span className="text-[11px] text-slate-400 font-sans block leading-relaxed">
                      You are registering as an overarching municipal auditor. Your profile will possess monitoring oversight across all region zones.
                    </span>
                  </div>
                )}

                {role !== 'city_admin' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Contact</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="555-123-4567"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="123 Sustainability way"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Coordinates</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="manager@ecocity.ai"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Portal Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition duration-150 disabled:opacity-55 active:scale-98 mt-6"
            >
              {loading ? "Establishing handshake..." : isRegister ? "Create Master Profile" : "Secure Sign-In"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
