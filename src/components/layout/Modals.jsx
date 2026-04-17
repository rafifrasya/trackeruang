import { useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Modals = ({ isOpen, onClose, fetchData, editData }) => {
  const [formData, setFormData] = useState({
    jenis: 'Pengeluaran',
    nominal: '',
    kategori: '',
    catatan: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading('Menyimpan data...');

    const cekNominal = parseInt(formData.nominal);

    if (!cekNominal || cekNominal <= 0) {
      Swal.fire({
        title: 'Tunggu Dulu',
        text: 'Nominal uang tidak boleh kosong, 0, atau minus',
        icon: 'warning',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    try {
      let error;

      if (editData) {
        const res = await supabase
          .from('jurnal_saku')
          .update({
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          })
          .eq('id', editData.id);

        error = res.error;
      } else {
        const res = await supabase.from('jurnal_saku').insert([
          {
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          },
        ]);

        error = res.error;
      }

      if (error) throw error;

      toast.dismiss(loadingToast);

      Swal.fire({
        title: 'Berhasil!',
        text: editData
          ? 'Data berhasil diubah!'
          : 'Data baru berhasil dicatat!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData();
      onClose();

      setFormData({
        jenis: 'Pengeluaran',
        nominal: '',
        kategori: '',
        catatan: '',
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menyimpan data!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold mb-4">
          {editData ? 'Edit Data' : 'Catat Baru'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-4 ${isLoading ? 'opacity-70' : ''}`}
        >
          <select
            name="jenis"
            value={formData.jenis}
            onChange={handleChange}
            disabled={isLoading}
            className="border p-2 rounded"
          >
            <option value="Pengeluaran">🔴 Pengeluaran</option>
            <option value="Pemasukan">🟢 Pemasukan</option>
          </select>

          <input
            type="number"
            name="nominal"
            required
            value={formData.nominal}
            onChange={handleChange}
            disabled={isLoading}
            className="border p-2 rounded"
            placeholder="Nominal"
          />

          <input
            type="text"
            name="kategori"
            required
            value={formData.kategori}
            onChange={handleChange}
            disabled={isLoading}
            className="border p-2 rounded"
            placeholder="Kategori"
          />

          <input
            type="text"
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            disabled={isLoading}
            className="border p-2 rounded"
            placeholder="Catatan"
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 py-2 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 text-white py-2 rounded flex justify-center items-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modals;
