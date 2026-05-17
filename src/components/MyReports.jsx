import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function MyReports() {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token_admin');

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/my-reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const resData = response.data.data || response.data;
      setMyReports(Array.isArray(resData) ? resData : []);
    } catch (error) {
      console.error("Gagal mengambil laporan pribadi:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchMyReports();
    }
  }, [token]);

  // Helper styling untuk status badge
  const getStatusBadge = (status) => {
    const st = status?.toLowerCase();
    if (st === 'pending' || st === 'baru') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-700 border border-cyan-100">🆕 Baru</span>;
    }
    if (st === 'proses') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-100">🛠️ Diproses</span>;
    }
    if (st === 'selesai') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">✅ Selesai</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-50 text-slate-600 border border-slate-200">❌ Ditolak</span>;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-700 overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 space-y-8 flex-shrink-0">
        <div onClick={() => navigate('/dashboard')} className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md text-xl font-bold cursor-pointer">L</div>
        <nav className="flex flex-col space-y-6 text-slate-300">
          <button onClick={() => navigate('/dashboard')} className="hover:text-teal-600 p-2 transition-colors"><i className="fa-solid fa-house text-lg"></i></button>
          <button className="text-teal-600 p-2 rounded-xl bg-teal-50/50"><i className="fa-solid fa-clipboard-list text-lg"></i></button>
          <button className="hover:text-teal-600 p-2 transition-colors"><i className="fa-solid fa-gear text-lg"></i></button>
        </nav>
        <button onClick={() => { localStorage.removeItem('token_admin'); navigate('/login'); }} className="mt-auto text-slate-300 hover:text-red-500 p-2 transition-colors"><i className="fa-solid fa-right-from-bracket text-lg"></i></button>
      </aside>

      {/* MAIN PLACEMENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800">Laporan Anda</h1>
            <p className="text-xs font-medium text-slate-400">Riwayat pengaduan infrastruktur yang telah kamu kirimkan</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
          >
            ← Kembali ke Peta
          </button>
        </header>

        {/* CONTAINER DATA CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="text-center py-20 font-bold text-slate-400 text-sm">Menyelaraskan riwayat laporan...</div>
          ) : myReports.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center max-w-2xl mx-auto mt-10 shadow-3xs">
              <span className="text-4xl">📭</span>
              <h3 className="text-base font-black text-slate-800 mt-4">Belum ada laporan</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Kamu belum pernah mengirimkan laporan pengaduan kerusakan infrastruktur di aplikasi Laksana.</p>
              <button onClick={() => navigate('/dashboard')} className="mt-6 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-700 shadow-md transition-all">Buat Laporan Pertama</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {myReports.map((report) => (
                <div key={report.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                  <div className="space-y-3">
                    {/* TOP BADGES */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">LP-2026-0{report.id}</span>
                      {getStatusBadge(report.status)}
                    </div>

                    {/* CONTENT BODY */}
                    <div>
                      <h3 className="text-sm font-black text-slate-800 line-clamp-1">{report.title || 'Laporan Infrastruktur'}</h3>
                      <p className="text-[11px] font-bold text-teal-600 mt-0.5">🛣️ {report.category?.name || 'Fasilitas Umum'}</p>
                      <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">{report.deskripsi}</p>
                    </div>
                  </div>

                  {/* FOOTER CARD */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-1.5 text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>📍</span> <span className="truncate font-medium text-slate-500">{report.lokasi}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px]">
                      <span>📅 {report.incident_date || '16 Mei 2026'}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold">Lv {report.tingkat_keparahan || '3'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}