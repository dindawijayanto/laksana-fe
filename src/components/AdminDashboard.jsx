import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token_admin');

  // State untuk Filter internal admin
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  const fetchLaporanAdmin = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });
      const dataLaporan = response.data.data || response.data;
      setReports(Array.isArray(dataLaporan) ? dataLaporan : []);
    } catch (error) {
      console.error("Admin gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchLaporanAdmin();
    }
  }, [token]);

  // 🌟 FUNGSI UPDATE STATUS LAPORAN (Langsung nembak updateStatus di Laravel)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/reports/${id}/status`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }
      );
      alert(`Status laporan #LP-${id} berhasil diperbarui menjadi ${newStatus}!`);
      fetchLaporanAdmin(); // Refresh data biar angka statistik ikut update
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal memperbarui status laporan. Periksa hak akses Anda.");
    }
  };

  // --- LOGIKA HITUNG STATISTIK UTAMA ADMIN ---
  const countStatus = (statusName) => reports.filter(r => r.status?.toLowerCase() === statusName.toLowerCase()).length;
  const countSeverity = (level) => reports.filter(r => parseInt(r.tingkat_keparahan || r.severity_level) === level).length;

  // --- LOGIKA FILTERING DATA ---
  const filteredReports = reports.filter(report => {
    const matchSearch = 
      (report.title && report.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.lokasi && report.lokasi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.id && report.id.toString().includes(searchQuery));

    const matchStatus = filterStatus === '' || report.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchSeverity = filterSeverity === '' || parseInt(report.tingkat_keparahan || report.severity_level) === parseInt(filterSeverity);

    return matchSearch && matchStatus && matchSeverity;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-700">
      
      {/* SIDEBAR ADMIN */}
      <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0 text-slate-400">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black">A</div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">LAKSANA CMS</h2>
            <p className="text-[10px] text-amber-500 font-bold uppercase">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-xs font-bold">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-slate-800 rounded-xl"><i className="fa-solid fa-chart-pie text-sm text-amber-500"></i> Dashboard Utama</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors"><i className="fa-solid fa-folder-open text-sm"></i> Manajemen Laporan</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors"><i className="fa-solid fa-users text-sm"></i> Data Pengguna</button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { localStorage.removeItem('token_admin'); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-colors">
            <i className="fa-solid fa-right-from-bracket"></i> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800">Pusat Kendali Laporan</h1>
            <p className="text-xs font-medium text-slate-400">Kelola dan proses pengaduan infrastruktur warga</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Server Active</span>
          </div>
        </header>

        {/* CONTAINER UTAMA */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* METRICS STATS CARDS */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Belum Diproses', value: countStatus('pending') + countStatus('Baru'), color: 'border-l-cyan-500 text-cyan-600', icon: 'fa-clock' },
              { label: 'Sedang Dikerjakan', value: countStatus('proses'), color: 'border-l-amber-500 text-amber-600', icon: 'fa-screwdriver-wrench' },
              { label: 'Selesai Diperbaiki', value: countStatus('selesai'), color: 'border-l-emerald-500 text-emerald-600', icon: 'fa-circle-check' },
              { label: 'Kondisi Darurat (Lv 4/5)', value: countSeverity(4) + countSeverity(5), color: 'border-l-red-500 text-red-600', icon: 'fa-triangle-exclamation' },
            ].map((card, i) => (
              <div key={i} className={`bg-white p-5 rounded-2xl border border-slate-100 border-l-4 shadow-3xs flex items-center justify-between ${card.color}`}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{card.value}</p>
                </div>
                <div className="text-xl opacity-40"><i className={`fa-solid ${card.icon}`}></i></div>
              </div>
            ))}
          </div>

          {/* FILTER TOOLBAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-4">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
              <input 
                type="text" 
                placeholder="Cari ID atau lokasi..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-medium outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Baru</option>
              <option value="proses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>

            <select 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 outline-none"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="">Semua Tingkat</option>
              <option value="1">Lv 1 - Minimal</option>
              <option value="2">Lv 2 - Ringan</option>
              <option value="3">Lv 3 - Sedang</option>
              <option value="4">Lv 4 - Berat</option>
              <option value="5">Lv 5 - Kritis</option>
            </select>
          </div>

          {/* TABLE MANAJEMEN DATA */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6 w-24">ID</th>
                  <th className="py-4 px-4">Detail Kerusakan</th>
                  <th className="py-4 px-4 w-44">Lokasi Kejadian</th>
                  <th className="py-4 px-4 w-32">Keparahan</th>
                  <th className="py-4 px-4 w-40">Aksi Proses Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-bold">Memuat data database...</td></tr>
                ) : filteredReports.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-bold">Tidak ada antrean laporan.</td></tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 text-slate-400 font-bold">LP-0{report.id}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800">{report.title || 'Laporan Infrastruktur'}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{report.deskripsi}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-500 truncate max-w-[170px]">{report.lokasi}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          🔥 Lv {report.tingkat_keparahan || '3'}
                        </span>
                      </td>
                      
                      {/* ACTION DROPDOWN UPDATE STATUS */}
                      <td className="py-4 px-4">
                        <select
                          value={report.status || 'pending'}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className={`px-2.5 py-1.5 border rounded-lg font-bold text-[11px] outline-none transition-all cursor-pointer ${
                            report.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            report.status === 'proses' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            report.status === 'ditolak' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-cyan-50 text-cyan-700 border-cyan-200'
                          }`}
                        >
                          <option value="pending" className="bg-white text-cyan-700">🆕 Baru</option>
                          <option value="proses" className="bg-white text-amber-700">🛠️ Diproses</option>
                          <option value="selesai" className="bg-white text-emerald-700">✅ Selesai</option>
                          <option value="ditolak" className="bg-white text-rose-700">❌ Ditolak</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}