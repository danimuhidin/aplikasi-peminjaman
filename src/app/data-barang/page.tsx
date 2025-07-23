// app/data-barang/page.tsx
'use client'; // Penting: Ini adalah Client Component karena menggunakan Hooks dan interaktivitas

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNavbar from '../../components/BottomNavbar';

// Definisi Tipe untuk Barang
interface Barang {
  id: string;
  name: string;
}

export default function DataBarangPage() {
  // Dummy Data Barang
  const [barangList, setBarangList] = useState<Barang[]>([
    { id: '1', name: 'Ipad Air 1' },
    { id: '2', name: 'Ipad Air 2' },
    { id: '3', name: 'Ipad Air 4' },
    { id: '4', name: 'Ipad Pro 11' },
    { id: '5', name: 'Ipad Pro 12' },
    { id: '6', name: 'Iphone 12' },
    { id: '7', name: 'Galaxy Tab A6' },
    { id: '8', name: 'Galaxy Tab A7 Lite' },
    { id: '9', name: 'Galaxy Tab A9 Lite' },
    { id: '10', name: 'Galaxy Tab A9+' },
    { id: '11', name: 'Galaxy A53' },
    { id: '12', name: 'Galaxy A54' },
    { id: '13', name: 'Galaxy A55' },
  ]);

  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBarangName, setCurrentBarangName] = useState('');
  const [editingBarangId, setEditingBarangId] = useState<string | null>(null); // null = tambah, string = edit

  // State untuk Konfirmasi Hapus
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingBarangId, setDeletingBarangId] = useState<string | null>(null);

  // --- Handler untuk Tambah/Edit Barang ---

  const handleOpenAddModal = () => {
    setCurrentBarangName('');
    setEditingBarangId(null); // Mode tambah
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (barang: Barang) => {
    setCurrentBarangName(barang.name);
    setEditingBarangId(barang.id); // Mode edit
    setIsModalOpen(true);
  };

  const handleSaveBarang = () => {
    if (!currentBarangName.trim()) {
      alert('Nama barang tidak boleh kosong!');
      return;
    }

    if (editingBarangId) {
      // Edit barang yang sudah ada
      setBarangList(barangList.map(barang =>
        barang.id === editingBarangId ? { ...barang, name: currentBarangName.trim() } : barang
      ));
    } else {
      // Tambah barang baru
      const newId = String(Math.max(...barangList.map(b => parseInt(b.id)), 0) + 1); // ID sederhana
      setBarangList([...barangList, { id: newId, name: currentBarangName.trim() }]);
    }
    setIsModalOpen(false); // Tutup modal
  };

  // --- Handler untuk Hapus Barang ---

  const handleOpenConfirmDelete = (barangId: string) => {
    setDeletingBarangId(barangId);
    setIsConfirmOpen(true);
  };

  const handleDeleteBarang = () => {
    if (deletingBarangId) {
      setBarangList(barangList.filter(barang => barang.id !== deletingBarangId));
      setDeletingBarangId(null); // Reset setelah hapus
    }
    setIsConfirmOpen(false); // Tutup konfirmasi
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen font-sans p-4 pb-20"> {/* pb-20 untuk memberi ruang navbar bawah */}
      <h1 className="text-2xl text-center font-bold text-white mb-2">Halaman Data Barang</h1>
      <p className="text-sm text-white mb-8 text-center max-w-xl">
        Ini adalah halaman untuk mengelola inventaris dan informasi detail barang.
      </p>

      {/* List Data Barang */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {barangList.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data barang.</p>
        ) : (
          <ul className="space-y-4">
            {barangList.map((barang) => (
              <li
                key={barang.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {/* Nama Barang (dapat diklik untuk edit) */}
                <span
                  className="flex-grow text-lg font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleOpenEditModal(barang)} // Klik nama untuk membuka modal edit
                >
                  {barang.name}
                </span>

                {/* Tombol Hapus */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleOpenConfirmDelete(barang.id)}
                  className="ml-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span className="sr-only">Hapus</span> {/* Screen reader only text */}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button Tambah di Kanan Bawah */}
      <Button
        className="fixed bottom-24 right-8 rounded-full h-16 w-16 text-white text-3xl shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        onClick={handleOpenAddModal}
      >
        +
      </Button>

      {/* Modal Tambah/Edit Barang */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBarangId ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
            <DialogDescription>
              {editingBarangId
                ? 'Ubah nama barang di bawah ini.'
                : 'Masukkan nama barang baru yang ingin Anda tambahkan.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={currentBarangName}
                onChange={(e) => setCurrentBarangName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveBarang}>
              {editingBarangId ? 'Simpan Perubahan' : 'Tambah Barang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data barang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBarang} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavbar />
    </div>
  );
}