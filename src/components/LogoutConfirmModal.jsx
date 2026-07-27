import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ShieldAlert, X } from 'lucide-react';

export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, userEmail, userName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white border border-[#E5DCCF] rounded-3xl p-6 shadow-2xl space-y-5 font-sans overflow-hidden"
        >
          {/* Subtle top ambient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B5A2B] via-[#B2543C] to-[#8B5A2B]" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#F8F4EC] text-[#6B5E52] hover:text-[#1F1813] transition-colors cursor-pointer"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon & Title */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-display text-[#1F1813]">
                Confirm Log Out
              </h3>
              <p className="text-xs text-[#6B5E52] font-mono mt-0.5">
                {userEmail || userName || 'Active Member Session'}
              </p>
            </div>
          </div>

          {/* Message */}
          <p className="text-xs text-[#6B5E52] leading-relaxed bg-[#F8F4EC] p-3.5 rounded-2xl border border-[#E5DCCF]">
            Are you sure you want to end your active session? You will need to sign in again to access your saved vehicle allocations, VIP test drive vouchers, and order history.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5DCCF] bg-white hover:bg-[#F2EBE1] text-[#1F1813] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4.5 py-2.5 rounded-xl bg-[#B2543C] hover:bg-[#92412B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Yes, Log Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
