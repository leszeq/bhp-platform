import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      {/* Navbar MVP */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center bg-white">
        <div className="font-black text-2xl tracking-tighter text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-sm transform rotate-12"></div>
          BHP PLATFORM
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-black transition">Zaloguj się</Link>
          <Link href="/register" className="text-sm font-bold bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-sm hover:shadow-md">Wypróbuj</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <span className="inline-block bg-green-100 text-green-700 font-bold uppercase tracking-widest text-xs mb-6 px-3 py-1 rounded-full border border-green-200">
            Dla Firm i Przedsiębiorstw
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Szkolenia BHP online dla firm.<br/>
            <span className="text-gray-400 font-bold">Bez papierologii.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-medium">
            Zamiast tracić czas na nudne prezentacje stacjonarne, zautomatyzuj proces. Twój pracownik przechodzi szkolenie w 30 minut, a ty masz spokój i certyfikat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/register" className="bg-indigo-600 text-white text-center px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 hover:-translate-y-1">
              Wypróbuj za darmo
            </Link>
            <Link href="#jak-dziala" className="bg-white border-2 border-gray-200 text-gray-800 text-center px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition hover:-translate-y-1 hover:border-gray-300 shadow-sm hover:shadow-md">
              Jak to działa?
            </Link>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl shadow-sm z-10 relative">
                   {['👨‍💻', '👩‍💼', '👷‍♂️', '👩‍⚕️'][i-1]}
                 </div>
               ))}
               <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-sm z-10 relative">
                 +500
               </div>
             </div>
             <p className="text-sm font-semibold text-gray-500 ml-2">Zaufało nam ponad <strong className="text-gray-900">500+</strong> pracowników.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-50 transform rotate-3 rounded-3xl -z-10 blur-xl opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-50 transform rotate-3 rounded-3xl -z-10"></div>
          <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-2xl shadow-indigo-900/5 z-20 relative text-left">
             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">Certyfikat Ukończenia</h3>
                  <p className="text-sm text-gray-500 font-medium">Zgodny z wymogami (Dz.U.)</p>
                </div>
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-green-100">
                  🛡️
                </div>
             </div>
             
             <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Kursant</span>
                  <span className="font-bold text-gray-900 text-lg">Marek Nowak</span>
                </div>
                <div className="flex gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Wynik Egzaminu</span>
                    <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md inline-block mt-0.5">Zaliczony (95%)</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Kod Dok.</span>
                    <span className="font-mono text-gray-900 text-sm font-bold block mt-1">#A72-B9X</span>
                  </div>
                </div>
             </div>

             <div className="mt-8 bg-black text-white p-4 rounded-xl text-center font-bold shadow-md hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
               Pobierz dokument PDF
             </div>
          </div>
        </div>
      </div>

      {/* Problem v Solution Section */}
      <section className="bg-gray-50 py-32 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-black text-red-500 tracking-widest uppercase mb-3">Powszechny Problem</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight tracking-tight">Klasyczne szkolenia BHP to koszmar dla firmy</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-red-50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">❌</div>
                <div className="pt-1"><span className="text-gray-800 font-semibold text-lg leading-snug">Tracisz czas na umawianie instruktorów i przerywanie pracy biura.</span></div>
              </li>
              <li className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-red-50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">❌</div>
                <div className="pt-1"><span className="text-gray-800 font-semibold text-lg leading-snug">Gubisz papierowe zaświadczenia i toniesz w powtarzalnej biurokracji.</span></div>
              </li>
              <li className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-red-50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">❌</div>
                <div className="pt-1"><span className="text-gray-800 font-semibold text-lg leading-snug">Brak łatwej kontroli, komu i kiedy kończy się termin ważności szkolenia.</span></div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-900 text-white p-10 md:p-14 rounded-[2.5rem] relative shadow-2xl border border-gray-800 transform lg:rotate-1">
            <h2 className="text-sm font-black text-green-400 tracking-widest uppercase mb-3">Nasze Rozwiązanie</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight tracking-tight">Automatyczna platforma nowej generacji</h3>
            <ul className="space-y-8">
              <li className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 text-green-400 flex items-center justify-center text-2xl font-black shrink-0 border border-gray-700 shadow-sm">✓</div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-gray-100">Gotowe szkolenie w chmurze</h4>
                  <p className="text-gray-400 font-medium">Pracownik przechodzi materiały na komputerze w dowolnym monecie.</p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 text-green-400 flex items-center justify-center text-2xl font-black shrink-0 border border-gray-700 shadow-sm">✓</div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-gray-100">Elektroniczne certyfikaty</h4>
                  <p className="text-gray-400 font-medium">System automatycznie egzaminuje i wyrzuca ważny prawnie dokument PDF.</p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 text-green-400 flex items-center justify-center text-2xl font-black shrink-0 border border-gray-700 shadow-sm">✓</div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-gray-100">B2B Dashboard dla HR</h4>
                  <p className="text-gray-400 font-medium">Menedżer w panelu na żywo widzi komu brakuje ukończonego modułu.</p>
                </div>
              </li>
            </ul>
            <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white text-sm font-black px-6 py-3 rounded-full -rotate-6 shadow-xl border-4 border-gray-900 tracking-wide">
              Utnij koszty stałe!
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="jak-dziala" className="py-32 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
           <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Jak to działa w praktyce?</h2>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Proces skrócony do absolutnego minimum. Redukujesz biurokrację BHP z całych dni do zaledwie 30 minut działania pracownika.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
           <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gray-100 -z-10 rounded-full"></div>
           
           <div className="text-center group">
             <div className="w-24 h-24 bg-white border-4 border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:border-black group-hover:text-black transition-colors duration-300 relative bg-clip-padding shadow-sm">1</div>
             <h4 className="font-bold text-xl mb-3 text-gray-900">Zapraszasz Zespół</h4>
             <p className="text-gray-500 font-medium">Dodajesz adresy email do panelu lub zapraszasz jednym specjalnym linkiem zbiorczym.</p>
           </div>
           <div className="text-center group">
             <div className="w-24 h-24 bg-white border-4 border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors duration-300 relative bg-clip-padding shadow-sm">2</div>
             <h4 className="font-bold text-xl mb-3 text-gray-900">Szkolenie Online</h4>
             <p className="text-gray-500 font-medium">Pracownik przechodzi przez nowoczesny materiał w interfejsie platformy we własnym tempie.</p>
           </div>
           <div className="text-center group">
             <div className="w-24 h-24 bg-white border-4 border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:border-yellow-500 group-hover:text-yellow-500 transition-colors duration-300 relative bg-clip-padding shadow-sm">3</div>
             <h4 className="font-bold text-xl mb-3 text-gray-900">Zdalny Egzamin</h4>
             <p className="text-gray-500 font-medium">Uczestnik zdaje interaktywny quiz online, by zweryfikować zdobytą wiedzę z zakresu BHP.</p>
           </div>
           <div className="text-center group">
             <div className="w-24 h-24 bg-white border-4 border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:border-green-500 group-hover:text-green-500 transition-colors duration-300 relative bg-clip-padding shadow-sm">4</div>
             <h4 className="font-bold text-xl mb-3 text-gray-900">Gotowy Certyfikat</h4>
             <p className="text-gray-500 font-medium">Po bezbłędnym teście system generuje e-dokument i bezpiecznie zapisuje w panelu B2B.</p>
           </div>
        </div>
      </section>

      {/* Pricing MVP */}
      <section className="bg-gray-900 text-white py-32 mt-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Gotowy na automatyzację?</h2>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium mb-16">Wybierz pakiet pasujący do Twojej organizacji. Zero ukrytych opłat, jednorazowy dostęp.</p>
           
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left relative z-10">
             <div className="bg-gray-800 border border-gray-700 p-10 md:p-12 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-300 relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-700 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition pointer-events-none"></div>
               <h3 className="text-2xl font-bold text-indigo-400 mb-3 tracking-tight">Dla Mikro Firm</h3>
               <div className="text-5xl font-black mb-4 flex items-baseline gap-2">199 zł <span className="text-xl text-gray-500 font-bold whitespace-nowrap">/ netto</span></div>
               <p className="mb-10 text-gray-400 font-medium text-lg leading-relaxed">Pakiet Startowy dla małych przedsiębiorstw chcących wdrożyć narzędzia zwinnego BHP i zapomnieć o teczkach.</p>
               <ul className="space-y-4 font-semibold mb-12 text-gray-300">
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs shrink-0 border border-green-500/20">✔</div> Dostęp dla max 10 pracowników</li>
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs shrink-0 border border-green-500/20">✔</div> Ważny prawnie dokument elektroniczny</li>
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-gray-700 text-gray-500 flex items-center justify-center text-xs shrink-0">❌</div> Analityka B2B dla zarządu</li>
               </ul>
               <Link href="/register" className="block w-full bg-white text-black text-center py-5 font-bold rounded-xl text-lg hover:bg-gray-100 hover:shadow-xl transition z-10 relative">Kup Pakiet Mały</Link>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-500 p-10 md:p-12 rounded-[2.5rem] relative md:-translate-y-4 shadow-2xl shadow-indigo-900/50 hover:-translate-y-6 transition-transform duration-300 group">
               <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 bg-yellow-400 text-black px-6 py-1.5 font-black text-xs uppercase tracking-widest rounded-full rotate-3 shadow-lg z-20">Bestseller</div>
               <h3 className="text-2xl font-bold text-indigo-200 mb-3 tracking-tight">Dla Rozwijającego się Biznesu</h3>
               <div className="text-5xl font-black mb-4 text-white flex items-baseline gap-2">699 zł <span className="text-xl text-indigo-300 font-bold whitespace-nowrap">/ netto</span></div>
               <p className="mb-10 text-indigo-200 font-medium text-lg leading-relaxed">Pełen spokój ducha Twoich managerów HR - miej idealną kontrolę nad terminami zespołu.</p>
               <ul className="space-y-4 font-semibold mb-12 text-white">
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs shrink-0">✔</div> Dostęp <b>aż dla 50</b> pracowników</li>
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs shrink-0">✔</div> Raportowanie postępów (Panel B2B)</li>
                 <li className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs shrink-0">✔</div> Priorytetowy on-boarding instalacyjny</li>
               </ul>
               <Link href="/register" className="block w-full bg-white text-indigo-900 text-center py-5 font-black rounded-xl text-lg hover:bg-indigo-50 hover:shadow-xl shadow-white/10 transition z-10 relative">Kup Ten Pakiet</Link>
             </div>
           </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium text-sm bg-white gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-gray-900 rotate-12 flex items-center justify-center shrink-0">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
          <p className="font-semibold text-gray-700">&copy; {new Date().getFullYear()} BHP Platform Inc.</p>
        </div>
        <p className="text-center font-normal px-4">Platforma zgodna z wytycznymi MpiPS ws. wymogów profilaktyki i bezpieczeństwa pracy.</p>
        <div className="flex gap-6 justify-center">
           <Link href="/login" className="hover:text-gray-900 transition underline decoration-gray-300 underline-offset-4">Logowanie</Link>
           <Link href="/register" className="hover:text-gray-900 transition underline decoration-gray-300 underline-offset-4">Utwórz konto</Link>
        </div>
      </footer>
    </div>
  )
}
