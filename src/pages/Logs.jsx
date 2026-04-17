import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Swal from 'sweetalert2';
import Modals from '../components/layout/Modals.jsx';

const Logs = () => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*')
        .order('created_at', { ascending: false });

      if (records) {
        setData(records);
      }
    } catch (error) {
      console.log('Error Nyet', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Serius?, Dihapus nih?',
      text: 'Datanya gabisa balik loh kalo dihapus',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#79AE6F',
      cancelButtonColor: '#DB1A1A',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await supabase.from('jurnal_saku').delete().eq('id', id);

        Swal.fire('Terhapus!', 'Catatan berhasil dihapus', 'success');
        fetchData();
      } catch {
        Swal.fire('Error!', 'Gagal menghapus', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">
        Riwayat Jajan
      </h1>

      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center"
          >
            <div>
              <p>{item.catatan}</p>
              <span>{item.kategori}</span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`${item.jenis === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}
              >
                {item.jenis === 'Pemasukan' ? '+' : '-'}
                {formatRupiah(item.nominal)}
              </span>

              <div className="flex gap-3 text-gray-400">
                <button
                  onClick={() => handleEdit(item)}
                  className="hover:text-blue-500"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 mb-4 text-gray-400">
            <div className="text-6xl mb-4">⚡️</div>
            <p className="font-medium text-lg">Belum ada riwayat catatan</p>
            <p className="text-sm">Mulai catat keuanganmu!</p>
          </div>
        )}
      </div>

      <Modals
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false); 
          setEditData(null); 
        }}
        fetchData={fetchData}
        editData={editData} 
      />

    </div>
  );
};

export default Logs;
