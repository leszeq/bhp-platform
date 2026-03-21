import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Szkolenia BHP Platform</h1>
        <p className="text-xl text-gray-600">
          Zdobądź certyfikat BHP online. Szybko, wygodnie i bez stresu.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/register" className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm">
            Rozpocznij szkolenie
          </Link>
          <Link href="/login" className="px-8 py-3 rounded-lg bg-white text-gray-900 border border-gray-200 font-medium hover:bg-gray-50 transition shadow-sm">
            Zaloguj się
          </Link>
        </div>
      </div>
    </main>
  );
}
