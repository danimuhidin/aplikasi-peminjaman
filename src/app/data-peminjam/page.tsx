// app/data-peminjam/page.tsx
import Link from 'next/link';

export default function DataPeminjamPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 font-sans p-4">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Halaman Data Peminjam</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Ini adalah halaman untuk mengelola data semua peminjam yang terdaftar.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/peminjaman" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-center">
          Kembali ke Peminjaman
        </Link>
        <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-center">
          Logout
        </Link>
      </div>
    </div>
  );
}