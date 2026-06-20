import React, { useState } from 'react';
import { INITIAL_BAYS, SOP_STEPS } from '../data';
import { BayState } from '../types';
import { Layers, Cpu, DollarSign, Calculator, Info, Check, Play, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BusinessSimulator() {
  // Live State (Expanding from 4 to 8 detailing wash bays based on business parameters)
  const [bays, setBays] = useState<BayState[]>(INITIAL_BAYS);
  const [selectedBayId, setSelectedBayId] = useState<number | null>(1);
  
  // Custom Economics sliders
  const [dailyVehicles, setDailyVehicles] = useState<number>(22); // MODAL Default
  const [averageOrderValue, setAverageOrderValue] = useState<number>(118); // weighted average prices
  const [laborCommission, setLaborCommission] = useState<number>(12); // commission K12
  const [chemicalCost, setChemicalCost] = useState<number>(3.5);
  const [waterPowerCost, setWaterPowerCost] = useState<number>(2.5);
  const [suppliesCost, setSuppliesCost] = useState<number>(1.5);
  
  // Static calculations based on PDF
  const DEFAULT_OPERATING_DAYS = 26;

  // Derive Economics
  const cogsPerUnit = chemicalCost + waterPowerCost + suppliesCost + laborCommission;
  const unitProfit = Math.max(0, averageOrderValue - cogsPerUnit);
  const profitMarginPercent = averageOrderValue > 0 ? (unitProfit / averageOrderValue) * 100 : 0;
  
  const monthlyVolume = dailyVehicles * DEFAULT_OPERATING_DAYS;
  const monthlyRevenue = monthlyVolume * averageOrderValue;
  const monthlyCOGS = monthlyVolume * cogsPerUnit;
  const monthlyGrossProfit = monthlyRevenue - monthlyCOGS;

  const handleProgressWorkflow = (id: number) => {
    const updatedBays = bays.map((bay) => {
      if (bay.id !== id) return bay;

      let nextStatus: BayState['status'] = 'Available';
      let nextVeh = bay.currentVehicle;

      if (bay.status === 'Available') {
        nextStatus = 'SOP-Step-1';
        nextVeh = {
          licensePlate: 'PNG-' + Math.floor(100 + Math.random() * 900),
          model: ['Toyota Hilux 4x4', 'Ford Ranger Rapture', 'Lexus LX600 Luxury', 'Mazda BT-50'][Math.floor(Math.random() * 4)],
          package: ['The Pride Deluxe', 'Pride Express Exterior', 'The Royal Treatment'][Math.floor(Math.random() * 3)],
          stepTimeElapsed: 0
        };
      } else if (bay.status === 'SOP-Step-1') {
        nextStatus = 'SOP-Step-2';
      } else if (bay.status === 'SOP-Step-2') {
        nextStatus = 'SOP-Step-3';
      } else if (bay.status === 'SOP-Step-3') {
        nextStatus = 'SOP-Step-4';
      } else if (bay.status === 'SOP-Step-4') {
        nextStatus = 'Available';
        nextVeh = undefined;
      }

      // If progress and time changes
      if (nextVeh) {
        nextVeh.stepTimeElapsed = nextVeh.stepTimeElapsed + Math.floor(Math.random() * 5 + 5);
      }

      return {
        ...bay,
        status: nextStatus,
        currentVehicle: nextVeh
      };
    });

    setBays(updatedBays);
  };

  const getSOPColor = (status: BayState['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold';
      case 'SOP-Step-1': return 'bg-blue-50 border-blue-200 text-blue-700 font-bold';
      case 'SOP-Step-2': return 'bg-purple-50 border-purple-200 text-purple-700 font-bold';
      case 'SOP-Step-3': return 'bg-amber-50 border-amber-200 text-amber-700 font-bold';
      case 'SOP-Step-4': return 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const currentSelectedBayObj = bays.find(b => b.id === selectedBayId);

  return (
    <div className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm" id="business_dashboard">
      
      {/* Tab Header segment */}
      <div className="border-b border-slate-100 pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-600 animate-pulse" />
            Business Operations & Scaling Studio
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulate operational bottlenecks, run unit economics calculations, and maintain PNG standard operating protocols.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-120 text-indigo-750 font-mono text-[10px] px-3.5 py-1.5 uppercase tracking-wider rounded-full font-extrabold self-start sm:self-auto">
          Pro-Forma Capacity Tool
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Real-Time Bay Assembly Flow Controller & SOP (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <span className="text-xs uppercase font-mono text-slate-700 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Detailing Assembly Layout ({bays.length} active bays)
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">Click a bay to inspect details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bays.map((bay) => {
              const theme = getSOPColor(bay.status);
              const isSelected = selectedBayId === bay.id;
              return (
                <div
                  key={bay.id}
                  onClick={() => setSelectedBayId(bay.id)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/20 border-indigo-500 ring-1 ring-indigo-400/40 shadow-xs' 
                      : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-slate-800 tracking-tight font-display">{bay.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200/60">
                      {bay.type}
                    </span>
                  </div>

                  {bay.currentVehicle ? (
                    <div className="space-y-1.5 mt-2 p-3 bg-white border border-slate-200/60 rounded-xl">
                      <div className="font-mono text-xs text-indigo-650 font-bold tracking-wide truncate">
                        🚙 {bay.currentVehicle.licensePlate}
                      </div>
                      <div className="text-[11px] text-slate-650 truncate font-semibold">{bay.currentVehicle.model}</div>
                      <div className="text-[10px] text-slate-400 font-display italic truncate">
                        {bay.currentVehicle.package}
                      </div>
                    </div>
                  ) : (
                    <div className="py-7 text-center text-xs text-slate-400 font-mono italic">
                      [ Detailing Bay Empty ]
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className={`text-[9px] font-mono uppercase font-extrabold py-0.5 px-2 rounded-full border ${theme}`}>
                      {bay.status === 'Available' ? 'Ready' : bay.status.replace('SOP-Step-', 'SOP Phase ')}
                    </span>
                    <button
                      type="button"
                      id={`progress_bay_${bay.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProgressWorkflow(bay.id);
                      }}
                      className="bg-white hover:bg-indigo-600 hover:text-white border border-slate-350 text-slate-700 font-mono text-[9px] tracking-wider py-1.5 px-2.5 rounded-lg transition-all font-bold uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 shrink-0" /> Phase Step
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active selected Bay walkthrough */}
          <AnimatePresence mode="wait">
            {currentSelectedBayObj && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50/60 border border-slate-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-200/60 pb-3 font-display">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">
                      Detailing Console: {currentSelectedBayObj.name} ({currentSelectedBayObj.type})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Physical Config: {currentSelectedBayObj.type === 'Wet Ingress' 
                        ? 'High pressure hot-water washers, chemical snow boom, and drainage filters.' 
                        : 'Dual commercial vacuums, leather cleaner carts, high-intensity buffer lines.'}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 font-bold">
                    Zone: {currentSelectedBayObj.status}
                  </span>
                </div>

                {currentSelectedBayObj.currentVehicle ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-3xs">
                      <span className="text-[10px] uppercase font-mono text-indigo-600 font-extrabold block">Vehicle Logistics</span>
                      <div>
                        <span className="text-slate-400">Plates registered:</span>
                        <p className="font-mono text-sm font-bold text-slate-800 mt-0.5">{currentSelectedBayObj.currentVehicle.licensePlate}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Vehicle Type Model:</span>
                        <p className="text-slate-700 font-semibold mt-0.5">{currentSelectedBayObj.currentVehicle.model}</p>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-3xs">
                      <span className="text-[10px] uppercase font-mono text-indigo-600 font-extrabold block">Protocol Step Compliance</span>
                      <div>
                        <span className="text-slate-400">SOP Phase:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {currentSelectedBayObj.status === 'Available' ? 'Pre-intake Stage' : 
                           currentSelectedBayObj.status === 'SOP-Step-1' ? 'Step 1 - Heavy Mud Knockdown' :
                           currentSelectedBayObj.status === 'SOP-Step-2' ? 'Step 2 - snow foam pre-wash soak' :
                           currentSelectedBayObj.status === 'SOP-Step-3' ? 'Step 3 - The Multi-Bucket clean' :
                           'Step 4 - microfibre contact / blower dry'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Elapsed time inside bay:</span>
                        <p className="font-mono font-bold text-indigo-605 mt-0.5">{currentSelectedBayObj.currentVehicle.stepTimeElapsed} Minutes elapsed</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-7 text-center text-xs text-slate-500 bg-white border border-dashed border-slate-250 rounded-xl leading-relaxed">
                    This bay is unoccupied. Click "Phase Step" beside any detailing bay to register a virtual incoming vehicle and monitor standard operating procedures.
                  </div>
                )}

                {/* SOP Steps layout */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Standard Operating Protocol (SOP Compliance)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {SOP_STEPS.map((step) => {
                      const isActiveStep = currentSelectedBayObj.status === `SOP-Step-${parseInt(step.num)}`;
                      return (
                        <div
                          key={step.num}
                          className={`p-3 rounded-xl text-[11px] leading-relaxed border transition-all ${
                            isActiveStep 
                              ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-200/40 text-slate-800 font-medium'
                              : 'bg-white border-slate-200 text-slate-500 shadow-3xs'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className={`font-mono text-[9px] font-bold py-0.5 px-2 rounded-full ${
                              isActiveStep ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {step.num}
                            </span>
                            <span className="font-extrabold truncate text-slate-800">{step.title}</span>
                          </div>
                          <p className="line-clamp-3 text-[10px] text-slate-500 leading-tight">{step.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Pro-Forma Unit Economics Interactive Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-6 shadow-3xs">
            <h4 className="text-sm font-extrabold font-display text-slate-805 border-b border-slate-200/60 pb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-650" />
              Pro-Forma Growth Calculator
            </h4>

            {/* Micro sliders list */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 font-semibold">1. Average Daily Traffic</span>
                  <span className="text-indigo-600 font-extrabold">{dailyVehicles} Car washes / Day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={dailyVehicles}
                  onChange={(e) => setDailyVehicles(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                  <span>5 washes</span>
                  <span>22 (SOP model)</span>
                  <span>60 (Max capacity)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 font-semibold">2. Average Ticket Price (PGK)</span>
                  <span className="text-indigo-600 font-extrabold">K {averageOrderValue}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="280"
                  step="5"
                  value={averageOrderValue}
                  onChange={(e) => setAverageOrderValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-medium font-mono">
                  <span>K50 (Express)</span>
                  <span>K118 (Deluxe avg)</span>
                  <span>K280 (Royal Max)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 font-semibold">3. Detailing Staff Commission / Unit</span>
                  <span className="text-indigo-600 font-extrabold">K {laborCommission}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={laborCommission}
                  onChange={(e) => setLaborCommission(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Economics outputs based on math */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-205 divide-y divide-slate-100 shadow-3xs">
              
              {/* Unit breakdown */}
              <div className="pb-3 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-extrabold">Unit Cost Allocation Ledger</span>
                <div className="flex justify-between text-slate-600">
                  <span>Chemical consumables (Active Foam)</span>
                  <span className="font-mono text-slate-800">K {chemicalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Utilities (Water volume & high power)</span>
                  <span className="font-mono text-slate-800">K {waterPowerCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Microfiber depreciation & Buffers</span>
                  <span className="font-mono text-slate-800">K {suppliesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Staff Bay Commission bonus payout</span>
                  <span className="font-mono text-slate-800 font-bold">K {laborCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-1.5 font-bold border-t border-slate-100">
                  <span>Total Unit variable cost (COGS)</span>
                  <span className="font-mono text-slate-900">K {cogsPerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 pt-1.5 font-light">
                  <span className="font-semibold text-emerald-800">Net Margins (% Profits / job)</span>
                  <strong className="font-mono font-black">{profitMarginPercent.toFixed(0)}% (K {unitProfit.toFixed(2)})</strong>
                </div>
              </div>

              {/* Monthly totals forecasts */}
              <div className="pt-3 text-xs space-y-3">
                <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold block">Monthly Scalability Blueprint</span>
                
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">Monthly Volume</span>
                    <p className="text-sm font-black text-slate-800 mt-1">{monthlyVolume} Vehicles</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">Average Revenue</span>
                    <p className="text-sm font-black text-slate-800 mt-1">K {monthlyRevenue?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl text-center shadow-xs">
                  <span className="text-[9px] text-emerald-600 uppercase tracking-widest font-mono font-bold">Forested Net Gross Profits / Month</span>
                  <p className="text-2xl font-black font-display text-emerald-700 mt-1">K {monthlyGrossProfit?.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 italic mt-1 font-medium">Assuming base rent is fully covered by fleet subscription passes.</p>
                </div>
              </div>

            </div>

            {/* Informational booster footer */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-slate-650 leading-relaxed flex gap-2 font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>B2B Strategy Upgrade:</strong> Securing 15 corporate line-of-credit deals (Pride Fleet Passes, see Section 6) covers the entire base rental framework of the Port Moresby facility, allowing all retail washes to output pristine 85% net physical earnings straight to core capital expansion.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
