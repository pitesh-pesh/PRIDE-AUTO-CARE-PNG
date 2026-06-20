import React, { useState, useEffect } from 'react';
import { WASH_PACKAGES, SPECIAL_DEALS } from '../data';
import { VehicleType, Booking, WashPackage, Deal } from '../types';
import { Calendar, Clock, User, Phone, Car, Sparkles, Check, CheckCircle, Ticket, AlertCircle, Trash2, CalendarCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingFormProps {
  appliedDealCode?: string;
  onDealUsed?: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

export default function BookingForm({ appliedDealCode = '', onDealUsed, onBookingSuccess }: BookingFormProps) {
  // Persistence key
  const STORAGE_KEY = 'pride_bookings';

  // React state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('deluxe');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);

  // Time slots generated from 8:00 AM to 5:00 PM (10 hours day capacity from section 4)
  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Load bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bookings", e);
    }
  }, []);

  // Listen to external applied deal code (from notifications center)
  useEffect(() => {
    if (appliedDealCode) {
      setPromoCode(appliedDealCode);
      validateAndApplyPromo(appliedDealCode);
    }
  }, [appliedDealCode]);

  const selectedPackage = WASH_PACKAGES.find(p => p.id === selectedPackageId) || WASH_PACKAGES[1];
  const basePrice = vehicleType === 'Sedan' ? selectedPackage.sedanPrice : selectedPackage.suvPrice;

  // Calculate prices
  let discountAmount = 0;
  if (activeDeal) {
    if (activeDeal.targetPackageId && activeDeal.targetPackageId !== selectedPackageId) {
      // Deal is restricted to another package
    } else {
      if (activeDeal.discountPercentage) {
        discountAmount = Math.round((basePrice * activeDeal.discountPercentage) / 100);
      } else if (activeDeal.discountFixed) {
        discountAmount = activeDeal.discountFixed;
      }
    }
  }
  const finalPrice = Math.max(15, basePrice - discountAmount); // Minimum K15

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndApplyPromo(promoCode);
  };

  const validateAndApplyPromo = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      setActiveDeal(null);
      setPromoError('');
      return;
    }
    const foundDeal = SPECIAL_DEALS.find(d => d.code === cleanCode);
    if (foundDeal) {
      if (foundDeal.targetPackageId && foundDeal.targetPackageId !== selectedPackageId) {
        setPromoError(`This promo is only applicable to the "${WASH_PACKAGES.find(p => p.id === foundDeal.targetPackageId)?.name}" wash.`);
        setActiveDeal(null);
      } else {
        setActiveDeal(foundDeal);
        setPromoError('');
      }
    } else {
      setPromoError('Invalid promotion code. Please check and try again.');
      setActiveDeal(null);
    }
  };

  // Re-evaluate promo when package changes
  useEffect(() => {
    if (promoCode) {
      validateAndApplyPromo(promoCode);
    }
  }, [selectedPackageId]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !bookingDate || !bookingTime) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const newBooking: Booking = {
      id: 'PRIDE-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerName.trim(),
      phone: phone.trim(),
      vehicleType,
      packageId: selectedPackageId,
      packageName: selectedPackage.name,
      date: bookingDate,
      time: bookingTime,
      notes: notes.trim(),
      totalCost: finalPrice,
      appliedDeal: activeDeal ? activeDeal.title : undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));

    setRecentBooking(newBooking);
    setIsSubmitted(true);

    // Call callbacks
    if (onDealUsed && activeDeal) {
      onDealUsed();
    }
    if (onBookingSuccess) {
      onBookingSuccess(newBooking);
    }

    // Append standard simulated stamp to loyalty program for this user phone
    try {
      const storedLoyalty = localStorage.getItem('pride_loyalty_cards');
      const cards = storedLoyalty ? JSON.parse(storedLoyalty) : {};
      const normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone) {
        let card = cards[normalizedPhone];
        if (!card) {
          card = {
            phone: normalizedPhone,
            customerName: customerName.trim(),
            stamps: 0,
            unlockedRewards: [],
            history: []
          };
        }
        card.stamps = Math.min(5, card.stamps + 1);
        card.history.push({
          date: bookingDate,
          type: `Completed ${selectedPackage.name} (${vehicleType})`
        });
        
        cards[normalizedPhone] = card;
        localStorage.setItem('pride_loyalty_cards', JSON.stringify(cards));
      }
    } catch(err) {
      console.error("Failed to automatically add loyalty stamp", err);
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleResetForm = () => {
    setCustomerName('');
    setPhone('');
    setBookingDate('');
    setBookingTime('');
    setNotes('');
    setPromoCode('');
    setActiveDeal(null);
    setIsSubmitted(false);
    setRecentBooking(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm" id="booking_center">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600 animate-pulse" />
            Integrated Booking Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">Schedule your premium detailing service at Port Moresby facility.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100/80 text-indigo-700 font-mono text-xs px-3.5 py-1.5 rounded-full font-bold self-start sm:self-auto">
          Est. Duration: 25-45 Min
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <form onSubmit={handleCreateBooking} className="space-y-6">
            {/* 1. Vehicle Footprint */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono text-slate-500 tracking-wider block font-bold">1. Select Vehicle Footprint</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="vehicle_sedan_btn"
                  onClick={() => setVehicleType('Sedan')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl font-bold transition-all ${
                    vehicleType === 'Sedan'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border border-indigo-600'
                      : 'bg-slate-50 text-slate-650 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Car className="w-5 h-5 shrink-0" />
                  <div className="text-left font-display">
                    <div className="text-sm font-extrabold">Sedan / Hatchback</div>
                    <div className="text-[10px] opacity-80 font-normal">General size class</div>
                  </div>
                </button>
                <button
                  type="button"
                  id="vehicle_suv_btn"
                  onClick={() => setVehicleType('SUV/4x4')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl font-bold transition-all ${
                    vehicleType === 'SUV/4x4'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border border-indigo-600'
                      : 'bg-slate-50 text-slate-650 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <div className="text-left font-display">
                    <div className="text-sm font-extrabold">SUV / 4x4 / Dual Cab</div>
                    <div className="text-[10px] opacity-80 font-normal">Heavy road mud clearance</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Package Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-mono text-slate-500 tracking-wider block font-bold">2. Select Wash Tier & Services</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {WASH_PACKAGES.map((pkg) => {
                  const price = vehicleType === 'Sedan' ? pkg.sedanPrice : pkg.suvPrice;
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`relative cursor-pointer flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-indigo-50/40 border-indigo-500 shadow-sm ring-1 ring-indigo-400/40'
                          : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60 hover:border-slate-350'
                      }`}
                    >
                      {pkg.tier === 2 && (
                        <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                          Hero Tier
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`text-sm font-black tracking-tight ${isSelected ? 'text-indigo-700' : 'text-slate-850'}`}>
                            {pkg.name}
                          </h4>
                          <span className={`text-[9px] font-mono uppercase font-bold py-0.5 px-2 rounded-full ${
                            pkg.tier === 1 ? 'bg-blue-100 text-blue-800' : pkg.tier === 2 ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Tier {pkg.tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{pkg.description}</p>
                        
                        <ul className="space-y-1.5 mb-4">
                          {pkg.inclusions.slice(0, 3).map((inc, index) => (
                            <li key={index} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </li>
                          ))}
                          {pkg.inclusions.length > 3 && (
                            <li className="text-[10px] text-slate-400 italic pl-5">+{pkg.inclusions.length - 3} premium inclusions</li>
                          )}
                        </ul>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3 mt-auto flex items-baseline justify-between font-display">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Total PGK</span>
                        <span className="text-xl font-black text-slate-900">K {price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Details & Date/Time block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Personal info */}
              <div className="space-y-4">
                <div className="space-y-1.5 font-display">
                  <label className="text-xs uppercase font-mono text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Complete Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter owner's full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5 font-display">
                  <label className="text-xs uppercase font-mono text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> PNG Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 70001234 (Used for auto-loyalty)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all font-medium"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Every scheduled wash triggers +1 automatic punch in loyalty account.</p>
                </div>

                <div className="space-y-1.5 font-display">
                  <label className="text-xs uppercase font-mono text-slate-500 tracking-wider font-bold">Vehicle Notes & Instructions</label>
                  <textarea
                    rows={2.5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., heavily dirty lower sill boards, mud in engine bay..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all resize-none font-medium"
                  />
                </div>
              </div>

              {/* Right Column: Date & Time Selector */}
              <div className="space-y-4">
                <div className="space-y-1.5 font-display">
                  <label className="text-xs uppercase font-mono text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Select Wash Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all font-medium text-slate-750"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-mono text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Preferred Detailing Slot <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingTime(slot)}
                        className={`py-2 px-1 text-center font-mono text-xs rounded-lg transition-all ${
                          bookingTime === slot
                            ? 'bg-indigo-600 text-white font-bold shadow-sm border border-indigo-600'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-right font-medium">Site Operational hours: 8:00 AM - 6:00 PM</p>
                </div>

                {/* Promo Code Segment */}
                <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/40 space-y-2.5">
                  <label className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <Ticket className="w-3.5 h-3.5 text-indigo-600" /> Have a Promotional Deal Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code e.g. MONSOON15"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => validateAndApplyPromo(promoCode)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-705 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-350 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {activeDeal && (
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Applied: <strong>{activeDeal.title}</strong> (-K{discountAmount})
                    </div>
                  )}
                  {promoError && (
                    <div className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{promoError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Check/Summary Row and Submit */}
            <div className="border-t border-slate-200/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-50 p-3 px-4 rounded-xl border border-slate-200/60 flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Original Price</span>
                  <span className="text-xs line-through text-slate-400 font-bold">K {basePrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="bg-rose-50 p-3 px-4 rounded-xl border border-rose-100 flex flex-col">
                    <span className="text-[9px] text-rose-600 uppercase tracking-widest font-mono font-bold">Loyalty / Deal Saver</span>
                    <span className="text-xs text-rose-600 font-extrabold">- K {discountAmount}</span>
                  </div>
                )}
                <div className="bg-emerald-50 p-3 px-5 rounded-2xl border border-emerald-100 flex flex-col shadow-xs">
                  <span className="text-[9px] text-emerald-600 uppercase tracking-widest font-mono font-bold">Net Price (PGK)</span>
                  <span className="text-base text-emerald-700 font-black font-display">K {finalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                id="submit_booking_btn"
                className="w-full sm:w-auto bg-indigo-600 text-white font-extrabold font-display px-8 py-4 rounded-2xl hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-lg transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                Confirm Luxury Wash Reservation
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Ticket layout */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-center space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black font-display text-emerald-800">Booking Scheduled Successfully!</h3>
              <p className="text-xs text-slate-500">
                A reservation request is lodged with Pride Auto Care Port Moresby database.
              </p>
            </div>
            
            {recentBooking && (
              <div className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-2xl p-5 text-left divide-y divide-slate-100 shadow-xs">
                <div className="flex justify-between pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-650 uppercase font-bold tracking-widest">Reservation ID</span>
                    <h5 className="text-sm font-mono text-slate-800 font-extrabold">{recentBooking.id}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Net Price</span>
                    <h5 className="text-sm text-emerald-650 font-bold">K {recentBooking.totalCost}</h5>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 py-3.5 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Owner Name</span>
                    <span className="text-slate-800 font-bold">{recentBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone</span>
                    <span className="text-slate-800 font-medium font-mono">{recentBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Date Scheduled</span>
                    <span className="text-slate-800 font-bold font-mono">{recentBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Incoming Time Slot</span>
                    <span className="text-slate-800 font-bold font-mono">{recentBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Vehicle Footprint</span>
                    <span className="text-slate-800 font-medium">{recentBooking.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Invoiced Wash Detail</span>
                    <span className="text-slate-800 font-bold truncate block">{recentBooking.packageName}</span>
                  </div>
                </div>

                <div className="pt-3.5 text-[10px] text-slate-500 flex items-start gap-1.5 font-medium leading-relaxed">
                  <span className="text-indigo-600 font-bold text-sm leading-none">★</span>
                  <span>
                    Auto-loyalty updated! Inputting phone <strong>{recentBooking.phone}</strong> into our database registers your car and awards you +1 stars on your digital punch card!
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-250 transition-all cursor-pointer"
              >
                Book Another Car
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setRecentBooking(null);
                }}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-5 py-2.5 rounded-xl border border-indigo-120 transition-all cursor-pointer"
              >
                Close Ticket
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings log */}
      {bookings.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3.5 font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Your Scheduled Detailing Requests ({bookings.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {bookings.map((b) => (
              <div key={b.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-3xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800 font-extrabold text-sm">{b.id}</span>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{b.vehicleType}</span>
                    <span className="text-emerald-700 font-black">K {b.totalCost}</span>
                  </div>
                  <div className="text-slate-500 mt-1 font-medium">
                    {b.packageName} &bull; <span className="font-mono text-indigo-650 font-bold">{b.date} at {b.time}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Client: {b.customerName} ({b.phone})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteBooking(b.id)}
                  className="p-1.5 px-3 text-rose-605 hover:bg-rose-50 hover:text-rose-700 rounded-lg border border-transparent hover:border-rose-100 transition flex items-center gap-1 mt-1 sm:mt-0 cursor-pointer self-end sm:self-auto font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
