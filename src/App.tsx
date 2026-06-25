import React, { useState, useEffect } from 'react';
import { User, SystemNotification } from './types';
import LandingView from './components/LandingView';
import AboutView from './components/AboutView';
import LoginView from './components/LoginView';
import InstitutionDashboard from './components/InstitutionDashboard';
import CityDashboard from './components/CityDashboard';
import AIAnalyticsView from './components/AIAnalyticsView';
import HeatmapView from './components/HeatmapView';
import SustainabilityView from './components/SustainabilityView';
import ReportsView from './components/ReportsView';
import AdminPanel from './components/AdminPanel';

import { Leaf, LayoutDashboard, Database, Sparkles, Map, Award, FileText, Settings, LogIn, HelpCircle, Bell, UserCircle, LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = () => {
    let url = '/api/notifications';
    if (currentUser) {
      url += `?userId=${currentUser.id}`;
    }
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      })
      .catch(err => {
        console.error('Notifications loading failed', err);
        setNotifications([]);
      });
  };

  const handleMarkAsRead = (id: string) => {
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(() => {
        // reload notifications
        fetchNotifications();
      })
      .catch(err => {
        console.error('Failed to mark notification as read', err);
      });
  };

  const handleSetUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      // Direct navigation relative to user roles
      if (user.role === 'institution') {
        setActiveTab('institution');
      } else {
        setActiveTab('city');
      }
    } else {
      setActiveTab('landing');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingView onNavigate={setActiveTab} onSetUser={handleSetUser} />;
      case 'about':
        return <AboutView onNavigate={setActiveTab} />;
      case 'login':
        return <LoginView onSetUser={handleSetUser} onNavigate={setActiveTab} />;
      case 'institution':
        return currentUser?.role === 'institution' ? (
          <InstitutionDashboard user={currentUser} onLogout={handleLogout} onNavigate={setActiveTab} />
        ) : (
          <LoginView onSetUser={handleSetUser} onNavigate={setActiveTab} />
        );
      case 'city':
        return <CityDashboard onNavigate={setActiveTab} />;
      case 'analytics':
        return <AIAnalyticsView currentUser={currentUser} onNavigate={setActiveTab} />;
      case 'heatmap':
        return <HeatmapView onNavigate={setActiveTab} />;
      case 'sustainability':
        return <SustainabilityView onNavigate={setActiveTab} />;
      case 'reports':
        return <ReportsView onNavigate={setActiveTab} />;
      case 'admin':
        return <AdminPanel onNavigate={setActiveTab} />;
      default:
        return <LandingView onNavigate={setActiveTab} onSetUser={handleSetUser} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 font-sans antialiased text-slate-150">
      
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Leaf className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-slate-100 uppercase">EcoNexus</h1>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 block -mt-0.5">SMART WASTE PLATFORM</span>
          </div>
        </div>

        {/* Desktop Navigation Link rails */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'landing' ? 'bg-slate-850 text-slate-100' : ''}`}
          >
            Home Landing
          </button>
          
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'about' ? 'bg-slate-850 text-slate-100' : ''}`}
          >
            Blueprint Details
          </button>

          {/* Secure conditional dashboard tabs */}
          {currentUser?.role === 'institution' && (
            <button
              onClick={() => setActiveTab('institution')}
              className={`px-3 py-2 rounded-lg hover:text-white border border-emerald-500/20 text-emerald-400 transition ${activeTab === 'institution' ? 'bg-emerald-500/10' : ''}`}
            >
              {currentUser?.type === 'College' 
                ? 'My Campus Dining Dashboard' 
                : currentUser?.type === 'Hostel' 
                ? 'My Mess Dashboard' 
                : currentUser?.type === 'Event Hall' 
                ? 'My Banquet Dashboard' 
                : 'My Kitchen Dashboard'}
            </button>
          )}

          {/* Core Government/Admin Access items */}
          {(!currentUser || currentUser.role !== 'institution') && (
            <>
              <button
                onClick={() => setActiveTab('city')}
                className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'city' ? 'bg-slate-850 text-slate-100' : ''}`}
              >
                City aggregates
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'analytics' ? 'bg-slate-850 text-slate-100' : ''}`}
              >
                AI forecasting
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'heatmap' ? 'bg-slate-850 text-slate-100' : ''}`}
              >
                Interactive maps
              </button>
              <button
                onClick={() => setActiveTab('sustainability')}
                className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'sustainability' ? 'bg-slate-850 text-slate-100' : ''}`}
              >
                Sustainability Indices
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'reports' ? 'bg-slate-850 text-slate-100' : ''}`}
              >
                Audit Sheets
              </button>
              {currentUser?.role === 'city_admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 rounded-lg hover:text-white transition ${activeTab === 'admin' ? 'bg-slate-850 text-slate-100' : ''}`}
                >
                  Admin Panel
                </button>
              )}
            </>
          )}
        </nav>

        {/* Right side utilities (Login, notifications tracker drop-down) */}
        <div className="flex items-center gap-3 relative">
          
          {/* Notifications bell dropdown selector */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 border border-slate-800 rounded-xl bg-slate-900/60 text-slate-400 hover:text-white transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Absolute notifications popup panel drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 mb-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                  ⚠️ Notification Center
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold">{unreadCount} Alerts Pending</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 rounded-xl hover:bg-slate-900 transition flex flex-col gap-1 border ${notif.read ? 'bg-slate-900/10 border-transparent text-slate-500' : 'bg-slate-900/60 border-slate-800 text-slate-350'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-slate-200">{notif.title}</h4>
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-[9px] font-mono text-emerald-400 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed">{notif.message}</p>
                    <span className="text-[8px] font-mono text-slate-600 block mt-1">
                      {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-6 text-slate-600 text-xs font-mono">No active alerts. System healthy.</div>
                )}
              </div>
            </div>
          )}

          {/* Secure Account login badge */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-semibold text-slate-300 hidden sm:inline">{currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="p-1 hover:text-red-400 transition"
                title="Sign out of panel"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-97"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In PORTAL
            </button>
          )}

        </div>
      </header>

      {/* Main Render Layout Space */}
      <main className="flex-1 bg-slate-900">
        {renderActiveTab()}
      </main>

    </div>
  );
}
