import React from 'react';

export default function ModalEditProfile({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-[99999] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl text-center">
        <h2 className="text-lg font-black text-slate-800 mb-2">Edit Profil</h2>
        <p className="text-xs text-slate-500 mb-6">Fitur ini sedang dalam perbaikan arsitektur token.</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-teal-600 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-teal-700 transition-all shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}