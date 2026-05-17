import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
        password_confirmation: password  
      }, {
        headers: { 'Accept': 'application/json' }
      });

      setSuccess('Pendaftaran berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Gagal mendaftar. Periksa kembali data Anda.');
      } else {
        setError('Tidak dapat terhubung ke server Backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans w-full">
      <div className="hidden md:block md:w-1/2 bg-gray-200 relative">
        <img 
          src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000" 
          alt="Tata Ruang" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-xl font-bold text-red-800 tracking-tight">Laksana.</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Buat Akun Baru</h2>
            <p className="text-sm text-gray-500 mt-1">Silahkan isi data untuk mendaftar ke sistem.</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-xs font-medium border border-green-100">{success}</div>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 bg-white text-sm"
                placeholder="Contoh: Micheline Keiza"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 bg-white text-sm"
                placeholder="Contoh: keizandrea@student.ub.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 bg-white text-sm"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl transition-all disabled:bg-gray-400 text-sm shadow-md"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2">
            Sudah punya akun? <Link to="/login" className="font-bold text-red-800 hover:underline">Masuk</Link>
          </div>
        </div>
      </div>
    </div>
  );
}