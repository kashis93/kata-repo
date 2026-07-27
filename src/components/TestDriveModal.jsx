import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle2, X, Car, Sparkles } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { formatINRLakhCrore } from '../utils/formatters';

export const TestDriveModal = ({
  vehicle,
  user,
  isOpen,
  onClose,
  onOpenProfile
}) => {
  if (!isOpen || !vehicle) return null;

  const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]; // 2 days in future
  const [appointmentDate, setAppointmentDate] = useState(defaultDate);
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [location, setLocation] = useState('CariusX Main Gallery Showroom');
  const [userName, setUserName] = useState(
    user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : '')
  );
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledAppointment, setScheduledAppointment] = useState(null);

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  const locations = [
    'CariusX Flagship Gallery Showroom',
    'Private Residence Delivery Concierge',
    'Executive Airport / Hotel Meetpoint'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await appointmentService.scheduleTestDrive({
        vehicleId: vehicle.id,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year || 2025,
        vehiclePrice: vehicle.price,
        vehicleImage: vehicle.imageUrl,
        userName: userName || 'Valued Collector',
        userEmail: userEmail || 'guest@cariusx.com',
        userPhone,
        appointmentDate,
        appointmentTime,
        location,
        notes
      });

      setScheduledAppointment(result);
    } catch (err) {
      console.error('Error scheduling test drive:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* 3D Glassmorphism Shadow Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E5DCCF] shadow-[0_20px_60px_rgba(31,24,19,0.35),0_4px_16px_rgba(139,90,43,0.15)] overflow-hidden transition-all">
        
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-[#1F1813] via-[#2D231C] to-[#1F1813] text-white flex items-center justify-between border-b border-[#3D3128]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(139,90,43,0.4)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base tracking-tight text-white">
                Schedule VIP Test Drive
              </h3>
              <p className="text-[11px] font-mono text-amber-300">
                Firestore Synced Appointment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {scheduledAppointment ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black font-display text-[#1F1813]">
                Test Drive Scheduled!
              </h4>
              <p className="text-xs text-[#6B5E52] max-w-sm mx-auto leading-relaxed">
                Your reservation for the <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong> has been saved to the Firestore <code className="bg-[#F8F4EC] px-1 py-0.5 rounded text-[#8B5A2B]">appointments</code> database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] text-left text-xs font-sans space-y-2 text-[#1F1813]">
              <div className="flex justify-between border-b border-[#E5DCCF] pb-2">
                <span className="font-bold text-[#6B5E52]">Appointment ID:</span>
                <span className="font-mono font-bold text-[#8B5A2B]">{scheduledAppointment.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5DCCF] pb-2">
                <span className="font-bold text-[#6B5E52]">Date & Time:</span>
                <span className="font-bold">{scheduledAppointment.appointmentDate} at {scheduledAppointment.appointmentTime}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5DCCF] pb-2">
                <span className="font-bold text-[#6B5E52]">Location:</span>
                <span className="font-bold text-right max-w-[200px] truncate">{scheduledAppointment.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#6B5E52]">Guest:</span>
                <span className="font-bold">{scheduledAppointment.userName} ({scheduledAppointment.userPhone})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenProfile?.();
                }}
                className="w-full sm:flex-1 py-3 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(139,90,43,0.3)] transition-all cursor-pointer"
              >
                View in Profile Dashboard
              </button>

              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3 bg-[#F8F4EC] hover:bg-[#EAE1D3] border border-[#E5DCCF] text-[#1F1813] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Selected Vehicle Banner Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF]">
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-16 h-12 object-cover rounded-xl bg-white border border-[#E5DCCF] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#1F1813] font-display truncate">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-xs font-bold text-[#8B5A2B] font-display">
                  {formatINRLakhCrore(vehicle.price)}
                </p>
              </div>
            </div>

            {/* Date & Time Selection Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                Experience Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5E52] mb-1">
                Concierge Notes / Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Specific track request, driver preference, accessibility requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            {/* Action Buttons with 3D Effect */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-xs font-bold text-[#6B5E52] hover:text-[#1F1813] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-[0_4px_14px_rgba(139,90,43,0.35)] hover:shadow-[0_6px_18px_rgba(139,90,43,0.45)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Scheduling Appointment...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Confirm & Schedule Test Drive</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default TestDriveModal;
