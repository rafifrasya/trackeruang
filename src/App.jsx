import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Navbar from './components/layout/Navbar';
import { useLocalStorage } from './hooks/useLocalStorage';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [pin, setPin] = useLocalStorage('pin', null);
  const [inputPin, setInputPin] = useState('');

  const handleKeypad = (angka) => {
    if (inputPin.length < 4) {
      setInputPin(inputPin + angka);
    }
  };

  const hapusSatu = () => {
    setInputPin(inputPin.slice(0, -1));
  };

  if (pin === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {/* 🔥 TOASTER AKTIF DI HALAMAN INI JUGA */}
        <Toaster position="top-right" />

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
          <h1 className="text-xl font-bold mb-2">Buat PIN Keamanan</h1>

          <p className="text-gray-500 text-sm mb-4">Silakan buat PIN 4 digit</p>

          <div className="text-xl text-center tracking-[1em] font-bold mb-8 text-emerald-800">
            {inputPin
              .padEnd(4, '-')
              .replace(/./g, (c) => (c === '-' ? '-' : '•'))}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypad(num.toString())}
                className="bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handleKeypad('0')}
              className="bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95"
            >
              0
            </button>
            <button
              onClick={hapusSatu}
              className="bg-red-100 text-red-500 text-xl font-bold rounded-full py-4 shadow-sm hover:bg-red-200 transition active:scale-95"
            >
              DELETE
            </button>
          </div>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
            onClick={() => {
              if (inputPin.length === 4) {
                setPin(inputPin);
              } else {
                // ❌ ganti alert jadi toast nanti
                toast('PIN harus 4 digit');
              }
            }}
          >
            SIMPAN PIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-100 bg-gray-50 min-h-screen relative shadow-2xl border-red-500 border-1">
        <Router>
          {/* 🔥 TOASTER GLOBAL (semua halaman bisa pakai) */}
          <Toaster position="top-right" />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>

          <Navbar />
        </Router>
      </div>
    </div>
  );
}

export default App;
