import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const APPOINTMENTS_STORAGE_KEY = 'cariusx_appointments_v1';

// Firebase optional configuration setup
const firebaseConfig = {
  apiKey: "AIzaSyDummyApiKeyForClientSideSetup12345",
  authDomain: "cariusx-app.firebaseapp.com",
  projectId: "cariusx-app",
  storageBucket: "cariusx-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let db = null;
try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase Firestore initialized in client fallback mode:', e);
}

export const appointmentService = {
  scheduleTestDrive: async (appointmentData) => {
    const appointment = {
      id: `apt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vehicleId: appointmentData.vehicleId,
      vehicleMake: appointmentData.vehicleMake,
      vehicleModel: appointmentData.vehicleModel,
      vehicleYear: appointmentData.vehicleYear,
      vehiclePrice: appointmentData.vehiclePrice,
      vehicleImage: appointmentData.vehicleImage,
      userName: appointmentData.userName,
      userEmail: appointmentData.userEmail || 'guest@cariusx.com',
      userPhone: appointmentData.userPhone,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      location: appointmentData.location || 'CariusX Main Gallery Showroom',
      notes: appointmentData.notes || '',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firestore "appointments" collection
    if (db) {
      try {
        await addDoc(collection(db, 'appointments'), appointment);
        console.log('Test Drive appointment persisted to Firestore "appointments" collection.');
      } catch (err) {
        console.warn('Firestore write note (persisting in client storage):', err.message);
      }
    }

    // 2. Always save locally so appointments show instantly in User Profile
    try {
      const existing = appointmentService.getAppointments();
      existing.unshift(appointment);
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to write appointment to local storage', e);
    }

    return appointment;
  },

  getAppointments: (userEmail) => {
    try {
      const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (userEmail) {
        return list.filter(a => !a.userEmail || a.userEmail.toLowerCase() === userEmail.toLowerCase() || userEmail === 'admin@autolotgallery.com');
      }
      return list;
    } catch (e) {
      return [];
    }
  },

  cancelAppointment: (id) => {
    try {
      const existing = appointmentService.getAppointments();
      const updated = existing.filter(a => a.id !== id);
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to cancel appointment', e);
      return [];
    }
  }
};
