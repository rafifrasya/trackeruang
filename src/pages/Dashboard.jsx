import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import Modals from '../components/layout/Modals';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*');

      if (error) throw error;

      setData(records || []);
    } catch (error) {
      toast.error('Gagal mengambil data!');
      console.log(error);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      await fetchData();

      setTimeout(() => {
        setIsPageLoading(false);
      }, 150);
    };

    loadPage();
  }, []);

  const totalPemasukan = data
    .filter((item) => item.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = data
    .filter((item) => item.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  let persenPengeluaran = 0;

  if (totalPemasukan > 0) {
    persenPengeluaran = (totalPengeluaran / totalPemasukan) * 100;
  }

  if (persenPengeluaran > 100) {
    persenPengeluaran = 100;
  }

  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="text-gray-600 font-medium">Memuat data keuangan...</p>
        <p className="text-sm text-gray-400 mt-1">Tunggu sebentar ya 👀</p>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">
        Halo, Meks! 👋
      </h1>

      {/* Saldo */}
      <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg mb-6 relative">
        <p className="text-emerald-100 text-sm font-medium">Sisa Saldo</p>
        <h2 className="text-4xl font-black mt-1">{formatRupiah(saldo)}</h2>
        <div className="absolute -right-4 bottom-0 opacity-40 text-8xl">💸</div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="font-bold text-gray-800">Rasio Pengeluaran</h3>
            <p className="text-xs text-gray-400 mt-1">
              {persenPengeluaran >= 80
                ? 'Awas, kamu boros'
                : 'Keuanganmu cukup sehat'}
            </p>
          </div>
          <p
            className={`text-xl font-black ${persenPengeluaran >= 80 ? 'text-red-500' : 'text-yellow-500'}`}
          >
            {persenPengeluaran.toFixed(1)}%
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${persenPengeluaran >= 80 ? 'bg-red-500' : 'bg-yellow-400'}`}
            style={{ width: `${persenPengeluaran}%` }}
          ></div>
        </div>
      </div>

      {/* Statistik */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
          <p className="text-xs text-gray-500">Uang Masuk</p>
          <p className="text-lg font-bold text-green-600">
            {formatRupiah(totalPemasukan)}
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
          <p className="text-xs text-gray-500">Uang Keluar</p>
          <p className="text-lg font-bold text-red-500">
            {formatRupiah(totalPengeluaran)}
          </p>
        </div>
      </div>

      {/* Tombol */}
      <button
        className="w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-slate-700 transition active:scale-95"
        onClick={() => setIsModalOpen(true)}
      >
        + Catat Transaksi
      </button>

      {/* Modal */}
      <Modals
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Dashboard;
