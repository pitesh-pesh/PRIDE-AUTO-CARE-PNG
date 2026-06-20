import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import LoyaltySystem from './components/LoyaltySystem';
import PushNotifications from './components/PushNotifications';
import BusinessSimulator from './components/BusinessSimulator';
import { Sparkles, Calendar, Award, BarChart3, ShieldAlert, Phone, MapPin, Clock, Droplets, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'booking' | 'loyalty' | 'simulator'>('booking');
  const [appliedPromo, setAppliedPromo] = useState<string>('');

  const handleApplyPromoCode = (code: string) => {
    setAppliedPromo(code);
    setActiveTab('booking'); // automatically swap to booking tab to preview the deal!
  };

  const handleDealUsed = () => {
    setAppliedPromo(''); // Clear after use
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white font-sans pb-16">
      
      {/* Sleek Design Top Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan block */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-lg tracking-widest font-display shadow-sm">
                PA
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h1 className="text-xl font-extrabold tracking-widest text-indigo-700 font-display">PRIDE AUTO CARE</h1>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">PNG</span>
              </div>
              <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mt-0.5 select-none font-medium">
                "YOU WORKED HARD FOR IT. WE PROTECT YOUR PRIDE."
              </p>
            </div>
          </div>

          {/* Quick Context Markers */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/40">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Port Moresby, PNG</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/40">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Daily 8AM-6PM</span>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Accent Banner with Overview */}
      <section className="bg-white border-b border-slate-200 py-12 relative overflow-hidden">
        {/* Abstract Gold Circles ambient light */}
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-slate-100/40 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-xs text-indigo-700 font-bold uppercase tracking-widest block bg-indigo-50 border border-indigo-100/80 px-3 py-1 rounded-full w-max">
              PREMIUM CAR WASH BLUEPRINT
            </span>
            <h2 className="text-3.5xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-none">
              High-End Manual & <span className="text-indigo-600">Eco-Foam</span> Detailing
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed pt-1">
              The typical Port Moresby car wash market consists of informal roadside operations using harsh abrasive detergents that damage fine paint clear-coat work. 
              <strong> Pride Auto Care PNG</strong> alters the landscape with a scratch-safe, 4-bay continuous assembly workflow featuring active snow foam, the classic three-bucket system, and state-of-the-art interior sanitation.
            </p>
          </div>

          {/* Business Core stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-slate-50 hover:bg-slate-100/50 transition border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-wider block font-bold">85% Gross Margins</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">K 110.50 Profit</p>
              <div className="text-[10px] text-slate-400 mt-1">On Tier 2 Deluxe (SUV)</div>
            </div>
            <div className="bg-slate-50 hover:bg-slate-100/50 transition border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Practical Capacity</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">35-45 Cars / Day</p>
              <div className="text-[10px] text-slate-400 mt-1">Simultaneous active bays</div>
            </div>
            <div className="bg-slate-50 hover:bg-slate-100/50 transition border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Retention Rate Boost</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">Every 5th Wash FREE</p>
              <div className="text-[10px] text-slate-400 mt-1">Auto SMS loyalty system</div>
            </div>
            <div className="bg-slate-50 hover:bg-slate-100/50 transition border border-slate-200/80 p-5 rounded-2xl shadow-xs">
              <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-wider block font-bold">Corporate B2B Revenue</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">Pride Fleet Pass</p>
              <div className="text-[10px] text-slate-400 mt-1">Tiered line-of-credit passes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Control Panel Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        
        {/* Deal Notifications Ticker Bar */}
        <PushNotifications onApplyDeal={handleApplyPromoCode} />

        {/* Premium Action Tabs Selector */}
        <div className="flex border-b border-slate-200 pb-px gap-2">
          <button
            type="button"
            id="tab_booking_btn"
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-2.5 px-6 py-4.5 border-b-2 font-display text-sm font-bold transition-all relative ${
              activeTab === 'booking'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Integrated Detailing Booking</span>
            {appliedPromo && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                Promo Applied
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab_loyalty_btn"
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-2.5 px-6 py-4.5 border-b-2 font-display text-sm font-bold transition-all relative ${
              activeTab === 'loyalty'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Digital Loyalty Punch Card</span>
          </button>

          <button
            type="button"
            id="tab_simulator_btn"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2.5 px-6 py-4.5 border-b-2 font-display text-sm font-bold transition-all relative ${
              activeTab === 'simulator'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Business Operations Twin</span>
          </button>
        </div>

        {/* Tab Viewport Panels with subtle fade animation */}
        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeTab === 'booking' && (
              <motion.div
                key="booking_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <BookingForm
                  appliedDealCode={appliedPromo}
                  onDealUsed={handleDealUsed}
                />
              </motion.div>
            )}

            {activeTab === 'loyalty' && (
              <motion.div
                key="loyalty_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <LoyaltySystem />
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div
                key="simulator_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <BusinessSimulator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Informative Grid Grid Details: "How We Upscale the business" */}
        <section className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Strategic Growth & Market Expansion Directives
            </h3>
            <p className="text-xs text-slate-400 font-mono text-left uppercase">
              How Pride Auto Care PNG optimizes premium unit operations for scalable asset expansion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="text-base font-bold">01.</span>
                <h4 className="font-extrabold font-display text-slate-800 text-sm uppercase">B2B Corporate Revenue Strategy</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed text-left">
                Targeting logistics fleet operators, private security vehicle lines, and luxury rentals in Port Moresby via <strong>"The Pride Fleet Pass"</strong>. 
                Secures recurring monthly cash streams prior to daily walk-in openings.
              </p>
            </div>

            <div className="space-y-2 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="text-base font-bold">02.</span>
                <h4 className="font-extrabold font-display text-slate-800 text-sm uppercase">Geo-Fenced Social Digital Funneling</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed text-left">
                Deploying high-impact localized social feeds with detailed "Before & After" visuals specifically targeted at rugged 4x4 trucks and off-road vehicles. 
                Focuses within a 5km radius to capture Port Moresby corporate workers during their morning commute.
              </p>
            </div>

            <div className="space-y-2 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="text-base font-bold">03.</span>
                <h4 className="font-extrabold font-display text-slate-800 text-sm uppercase">Scientific Performance Commission</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed text-left">
                By awarding the 8x Bay Detailing Technicians an attractive K12.00 direct comisión pool based strictly on customer reviews and 25-min bay output speed, 
                we ensure peak motivation and reduce vehicle congestion times.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer block */}
      <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pride Auto Care PNG. Real-World Operations & Digital Deployment Blueprint.</p>
          <div className="flex gap-4 font-mono text-[10px] text-slate-400">
            <span>Developed for Port Moresby Expansion</span>
            <span>&bull;</span>
            <span>Version 2.0 Direct Deployment Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
