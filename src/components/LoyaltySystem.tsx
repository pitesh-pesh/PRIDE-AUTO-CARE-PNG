import React, { useState, useEffect } from 'react';
import { Award, ShieldAlert, Sparkles, Plus, Search, CheckCircle2, History, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoyaltyCard } from '../types';

export default function LoyaltySystem() {
  const STORAGE_KEY = 'pride_loyalty_cards';

  // State
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [activeCard, setActiveCard] = useState<LoyaltyCard | null>(null);
  const [cards, setCards] = useState<Record<string, LoyaltyCard>>({});
  const [couponCode, setCouponCode] = useState<string>('');
  const [selectedReward, setSelectedReward] = useState<string>('Complimentary Tier 3 Engine Bay Detail');
  const [staffPin, setStaffPin] = useState<string>('');
  const [securityError, setSecurityError] = useState<string>('');
  const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load all cards
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCards(parsed);
        // Default select first available or initialize standard demo loyalty
        const phoneKeys = Object.keys(parsed);
        if (phoneKeys.length > 0) {
          setActiveCard(parsed[phoneKeys[0]]);
          setSearchPhone(phoneKeys[0]);
        } else {
          // Initialize a demo loyalty card for user exploration!
          const demoPhone = '77123456';
          const demoCard: LoyaltyCard = {
            phone: demoPhone,
            customerName: 'Samson Kila',
            stamps: 3,
            unlockedRewards: [],
            history: [
              { date: '2026-06-10', type: 'Initial Stamp (First Visit)' },
              { date: '2026-06-15', type: 'Stamp Added (The Pride Deluxe Wash)' },
              { date: '2026-06-18', type: 'Stamp Added (Pride Express Wash)' }
            ]
          };
          const initialCards = { [demoPhone]: demoCard };
          setCards(initialCards);
          setActiveCard(demoCard);
          setSearchPhone(demoPhone);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCards));
        }
      } else {
        // Fallback demo setup
        const demoPhone = '77123456';
        const demoCard: LoyaltyCard = {
          phone: demoPhone,
          customerName: 'Samson Kila',
          stamps: 3,
          unlockedRewards: [],
          history: [
            { date: '2026-06-10', type: 'Initial Stamp (First Visit)' },
            { date: '2026-06-15', type: 'Stamp Added (The Pride Deluxe Wash)' },
            { date: '2026-06-18', type: 'Stamp Added (Pride Express Wash)' }
          ]
        };
        const initialCards = { [demoPhone]: demoCard };
        setCards(initialCards);
        setActiveCard(demoCard);
        setSearchPhone(demoPhone);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCards));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCardsToStateAndStorage = (updatedCards: Record<string, LoyaltyCard>) => {
    setCards(updatedCards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchPhone.trim().replace(/\D/g, '');
    if (!cleanSearch) return;

    if (cards[cleanSearch]) {
      setActiveCard(cards[cleanSearch]);
      setSecurityError('');
    } else {
      // Suggest creation
      if (window.confirm(`No Loyalty Card registered for phone "${cleanSearch}". Would you like to create a new digit punch card under this number?`)) {
        const name = prompt('Please enter Customer Full Name:', 'New Customer');
        if (name) {
          const newCard: LoyaltyCard = {
            phone: cleanSearch,
            customerName: name,
            stamps: 1,
            unlockedRewards: [],
            history: [{ date: new Date().toISOString().split('T')[0], type: 'Created Digital Card & Awarded Join-In Stamp' }]
          };
          const updated = { ...cards, [cleanSearch]: newCard };
          saveCardsToStateAndStorage(updated);
          setActiveCard(newCard);
        }
      }
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone || !customerName.trim()) {
      alert('Please fill out Name and Phone number.');
      return;
    }

    const newCard: LoyaltyCard = {
      phone: cleanPhone,
      customerName: customerName.trim(),
      stamps: 1, // Join-in promo stamp
      unlockedRewards: [],
      history: [{ date: new Date().toISOString().split('T')[0], type: 'Created Digital Card & Awarded Join-In Stamp' }]
    };

    const updated = { ...cards, [cleanPhone]: newCard };
    saveCardsToStateAndStorage(updated);
    setActiveCard(newCard);
    setSearchPhone(cleanPhone);
    setPhoneNumber('');
    setCustomerName('');
    setSuccessMessage('Congratulations! Digital Punch card created. Awarded 1 bonus stamp for registering!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleSimulateStamp = () => {
    if (!activeCard) return;

    const currentStamps = activeCard.stamps;
    let newStamps = currentStamps + 1;
    let updatedRewards = [...activeCard.unlockedRewards];
    const timestamp = new Date().toISOString().split('T')[0];
    const newHistory = [...activeCard.history];

    if (newStamps >= 5) {
      newStamps = 5;
      const genericReward = 'FREE Tier 3 Engine Bay Detail / Paint Spray Sealant';
      if (!updatedRewards.includes(genericReward)) {
        updatedRewards.push(genericReward);
      }
      newHistory.push({ date: timestamp, type: 'Stamped #5! Unlocked complimentary Tier 3 Reward voucher.' });
      setSuccessMessage('🎉 STAMP CARD COMPLETE! 5th Wash registered. Premium Tier 3 detail Reward is issued!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      newHistory.push({ date: timestamp, type: `Stamp #${newStamps} added via Simulation Tool` });
    }

    const updatedCard: LoyaltyCard = {
      ...activeCard,
      stamps: newStamps,
      unlockedRewards: updatedRewards,
      history: newHistory
    };

    const updatedCards = { ...cards, [activeCard.phone]: updatedCard };
    saveCardsToStateAndStorage(updatedCards);
    setActiveCard(updatedCard);
  };

  const handleForceReset = () => {
    if (!activeCard) return;
    if (window.confirm("Simulate resetting this card's stamps?")) {
      const updatedCard: LoyaltyCard = {
        ...activeCard,
        stamps: 0,
        unlockedRewards: [],
        history: [...activeCard.history, { date: new Date().toISOString().split('T')[0], type: 'Loyalty cards reset manually' }]
      };
      const updatedCards = { ...cards, [activeCard.phone]: updatedCard };
      saveCardsToStateAndStorage(updatedCards);
      setActiveCard(updatedCard);
    }
  };

  const handleRedeemClick = () => {
    setSelectedReward(activeCard?.unlockedRewards[0] || 'Complimentary Tier 3 Premium Spray Sealant');
    setStaffPin('');
    setSecurityError('');
    setShowRedeemModal(true);
  };

  const handleConfirmRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffPin !== '7777' && staffPin !== '1234') {
      setSecurityError('Invalid Security PIN. Enter staff authorization PIN to override.');
      return;
    }

    if (!activeCard) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const updatedCard: LoyaltyCard = {
      ...activeCard,
      stamps: 0, 
      unlockedRewards: [], 
      history: [
        ...activeCard.history,
        { date: timestamp, type: `Redeemed: ${selectedReward} (Authorized by Staff PIN)` }
      ]
    };

    const updatedCards = { ...cards, [activeCard.phone]: updatedCard };
    saveCardsToStateAndStorage(updatedCards);
    setActiveCard(updatedCard);
    setShowRedeemModal(false);
    setSuccessMessage(`Reward [${selectedReward}] claimed! Handing control to Bay Staff to execute the job.`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6" id="loyalty_center">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600 animate-pulse" />
            Digital Punch Card System
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Increase customer retention and Lifetime Value (LTV) through premium automated stamps.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100/80 text-indigo-700 font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider rounded-full font-bold self-start sm:self-auto">
          Active B2C Retention Tool
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Card display & Search tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Current Active Punch Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Active Client Punch Card</p>

          {activeCard ? (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
              {/* Premium Background Accent Gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-200/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Meta Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10 font-display">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-extrabold block">Pride Auto Care PNG</span>
                  <h3 className="text-lg font-black text-slate-800 mt-1">{activeCard.customerName}</h3>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">Mobile: +675 {activeCard.phone}</div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Reward Goal</span>
                  <span className="text-indigo-600 font-extrabold text-xs bg-indigo-50 py-1 px-3 rounded-full border border-indigo-120 block sm:inline-block mt-1">Every 5th Wash Free Detailing</span>
                </div>
              </div>

              {/* Punch grid - 5 Slots */}
              <div className="grid grid-cols-5 gap-3" id="loyalty_punch_grid">
                {[1, 2, 3, 4, 5].map((index) => {
                  const isPunched = activeCard.stamps >= index;
                  const isLastSlot = index === 5;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border transition-all ${
                        isPunched
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100/50 border-indigo-600'
                          : isLastSlot
                          ? 'bg-rose-50 border-dashed border-rose-200 text-rose-500'
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      {isPunched ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold animate-bounce">&#9733;</span>
                          <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-indigo-100 opacity-90 mt-0.5">WASH #{index}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center opacity-80">
                          {isLastSlot ? <Sparkles className="w-4 h-4 text-rose-500" /> : <span className="text-sm font-bold">☆</span>}
                          <span className="text-[8px] font-mono text-slate-400 font-bold mt-1 uppercase">{isLastSlot ? 'GIFT' : `#${index}`}</span>
                        </div>
                      )}
                      
                      {/* Subtle checklist check */}
                      {isPunched && (
                        <div className="absolute top-1 right-1 bg-white text-indigo-600 rounded-full p-0.5 shadow-sm border border-indigo-50">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/60 flex flex-wrap justify-between items-center gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Total status: <strong className="text-slate-800 font-extrabold">{activeCard.stamps} / 5</strong> punches recorded.
                </div>

                {activeCard.unlockedRewards.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleRedeemClick}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold font-display uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-lg shadow-rose-100 cursor-pointer animate-bounce"
                  >
                    Redeem Reward Voucher!
                  </button>
                ) : (
                  <div className="text-xs font-mono text-slate-400 italic">
                    {5 - activeCard.stamps} washes to unlock complimentary Detailing
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-medium">
              Select or register a customer phone number to display their interactive high-end digital punch card.
            </div>
          )}

          {/* SIMULATOR TOOL BAR */}
          {activeCard && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 shadow-3xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  Stamps Testing Console (Simulator)
                </span>
                <span className="text-[9px] text-slate-400">Allows direct testing of card workflows</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="simulate_stamp_btn"
                  onClick={handleSimulateStamp}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Simulate Visit + Add Punch Star
                </button>
                <button
                  type="button"
                  onClick={handleForceReset}
                  className="bg-white text-slate-700 hover:bg-slate-100 text-xs py-2 px-3 rounded-xl border border-slate-200 transition flex items-center gap-1 cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Search Card & Register Forms (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:block xl:space-y-6">
          
          {/* Form A: Quick Lookup */}
          <form onSubmit={handleSearch} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs uppercase font-mono text-slate-500 font-bold tracking-wider">Search Registered Phone</h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 77123456"
                  maxLength={12}
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 placeholder-slate-450 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-50 font-medium"
                />
              </div>
              <button
                type="submit"
                id="search_loyalty_btn"
                className="bg-slate-220 text-slate-705 hover:bg-slate-300 font-bold text-xs px-4 rounded-xl border border-slate-300 transition-all cursor-pointer"
              >
                Lookup
              </button>
            </div>
            <p className="text-[10px] text-slate-405 font-medium">Enter PNG mobile numbers. Default demo accounts pre-provisioned.</p>
          </form>

          {/* Form B: Register New Card */}
          <form onSubmit={handleCreateCard} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
            <h4 className="text-xs uppercase font-mono text-slate-500 font-bold tracking-wider">Register New Loyalty Card</h4>
            
            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Client Name (e.g., Joshua Mara)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-50 font-medium"
              />
              <input
                type="text"
                required
                placeholder="PNG Phone Number (e.g., 70123456)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-50 font-medium"
              />
            </div>

            <button
              type="submit"
              id="register_loyalty_btn"
              className="w-full bg-indigo-50 text-indigo-700 border border-indigo-120 hover:bg-indigo-100 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Issue Digital Punch Card
            </button>
          </form>

          {/* Loyalty History Track logs */}
          {activeCard && activeCard.history.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:col-span-2 xl:col-span-1">
              <h5 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider font-extrabold mb-3.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Account Activity Log
              </h5>
              <div className="space-y-2 max-h-32 overflow-y-auto text-[11px] pr-1 font-medium">
                {activeCard.history.slice().reverse().map((hist, i) => (
                  <div key={i} className="flex justify-between gap-2 border-b border-slate-100 pb-1 text-slate-650">
                    <span className="truncate">{hist.type}</span>
                    <span className="text-slate-400 shrink-0 font-mono text-[10px]">{hist.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Staff Pin Authorization Modal */}
      <AnimatePresence>
        {showRedeemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 max-w-sm w-full rounded-2xl p-6 shadow-xl space-y-4 text-slate-800"
            >
              <div className="flex items-center gap-2 text-indigo-600">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="text-md font-extrabold text-slate-900 font-display">Staff Reward Redemption</h3>
              </div>
              
              <form onSubmit={handleConfirmRedemption} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are redeeming the 5-stamp loyalty reward for customer <strong>{activeCard?.customerName}</strong>.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Select Unlocked Gift Offer</label>
                  <select
                    value={selectedReward}
                    onChange={(e) => setSelectedReward(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-2.5 text-slate-800 outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-semibold"
                  >
                    <option value="Complimentary Tier 3 Engine Bay Detail">Complimentary Tier 3 Engine Bay Detail</option>
                    <option value="Complimentary Premium Spray-Sealant Gloss Coat">Complimentary Premium Spray-Sealant Gloss Coat</option>
                    <option value="Complimentary Exterior Deironizer and Clay Treatment">Complimentary Deironizer & Clay Treatment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Enter Site Supervisor Authorization PIN</label>
                  <input
                    type="password"
                    placeholder="Enter Staff supervisor PIN"
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-center font-mono text-sm tracking-widest p-2.5 rounded-xl text-slate-900 focus:ring-1 focus:ring-indigo-120 focus:border-indigo-550"
                  />
                  <p className="text-[9px] text-slate-405 text-right font-medium">Tip: Use simulator pin <strong>7777</strong> or <strong>1234</strong></p>
                </div>

                {securityError && (
                  <p className="text-xs text-rose-500 font-bold text-center">{securityError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRedeemModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs px-4 py-2 rounded-xl border border-slate-250 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit_redeem_btn"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                  >
                    Authorize Free Detailing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
