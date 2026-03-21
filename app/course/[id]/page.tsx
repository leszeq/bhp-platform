import Link from 'next/link';

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col hidden md:flex">
        <h2 className="font-bold text-lg mb-6 text-gray-800">Spis treści</h2>
        <nav className="space-y-2 flex-1">
          <a href="#" className="block px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium">
            1. Wprowadzenie
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            2. Przepisy ogólne
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            3. Wypadki przy pracy
          </a>
        </nav>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 mt-auto">
          &larr; Wróć do panelu
        </Link>
      </aside>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">1. Wprowadzenie</h1>
          <div className="prose prose-indigo max-w-none text-gray-600">
            <p className="mb-4">
              Witaj w szkoleniu okresowym BHP. W tej sekcji dowiesz się o najważniejszych zasadach bezpiecznej pracy na Twoim stanowisku.
            </p>
            <p className="mb-4">
              Zwróć szczególną uwagę na procedury postępowania w nagłych wypadkach oraz prawidłowe korzystanie ze środków ochrony indywidualnej.
            </p>
            {/* Placeholder Content */}
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 my-8">
              <span className="text-gray-400">Miejsce na wideo szkoleniowe lub slajdy</span>
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
            <button disabled className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed font-medium">
              Poprzednia lekcja
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm">
              Następna lekcja
            </button>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/course/demo-course-id/exam" className="inline-block px-8 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm">
              Przejdź do egzaminu
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
