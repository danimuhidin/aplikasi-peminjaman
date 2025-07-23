// app/data-peminjam/page.tsx
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

// Definisi Tipe untuk User
interface User {
  id: string;
  name: string;
}

export default function DataPeminjamPage() {
  // Dummy Data
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Budi Santoso' },
    { id: '2', name: 'Siti Aminah' },
    { id: '3', name: 'Joko Susanto' },
    { id: '4', name: 'Dewi Lestari' },
    { id: '5', name: 'Agus Salim' },
  ]);

  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null); // null = tambah, string = edit

  // State untuk Konfirmasi Hapus
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // --- Handler untuk Tambah/Edit User ---

  const handleOpenAddModal = () => {
    setCurrentUserName('');
    setEditingUserId(null); // Mode tambah
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setCurrentUserName(user.name);
    setEditingUserId(user.id); // Mode edit
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!currentUserName.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }

    if (editingUserId) {
      // Edit user yang sudah ada
      setUsers(users.map(user =>
        user.id === editingUserId ? { ...user, name: currentUserName.trim() } : user
      ));
    } else {
      // Tambah user baru
      const newId = String(Math.max(...users.map(u => parseInt(u.id)), 0) + 1); // ID sederhana
      setUsers([...users, { id: newId, name: currentUserName.trim() }]);
    }
    setIsModalOpen(false); // Tutup modal
  };

  // --- Handler untuk Hapus User ---

  const handleOpenConfirmDelete = (userId: string) => {
    setDeletingUserId(userId);
    setIsConfirmOpen(true);
  };

  const handleDeleteUser = () => {
    if (deletingUserId) {
      setUsers(users.filter(user => user.id !== deletingUserId));
      setDeletingUserId(null); // Reset setelah hapus
    }
    setIsConfirmOpen(false); // Tutup konfirmasi
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen font-sans p-4 pb-20"> {/* pb-20 untuk memberi ruang navbar bawah */}
      <h1 className="text-2xl text-center font-bold text-white mb-2">Halaman Data Peminjam</h1>
      <p className="text-sm text-white mb-8 text-center max-w-xl">
        Ini adalah halaman untuk mengelola data semua peminjam yang terdaftar.
      </p>

      {/* List Data User */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data peminjam.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {/* Nama User (dapat diklik untuk edit) */}
                <span
                  className="flex-grow text-lg font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleOpenEditModal(user)} // Klik nama untuk membuka modal edit
                >
                  {user.name}
                </span>

                {/* Tombol Hapus */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleOpenConfirmDelete(user.id)}
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

      {/* Modal Tambah/Edit User */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUserId ? 'Edit Peminjam' : 'Tambah Peminjam Baru'}</DialogTitle>
            <DialogDescription>
              {editingUserId
                ? 'Ubah nama peminjam di bawah ini.'
                : 'Masukkan nama peminjam baru yang ingin Anda tambahkan.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={currentUserName}
                onChange={(e) => setCurrentUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUser}>
              {editingUserId ? 'Simpan Perubahan' : 'Tambah Peminjam'}
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data peminjam secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavbar />

    </div>
  );
}