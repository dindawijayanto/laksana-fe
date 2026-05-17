import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/login', {
        email,
        password
      });

      // Ambil token asli dari backend
      const tokenAsli = response.data.access_token;

      if (tokenAsli) {
        // Simpan token ke localStorage untuk session auth
        localStorage.setItem('token_admin', tokenAsli);
        
        const userData = response.data.user;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('user_id', userData.id);
          
          if (userData.role && userData.role.toLowerCase() === 'admin') {
            navigate('/admin'); 
          } else {
            navigate('/dashboard'); 
          }
        } else {
          navigate('/dashboard');
        }

      } else {
        setError('Token tidak ditemukan dalam respon server.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Email atau password salah.');
      } else {
        setError('Tidak dapat terhubung ke server Backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans w-full">
      {/* SISI KIRI: Foto Visual */}
      <div className="hidden md:block md:w-1/2 bg-gray-200 relative">
        <img 
          src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000" 
          alt="Login Visual" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* SISI KANAN: Form Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-xl font-bold text-red-800 tracking-tight">Laksana.</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Selamat Datang Kembali</h2>
            <p className="text-sm text-gray-500 mt-1">Silahkan masuk menggunakan akun Anda.</p>
          </div>

          {/* Info Akun Demo */}
          

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 bg-white text-sm"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 bg-white text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl transition-all disabled:bg-gray-400 text-sm shadow-md"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2">
            Belum punya akun? <Link to="/register" className="font-bold text-red-800 hover:underline">Daftar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}