// app/peminjaman/page.tsx
import Link from 'next/link';

// Ini adalah Server Component secara default.
// Jika Anda memerlukan Hooks atau interaktivitas klien lainnya, tambahkan 'use client';
export default function PeminjamanPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 font-sans p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Halaman Peminjaman</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Selamat datang di halaman peminjaman. Di sini Anda dapat mengelola semua transaksi peminjaman barang.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/data-barang" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-center">
          Ke Halaman Data Barang
        </Link>
        <Link href="/data-peminjam" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-center">
          Ke Halaman Data Peminjam
        </Link>
        {/* Tombol Logout akan mengarahkan ke halaman login */}
        <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-center">
          Logout
        </Link>
      </div>
    </div>
  );
}