// app/peminjaman/page.tsx
'use client';

import { useState } from 'react';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Untuk tampilan bulan
import timeGridPlugin from '@fullcalendar/timegrid'; // Untuk tampilan minggu/hari
import interactionPlugin from '@fullcalendar/interaction'; // Untuk klik dan drag-n-drop
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import BottomNavbar from '../../components/BottomNavbar';

// Shadcn UI Imports
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Untuk pesan

// Definisi Tipe untuk Event Peminjaman (mirip dengan FullCalendar EventObjectInput)
interface PeminjamanEvent {
  id: string;
  title: string; // Nama peminjam atau barang yang dipinjam
  start: string; // Tanggal mulai (ISO string)
  end?: string; // Tanggal selesai (opsional, ISO string)
  // Anda bisa menambahkan properti lain seperti:
  // userId: string;
  // barangId: string;
  // notes?: string;
}

export default function PeminjamanPage() {
  const [events, setEvents] = useState<PeminjamanEvent[]>([
    { id: '1', title: 'Peminjaman Ipad Air 2 oleh Budi', start: '2025-07-25T10:00:00', end: '2025-07-25T12:00:00' },
    { id: '2', title: 'Peminjaman Galaxy Tab A7 Lite oleh Siti', start: '2025-07-26T14:00:00', end: '2025-07-26T16:00:00' },
    { id: '3', title: 'Peminjaman Iphone 12 oleh Joko', start: '2025-07-27', end: '2025-07-28' }, // Contoh all-day event
    { id: '4', title: 'Peminjaman Galaxy A54 oleh Dewi', start: '2025-07-28T09:00:00', end: '2025-07-28T11:00:00' },
  ]);

  // State untuk Modal Tambah/Edit Event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEventTitle, setCurrentEventTitle] = useState('');
  const [currentEventStart, setCurrentEventStart] = useState('');
  const [currentEventEnd, setCurrentEventEnd] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // null = tambah, string = edit

  // State untuk Alert (misalnya jika input kosong)
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Handler untuk klik slot waktu kosong (menambah event baru)
  const handleDateSelect = (selectInfo: DateSelectArg) => { // <-- UBAH KE DateSelectArg
    console.log('Tanggal dipilih:', selectInfo);
    setCurrentEventTitle('');
    setCurrentEventStart(selectInfo.startStr);
    setCurrentEventEnd(selectInfo.endStr);
    setEditingEventId(null); // Mode tambah
    setIsModalOpen(true);
    setAlertMessage(null); // Clear previous alert
  };

  // Handler untuk klik event yang sudah ada (mengedit event)
  const handleEventClick = (clickInfo: EventClickArg) => { // <-- UBAH JUGA KE EventClickArg
    // console.log('clickInfo:', clickInfo);
    const event = clickInfo.event;
    setCurrentEventTitle(event.title);
    setCurrentEventStart(event.startStr);
    setCurrentEventEnd(event.endStr || ''); // Mungkin tidak ada end date untuk all-day
    setEditingEventId(event.id); // Mode edit
    setIsModalOpen(true);
    setAlertMessage(null); // Clear previous alert
  };

  // Handler untuk menyimpan/menambah event
  const handleSaveEvent = () => {
    if (!currentEventTitle.trim() || !currentEventStart.trim()) {
      setAlertMessage('Judul dan tanggal mulai tidak boleh kosong!');
      return;
    }

    if (editingEventId) {
      // Edit event yang sudah ada
      setEvents(events.map(event =>
        event.id === editingEventId
          ? { ...event, title: currentEventTitle.trim(), start: currentEventStart, end: currentEventEnd }
          : event
      ));
    } else {
      // Tambah event baru
      const newId = String(Date.now()); // ID unik sederhana
      setEvents([...events, { id: newId, title: currentEventTitle.trim(), start: currentEventStart, end: currentEventEnd }]);
    }
    setIsModalOpen(false); // Tutup modal
    setAlertMessage(null); // Clear alert
  };

  // Handler untuk menghapus event dari modal edit (opsional)
  const handleDeleteEventFromModal = () => {
    if (editingEventId) {
      setEvents(events.filter(event => event.id !== editingEventId));
      setIsModalOpen(false); // Tutup modal
      setEditingEventId(null); // Reset
      setAlertMessage(null); // Clear alert
    }
  };

  const handleOpenAddModal = () => {
    // Ketika membuka modal dari tombol tambah, inisialisasi tanggal dengan tanggal saat ini
    const now = new Date();
    const isoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().substring(0, 16);

    setCurrentEventTitle('');
    setCurrentEventStart(isoString); // Atur tanggal mulai ke tanggal dan waktu saat ini
    setCurrentEventEnd('');
    setEditingEventId(null);
    setIsModalOpen(true);
    setAlertMessage(null);
  };

  return (
    <div className="flex flex-col justify-start min-h-screen font-sans pb-20">
      <div className='border-b lg:border-none border-gray-400 mb-6 p-3'>
        <h1 className="text-lg lg:text-2xl text-left lg:text-center font-bold text-white">Data Peminjaman</h1>
      </div>

      {/* Kontainer untuk FullCalendar */}
      <div className="flex item-center justify-center w-full p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 mb-8">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            initialView="dayGridMonth"
            editable={true} // Memungkinkan event bisa di-drag & resize (bisa diimplementasikan)
            selectable={true} // Memungkinkan pengguna memilih rentang waktu
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            initialEvents={events} // Gunakan state events
            select={handleDateSelect} // Ketika memilih rentang waktu kosong
            eventClick={handleEventClick} // Ketika mengklik event yang sudah ada
          // Event handlers lainnya (opsional):
          // eventChange={handleEventChange} // Ketika event di-drag atau di-resize
          // eventAdd={handleEventAdd} // Ketika event baru ditambahkan (setelah drag-n-drop dari eksternal)
          // eventRemove={handleEventRemove} // Ketika event dihapus
          />
        </div>
      </div>

      {/* Modal Tambah/Edit Peminjaman */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingEventId ? 'Edit Peminjaman' : 'Tambah Peminjaman Baru'}</DialogTitle>
            <DialogDescription>
              {editingEventId
                ? 'Ubah detail peminjaman ini.'
                : 'Isi detail untuk peminjaman baru.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {alertMessage && (
              <Alert variant="destructive">
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Peminjam
              </Label>
              <Input
                id="title"
                value={currentEventTitle}
                onChange={(e) => setCurrentEventTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Barang
              </Label>
              <Input
                id="title"
                value={currentEventTitle}
                onChange={(e) => setCurrentEventTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Jumlah
              </Label>
              <Input
                id="title"
                value={currentEventTitle}
                onChange={(e) => setCurrentEventTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Mulai
              </Label>
              <Input
                id="start"
                type="datetime-local" // Menggunakan datetime-local
                value={currentEventStart.substring(0, 16)} // Format untuk datetime-local
                onChange={(e) => setCurrentEventStart(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                Selesai
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={currentEventEnd.substring(0, 16)}
                onChange={(e) => setCurrentEventEnd(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* Anda bisa menambahkan input lain di sini, misal untuk memilih peminjam dan barang */}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            {editingEventId && (
              <Button variant="destructive" onClick={handleDeleteEventFromModal} className="w-full sm:w-auto mb-2 sm:mb-0">
                Hapus Peminjaman
              </Button>
            )}
            <Button onClick={handleSaveEvent} className="w-full sm:w-auto">
              {editingEventId ? 'Simpan Perubahan' : 'Tambah Peminjaman'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        className="fixed bottom-24 right-8 rounded-full h-16 w-16 text-white text-3xl shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105
             md:hidden" // <-- INI YANG PENTING!
        onClick={handleOpenAddModal}
      >
        +
      </Button>

      <BottomNavbar />
    </div>
  );
}