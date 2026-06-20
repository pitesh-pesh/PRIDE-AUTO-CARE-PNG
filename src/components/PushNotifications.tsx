import React, { useState, useEffect } from 'react';
import { SPECIAL_DEALS } from '../data';
import { Bell, BellOff, ArrowRight, Flame, Sparkles, Check, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Deal } from '../types';

interface PushNotificationsProps {
  onApplyDeal: (code: string) => void;
}

export default function PushNotifications({ onApplyDeal }: PushNotificationsProps) {
  // State
  const [isPushAllowed, setIsPushAllowed] = useState<boolean>(() => {
    return localStorage.getItem('pride_push_allowed') === 'true';
  });
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Deal[]>([...SPECIAL_DEALS]);
  const [toastNotification, setToastNotification] = useState<Deal | null>(null);
  const [hasNewBadge, setHasNewBadge] = useState<boolean>(true);
  const [showCenter, setShowCenter] = useState<boolean>(false);

  // Synthesize a gorgeous high-fidelity digital chime sound using Web Audio API on interactions
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(293.66, now); // D4
      osc2.frequency.exponentialRampToValueAtTime(440.00, now + 0.15); // A4
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  };

  const handleRequestPush = () => {
    if (isPushAllowed) {
      setIsPushAllowed(false);
      localStorage.setItem('pride_push_allowed', 'false');
    } else {
      setShowPrompt(true);
    }
  };

  const handleConfirmPermission = (allowed: boolean) => {
    setShowPrompt(false);
    if (allowed) {
      setIsPushAllowed(true);
      localStorage.setItem('pride_push_allowed', 'true');
      playChime();
      
      const welcomePromo = SPECIAL_DEALS[1]; // PRIDE10
      triggerSimulatedFlash(welcomePromo);
    }
  };

  const triggerSimulatedFlash = (deal: Deal) => {
    setToastNotification(deal);
    playChime();
    setHasNewBadge(true);
    
    // Auto clear toast after 8 secs
    setTimeout(() => {
      setToastNotification(null);
    }, 8500);
  };

  useEffect(() => {
    if (!isPushAllowed) return;

    const timer = setTimeout(() => {
      const wetWeatherDeal: Deal = {
        id: 'stormy_alert',
        title: '⛈️ Port Moresby Rainy Day Guard',
        description: 'Heavy precipitation over Port Moresby creates severe road silt! Preserve your clear coat. Claim an active K30 underbody flush upgrade on any Express wash booked today.',
        code: 'SILTGUARD30',
        discountFixed: 30,
        category: 'Weather Alert'
      };
      
      setNotifications(prev => {
        if (prev.find(n => n.id === wetWeatherDeal.id)) return prev;
        return [wetWeatherDeal, ...prev];
      });
      triggerSimulatedFlash(wetWeatherDeal);
    }, 18000); // 18 seconds after client has allowed notifications!

    return () => clearTimeout(timer);
  }, [isPushAllowed]);

  const handleClaimDealInBooking = (code: string) => {
    onApplyDeal(code);
    setToastNotification(null);
    setShowCenter(false);
    
    const elem = document.getElementById('booking_center');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleManualTriggerSimulator = () => {
    const flashSales: Deal[] = [
      {
        id: 'flash_royal_20',
        title: '🔥 B2B Fleet Special: -K40 Royal Treat',
        description: 'Corporate client slot cleared for 12:00 PM! Get K40 off our range-topping Royal treatment right now.',
        code: 'ROYAL40',
        discountFixed: 40,
        targetPackageId: 'royal',
        category: 'Flash Deal'
      },
      {
        id: 'mud_season_special',
        title: '🌿 Eco-Foam Power Wash: K15 Off',
        description: 'Support PNG green-detailing initiative! Get K15 off our premium PH-neutral snow foam treatment.',
        code: 'ECOFOAM',
        discountFixed: 15,
        category: 'Flash Deal'
      }
    ];

    const randomDeal = flashSales[Math.floor(Math.random() * flashSales.length)];
    
    setNotifications(prev => {
      if (prev.find(p => p.id === randomDeal.id)) return prev;
      return [randomDeal, ...prev];
    });
    triggerSimulatedFlash(randomDeal);
  };

  const handleOpenDealsCenter = () => {
    setShowCenter(!showCenter);
    setHasNewBadge(false);
  };

  return (
    <div className="relative font-sans text-slate-800">
      
      {/* Ticker bar strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-120 p-2.5 rounded-xl text-indigo-600 animate-pulse">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 font-display">Schedules & Weather Flash Discounts</h4>
              {isPushAllowed && (
                <span className="bg-emerald-100 text-emerald-850 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  ACTIVE FEED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Geofenced weather guard updates and local Port Moresby traffic lane/wet season deals.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
          
          <button
            type="button"
            onClick={handleRequestPush}
            id="push_toggle_btn"
            className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              isPushAllowed
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-220/60'
                : 'bg-indigo-550 hover:bg-indigo-600 text-white border-indigo-550 shadow-sm'
            }`}
          >
            {isPushAllowed ? (
              <>
                <BellOff className="w-3.5 h-3.5" /> Mute Live Alerts
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" /> Opt-In for Live Alerts
              </>
            )}
          </button>

          {isPushAllowed && (
            <button
              type="button"
              onClick={handleManualTriggerSimulator}
              id="trigger_sim_deal_btn"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Simulate Deal Drop
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenDealsCenter}
            id="open_deals_center_btn"
            className="relative bg-white hover:bg-slate-50 text-slate-705 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-280 shadow-3xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Deals Inbox</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {notifications.length}
            </span>
            {hasNewBadge && isPushAllowed && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping" />
            )}
          </button>

        </div>
      </div>

      {/* Floated Toast Card (Simulated Push banner) */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-55 max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3 border-l-4 border-l-indigo-600"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                ⚡ LIVE ALERT: {toastNotification.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-medium">Just Now</span>
            </div>
            
            <div className="space-y-1">
              <h5 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-1.5 leading-tight">
                <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                {toastNotification.title}
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {toastNotification.description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
              <div className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 tracking-wider">
                {toastNotification.code}
              </div>
              <button
                type="button"
                id="claim_toast_deal_btn"
                onClick={() => handleClaimDealInBooking(toastNotification.code)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Apply Deal <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-slate-800 text-md absolute top-1 right-2.5 font-mono cursor-pointer"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Notification Request Dialog Modal */}
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 max-w-sm w-full rounded-2xl p-6 shadow-xl text-center space-y-4"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-indigo-120 shadow-3xs">
                🔔
              </div>
              <div className="space-y-1">
                <h4 className="text-md font-extrabold font-display text-slate-900">Subscribe to Flash Deals?</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Pride Auto Care PNG would like to feed weather-related muddy road discounts, off-peak bay clearances, and loyalty progress prompts directly to your dashboard.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmPermission(false)}
                  className="flex-1 bg-slate-100 text-slate-650 text-xs py-2.5 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Block Feed
                </button>
                <button
                  type="button"
                  id="allow_push_btn"
                  onClick={() => handleConfirmPermission(true)}
                  className="flex-1 bg-indigo-600 text-white text-xs py-2.5 rounded-xl font-extrabold hover:bg-indigo-700 transition shadow shadow-indigo-100"
                >
                  Allow Deals
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dropdown Deals Center Feed */}
      <AnimatePresence>
        {showCenter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 z-45 max-w-md w-full bg-white border border-slate-200 rounded-3xl p-5 shadow-2.5xl space-y-3"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h5 className="text-xs font-mono font-bold uppercase text-slate-800 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-indigo-600 animate-bounce" /> Active Promotional Feed ({notifications.length})
              </h5>
              <button
                onClick={() => setShowCenter(false)}
                className="text-xs text-slate-400 hover:text-slate-800 font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-2xl text-xs space-y-1.5 transition">
                  <div className="flex justify-between">
                    <span className="text-[9px] font-mono uppercase bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">
                      {n.category}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium">Promo Active</span>
                  </div>
                  <h6 className="font-extrabold text-slate-800 font-display leading-tight">{n.title}</h6>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{n.description}</p>
                  
                  <div className="pt-2.5 flex justify-between items-center border-t border-slate-200/60 mt-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">CODE: <strong className="text-indigo-600 font-extrabold">{n.code}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleClaimDealInBooking(n.code)}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100/80 text-[10px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-indigo-120 transition-all cursor-pointer"
                    >
                      Apply Promo & Scheduled Detailing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
