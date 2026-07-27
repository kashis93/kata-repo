import React, { useState, useEffect } from 'react';
import { X, User, Heart, Calendar, Car, Plus, Shield, LogOut, CheckCircle, ShoppingBag, Eye, Trash2, Clock, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VehicleCard } from './VehicleCard';
import { formatINRLakhCrore } from '../utils/formatters';
import { appointmentService } from '../services/appointmentService';
import { LogoutConfirmModal } from './LogoutConfirmModal';

export const UserProfileModal = ({
  isOpen,
  onClose,
  vehicles = [],
  savedIds = [],
  onToggleSave,
  onPurchase,
  onOpenDetails,
  onOpenAddVehicle,
  onDeleteVehicle,
  onScheduleTestDrive
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'appointments' | 'reservations' | 'my-vehicles'
  const [appointments, setAppointments] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const list = appointmentService.getAppointments(user.email);
      setAppointments(list);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleCancelAppointment = (id) => {
    const updated = appointmentService.cancelAppointment(id);
    setAppointments(updated);
  };

  const displayName = user.name || user.fullName || user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Filter bookmarked vehicles
  const savedVehicles = vehicles.filter(v => savedIds.includes(v.id));

  // Get reservations stored in localStorage
  const getStoredReservations = () => {
    try {
      const p1 = localStorage.getItem('autolot_purchases_v1');
      const p2 = localStorage.getItem('autolot_user_purchases');
      const list1 = p1 ? JSON.parse(p1) : [];
      const list2 = p2 ? JSON.parse(p2) : [];
      const combined = [...list1, ...list2];
      // Deduplicate by id
      const unique = [];
      const seen = new Set();
      for (const item of combined) {
        const id = item.id || `${item.vehicleId}_${item.timestamp}`;
        if (!seen.has(id)) {
          seen.add(id);
          unique.push(item);
        }
      }
      return unique;
    } catch {
      return [];
    }
  };

  const reservations = getStoredReservations();

  // If dealer/admin or custom added vehicles
  const myAddedVehicles = vehicles.filter(v => v.addedBy === user.email || user.role === 'admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-[#F8F4EC] via-[#F2EBE1] to-[#F8F4EC] border-b border-[#E5DCCF] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#6E4520] text-white flex items-center justify-center font-display font-extrabold text-2xl shadow-lg ring-2 ring-[#8B5A2B]/30">
                {displayName.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" title="Online & Verified">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold font-display text-[#1F1813]">
                  {displayName}
                </h2>
                {user.role === 'admin' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-mono font-extrabold border border-red-300 flex items-center gap-1 shadow-xs">
                    <Shield className="w-3 h-3 text-red-600" /> DEALER ADMIN
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-extrabold border border-emerald-300 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-emerald-700" /> VIP GOLD MEMBER
                  </span>
                )}
              </div>

              <p className="text-xs text-[#6B5E52] mt-0.5 font-mono">{user.email}</p>

              {/* Account Quick Metrics Pills */}
              <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#1F1813]">
                <span className="px-2 py-0.5 bg-white/80 rounded-md border border-[#E5DCCF]">
                  <strong className="text-[#8B5A2B]">{savedVehicles.length}</strong> Saved
                </span>
                <span className="px-2 py-0.5 bg-white/80 rounded-md border border-[#E5DCCF]">
                  <strong className="text-[#8B5A2B]">{appointments.length}</strong> Test Drives
                </span>
                <span className="px-2 py-0.5 bg-white/80 rounded-md border border-[#E5DCCF]">
                  <strong className="text-[#8B5A2B]">{reservations.length}</strong> Orders
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5DCCF] hover:bg-[#F2EBE1] text-[#B2543C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white border border-[#E5DCCF] hover:bg-[#F2EBE1] text-[#1F1813] transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-white border-b border-[#E5DCCF] flex items-center gap-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-[#8B5A2B] text-[#8B5A2B]'
                : 'border-transparent text-[#6B5E52] hover:text-[#1F1813]'
            }`}
          >
            <Heart className={`w-4 h-4 ${savedVehicles.length > 0 ? 'fill-[#8B5A2B] text-[#8B5A2B]' : ''}`} />
            <span>Bookmarked Vehicles ({savedVehicles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'border-[#8B5A2B] text-[#8B5A2B]'
                : 'border-transparent text-[#6B5E52] hover:text-[#1F1813]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#8B5A2B]" />
            <span>Test Drive Appointments ({appointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'border-[#8B5A2B] text-[#8B5A2B]'
                : 'border-transparent text-[#6B5E52] hover:text-[#1F1813]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Viewing Reservations ({reservations.length})</span>
          </button>

          {user.role === 'admin' && (

            <button
              type="button"
              onClick={() => setActiveTab('my-vehicles')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'my-vehicles'
                  ? 'border-[#8B5A2B] text-[#8B5A2B]'
                  : 'border-transparent text-[#6B5E52] hover:text-[#1F1813]'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Dealer Inventory ({myAddedVehicles.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          
          {/* TAB 1: BOOKMARKED VEHICLES DASHBOARD */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              
              {/* Dashboard Summary Metrics Bar */}
              {savedVehicles.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] flex flex-wrap items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-mono text-[#6B5E52] uppercase font-bold block">Saved Models</span>
                      <span className="text-lg font-black text-[#8B5A2B] font-display">{savedVehicles.length} Vehicles</span>
                    </div>
                    <div className="h-8 w-px bg-[#E5DCCF]" />
                    <div>
                      <span className="text-[10px] font-mono text-[#6B5E52] uppercase font-bold block">Estimated Value</span>
                      <span className="text-lg font-black text-[#1F1813] font-display">
                        {formatINRLakhCrore(savedVehicles.reduce((acc, curr) => acc + (curr.price || 0), 0))}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      savedVehicles.forEach(v => onToggleSave(v.id));
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Clear All Bookmarks</span>
                  </button>
                </div>
              )}

              {/* Grid or Empty State */}
              {savedVehicles.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#F8F4EC] rounded-2xl border border-[#E5DCCF] p-8">
                  <Heart className="w-10 h-10 text-[#8B5A2B] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-[#1F1813] font-display">No Bookmarked Vehicles Yet</h3>
                  <p className="text-xs text-[#6B5E52] max-w-sm mx-auto leading-relaxed">
                    Browse our luxury inventory and click the heart bookmark icon on any vehicle card to save models to your profile dashboard.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="relative group flex flex-col">
                      <VehicleCard
                        vehicle={vehicle}
                        onPurchase={onPurchase}
                        onOpenDetails={onOpenDetails}
                        isSaved={true}
                        onToggleSave={onToggleSave}
                      />
                      
                      {/* Explicit Quick Remove Button below Card in Dashboard */}
                      <button
                        type="button"
                        onClick={() => onToggleSave(vehicle.id)}
                        className="mt-2 w-full py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Remove Bookmark</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCHEDULED TEST DRIVE APPOINTMENTS (FIRESTORE SYNCED) */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#F8F4EC] rounded-2xl border border-[#E5DCCF] p-8">
                  <Calendar className="w-10 h-10 text-[#8B5A2B] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-[#1F1813] font-display">No Scheduled Test Drive Appointments</h3>
                  <p className="text-xs text-[#6B5E52] max-w-sm mx-auto leading-relaxed">
                    Click "Test Drive" on any vehicle card in the showroom to schedule a date & time. Your appointment will sync to Firestore and appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
                      Synced with Firestore Database (`appointments` collection)
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {appointments.length} Total
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] shadow-xs flex flex-col justify-between space-y-3 hover:border-[#8B5A2B] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {apt.vehicleImage ? (
                            <img
                              src={apt.vehicleImage}
                              alt={apt.vehicleModel}
                              className="w-16 h-12 object-cover rounded-xl bg-white border border-[#E5DCCF] shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#8B5A2B] text-white flex items-center justify-center shrink-0">
                              <Car className="w-6 h-6" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-sm font-bold text-[#1F1813] font-display truncate">
                                {apt.vehicleYear} {apt.vehicleMake} {apt.vehicleModel}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {apt.status || 'Confirmed'}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-[#8B5A2B] font-display mt-0.5">
                              {formatINRLakhCrore(apt.vehiclePrice)}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-[#E5DCCF] text-xs space-y-1.5 text-[#1F1813]">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{apt.appointmentDate} at {apt.appointmentTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#6B5E52]">
                            <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
                            <span className="truncate">{apt.location}</span>
                          </div>
                          {apt.userName && (
                            <div className="text-[10px] font-mono text-[#6B5E52] border-t border-[#F2EBE1] pt-1">
                              Guest: {apt.userName} ({apt.userPhone})
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono text-[#6B5E52]">
                            ID: {apt.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                            <span>Cancel Drive</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#F8F4EC] rounded-2xl border border-[#E5DCCF] p-8">
                  <ShoppingBag className="w-10 h-10 text-[#8B5A2B] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-[#1F1813] font-display">No Vehicle Reservations Found</h3>
                  <p className="text-xs text-[#6B5E52] max-w-sm mx-auto leading-relaxed">
                    When you reserve a vehicle from our showroom, your allocation details and reservation status (Pending/Confirmed) will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      Official Supercar Reservations & Order Allocations
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded-full">
                      {reservations.length} Active
                    </span>
                  </div>

                  {reservations.map((res, idx) => {
                    const status = res.status || (idx % 2 === 0 ? 'Confirmed' : 'Pending Verification');
                    const isConfirmedStatus = status.toLowerCase().includes('confirm');
                    
                    return (
                      <div
                        key={res.id || idx}
                        className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] hover:border-[#8B5A2B] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#8B5A2B] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                            <Car className="w-6 h-6" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-[#1F1813] font-display">
                                {res.vehicleName || res.vehicleModel || 'Supercar Reserved'}
                              </h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold flex items-center gap-1 uppercase border ${
                                isConfirmedStatus
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                {status}
                              </span>
                            </div>

                            <p className="text-xs text-[#6B5E52] font-mono mt-0.5">
                              Reservation ID: <span className="font-bold text-[#1F1813]">{res.id || `RES-${idx + 8801}`}</span> • Allocated to: <span className="text-[#1F1813] font-bold">{res.customerName || displayName}</span>
                            </p>
                            
                            {res.timestamp && (
                              <p className="text-[10px] text-[#6B5E52] font-mono mt-0.5">
                                Date: {new Date(res.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t sm:border-t-0 border-[#E5DCCF] pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <div>
                            <span className="text-[10px] font-mono text-[#6B5E52] uppercase block font-bold">Vehicle Value</span>
                            <span className="text-base font-bold font-display text-[#8B5A2B]">
                              {formatINRLakhCrore(res.price || 15000000)}
                            </span>
                          </div>
                          
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                            VIP Concierge Assigned
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEALER INVENTORY (ADMIN) */}
          {activeTab === 'my-vehicles' && user.role === 'admin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F1813]">Manage Catalog Inventory</h3>
                {onOpenAddVehicle && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddVehicle();
                    }}
                    className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Vehicle</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAddedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onPurchase={onPurchase}
                    onOpenDetails={onOpenDetails}
                    isSaved={savedIds.includes(vehicle.id)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-[#F8F4EC] border-t border-[#E5DCCF] flex items-center justify-between text-xs text-[#6B5E52]">
          <span className="hidden sm:inline">CariusX Supercar Gallery Member Profile</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 rounded-xl bg-[#FBEAE5] border border-[#F2C9BE] text-[#B2543C] font-bold hover:bg-[#F5D8D0] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white border border-[#E5DCCF] text-[#1F1813] font-bold hover:bg-[#F2EBE1] cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>

      </div>

      {/* Logout Confirmation Dialog Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout();
          onClose();
        }}
        userEmail={user.email}
        userName={displayName}
      />
    </div>
  );
};

export default UserProfileModal;
