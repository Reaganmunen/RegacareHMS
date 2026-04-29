import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  const role = await getRole();
  if (userId && role) {
    redirect(`/${role}`);
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F7FA] font-['DM_Sans','Helvetica_Neue',sans-serif] text-[#0D1B2A] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --navy: #0D1B2A;
          --teal: #0D8C8C;
          --teal-light: #12A5A5;
          --teal-pale: #E8F5F5;
          --teal-mid: #C0E8E8;
          --red: #C0392B;
          --green: #1A7A4A;
          --amber: #B45309;
          --slate: #4A5568;
          --muted: #718096;
          --border: #DDE3EA;
          --surface: #FFFFFF;
          --bg: #F5F7FA;
          --bg-2: #EEF1F6;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-6px) rotate(.15deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scan-line {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }

        .f1 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.05s; }
        .f2 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.18s; }
        .f3 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.30s; }
        .f4 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.44s; }
        .f5 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.58s; }
        .f6 { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; animation-delay:.72s; }

        .float-mock { animation: float 8s ease-in-out infinite; animation-delay: 1.2s; }

        .live-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--teal);
          animation: pulse-ring 1.8s ease-out infinite;
        }

        .marquee-wrap { overflow: hidden; }
        .marquee-inner { display: inline-flex; animation: marquee 42s linear infinite; }
        .marquee-item { font-size: 11.5px; font-weight: 500; color: #94A3B8; padding: 0 36px; border-right: 1px solid #E2E8F0; white-space: nowrap; letter-spacing: .04em; text-transform: uppercase; }

        .ecg-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: draw-ecg 3s ease forwards 1.5s;
        }
        @keyframes draw-ecg {
          to { stroke-dashoffset: 0; }
        }

        .card-hover {
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .card-hover:hover {
          border-color: var(--teal) !important;
          box-shadow: 0 0 0 3px rgba(13,140,140,.08), 0 20px 48px rgba(0,0,0,.09);
          transform: translateY(-2px);
        }

        .cross-icon {
          position: relative;
          width: 28px; height: 28px;
        }
        .cross-icon::before, .cross-icon::after {
          content: '';
          position: absolute;
          background: var(--teal);
          border-radius: 2px;
        }
        .cross-icon::before { width: 4px; height: 100%; left: 50%; transform: translateX(-50%); top: 0; }
        .cross-icon::after  { width: 100%; height: 4px; top: 50%; transform: translateY(-50%); left: 0; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px;
          background: var(--teal);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          border: none; border-radius: 8px;
          cursor: pointer;
          letter-spacing: -.01em;
          box-shadow: 0 2px 16px rgba(13,140,140,.28);
          transition: background .15s, transform .15s, box-shadow .15s;
        }
        .btn-primary:hover {
          background: #0b7d7d;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(13,140,140,.36);
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px;
          background: transparent;
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          border: 1.5px solid var(--border); border-radius: 8px;
          cursor: pointer;
          letter-spacing: -.01em;
          transition: border-color .15s, background .15s;
        }
        .btn-ghost:hover { border-color: #B0BBC7; background: #F4F7FB; }

        .vitals-bar { position: relative; height: 4px; background: #E8EDF2; border-radius: 99px; overflow: hidden; }
        .vitals-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 99px; }

        .mono { font-family: 'DM Mono', monospace; }

        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 14px;
        }
        .section-label::before {
          content: '';
          width: 18px; height: 2px;
          background: var(--teal);
          border-radius: 1px;
        }

        h1, h2, .serif { font-family: 'Fraunces', Georgia, serif; }

        /* Subtle grid bg */
        .grid-bg {
          background-image: linear-gradient(rgba(13,140,140,.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(13,140,140,.04) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        /* Red danger badge pulse */
        @keyframes badge-pulse {
          0%,100% { opacity: 1; }
          50% { opacity: .6; }
        }
        .danger-pulse { animation: badge-pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DDE3EA]">
        <div className="max-w-300 mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 bg-[#0D1B2A] rounded-lg flex items-center justify-center">
              <div className="cross-icon" style={{ width: 20, height: 20 }}></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-['Fraunces',serif] text-[17px] font-600 tracking-[-.02em] text-[#0D1B2A]">
                Rega<span className="text-[#0D8C8C]">Care</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[.12em] text-[#94A3B8] uppercase">
                Health Management
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-7 items-center">
            {['Features', 'Modules', 'Pricing', 'Docs', 'Blog'].map(l => (
              <a key={l} href="#" className="text-[13px] font-medium text-[#5C6B7A] no-underline transition-colors duration-150 tracking-[-.01em] hover:text-[#0D1B2A]">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {userId ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in">
                  <button className="btn-ghost text-[13px] py-2 px-4">Sign In</button>
                </Link>
                <Link href="/sign-up">
                  <button className="btn-primary text-[13px] py-2 px-5">
                    Request Demo
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative flex-1">

        {/* ── HERO ── */}
        <section className="grid-bg relative pt-20 pb-0 px-8">
          {/* Decorative cross pattern top-right */}
          <div className="absolute top-12 right-[8%] opacity-[.06] pointer-events-none select-none">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <rect x="75" y="0" width="30" height="180" rx="8" fill="#0D8C8C"/>
              <rect x="0" y="75" width="180" height="30" rx="8" fill="#0D8C8C"/>
            </svg>
          </div>
          <div className="absolute bottom-32 left-[4%] opacity-[.04] pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <rect x="50" y="0" width="20" height="120" rx="6" fill="#0D8C8C"/>
              <rect x="0" y="50" width="120" height="20" rx="6" fill="#0D8C8C"/>
            </svg>
          </div>

          <div className="max-w-300 mx-auto">
            {/* Badge */}
            <div className="f1 flex justify-center mb-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-[#C0E8E8] rounded-full shadow-[0_2px_8px_rgba(13,140,140,.1)]">
                <span className="relative w-2 h-2 rounded-full bg-[#0D8C8C] inline-block live-dot" />
                <span className="text-[11.5px] font-medium text-[#0D8C8C]">Live system · 120+ hospitals across East Africa</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="f2 text-center text-[clamp(42px,5.8vw,72px)] font-300 leading-[1.06] tracking-[-.035em] text-[#0D1B2A] mb-5">
              Clinical Operations,<br />
              <em className="not-italic font-600 text-[#0D8C8C]">Precisely Managed.</em>
            </h1>

            <p className="f3 text-center text-[16.5px] font-300 leading-[1.8] text-[#5C6B7A] max-w-130 mx-auto mb-8">
              RegaCare unifies every department — admissions, pharmacy, labs, billing, and ward management — into one intelligent, real-time hospital operating system.
            </p>

            {/* CTAs */}
            <div className="f4 flex justify-center gap-3 mb-3">
              {userId ? (
                <Link href={`/${role}`}>
                  <button className="btn-primary">Open Dashboard →</button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <button className="btn-primary">
                      Start Free Trial →
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button className="btn-ghost">Sign In</button>
                  </Link>
                </>
              )}
            </div>
            <div className="f4 text-center text-[11.5px] text-[#A0AEC0] mb-16 mono">
              No credit card required · 30-day trial · Setup in &lt; 1 hr
            </div>

            {/* ── DASHBOARD MOCKUP ── */}
            <div className="f5 float-mock max-w-245 mx-auto rounded-2xl overflow-hidden shadow-[0_32px_96px_rgba(0,0,0,.14),0_4px_20px_rgba(0,0,0,.08)] border border-[#DDE3EA]">
              {/* Browser chrome */}
              <div className="bg-[#0D1B2A] px-4 py-3 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"/>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"/>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"/>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded px-4 py-1">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1C2.79 1 1 2.79 1 5s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" stroke="#0D8C8C" strokeWidth="1.2"/>
                      <path d="M1 5h8M5 1c-1.1 1.5-1.7 3-1.7 4s.6 2.5 1.7 4M5 1c1.1 1.5 1.7 3 1.7 4S5.6 7.5 5 9" stroke="#0D8C8C" strokeWidth="1.2"/>
                    </svg>
                    <span className="text-[10.5px] text-white/45 mono">app.regacare.io/admin</span>
                  </div>
                </div>
                {/* Live indicator */}
                <div className="flex items-center gap-1.5 bg-[#0D8C8C]/15 rounded px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D8C8C] inline-block danger-pulse"/>
                  <span className="text-[9px] font-semibold text-[#0D8C8C] mono uppercase tracking-wider">LIVE</span>
                </div>
              </div>

              {/* App shell */}
              <div className="flex h-115">
                {/* Sidebar */}
                <div className="bg-[#0D1B2A] w-14 flex flex-col items-center py-5 gap-1.5 shrink-0 border-r border-white/5">
                  <div className="mb-3 relative">
                    <div className="w-8 h-8 bg-[#0D8C8C] rounded-lg flex items-center justify-center">
                      <div style={{ width: 14, height: 14, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '50%', top: 0, width: 3, height: '100%', background: '#fff', borderRadius: 2, transform: 'translateX(-50%)' }}/>
                        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 3, background: '#fff', borderRadius: 2, transform: 'translateY(-50%)' }}/>
                      </div>
                    </div>
                  </div>
                  {[
                    { path: 'M3 3h4v4H3zM9 3h2v2H9zM3 9h2v2H3zM9 9h4v4H9z', active: true },
                    { path: 'M6 2a4 4 0 100 8A4 4 0 006 2zM6 14s-5-2-5-5', active: false },
                    { path: 'M2 4h10M2 8h6M2 12h8', active: false },
                    { path: 'M3 3h10v10H3zM7 3v10M3 8h10', active: false },
                    { path: 'M2 2h8v12H2zM10 5l2 2-2 2', active: false },
                    { path: 'M4 2h8l2 3v9H4V2zM4 8h8', active: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150 ${n.active ? 'bg-[#0D8C8C]/20 border border-[#0D8C8C]/40' : 'hover:bg-white/6'}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d={n.path} stroke={n.active ? '#0D8C8C' : 'rgba(255,255,255,.3)'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 bg-[#F5F7FA] overflow-y-auto">
                  {/* Top bar */}
                  <div className="bg-white border-b border-[#E8EDF2] px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-['Fraunces',serif] text-[15px] font-600 text-[#0D1B2A] tracking-tight">Hospital Overview</div>
                      <div className="text-[10.5px] text-[#94A3B8] mono mt-0.5">Thu, 23 Apr 2026 · Nairobi General Hospital</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="px-3 py-1.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded text-[10.5px] text-[#5C6B7A] mono">This Week ▾</div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D8C8C] rounded text-[10.5px] text-white font-medium cursor-pointer hover:bg-[#0b7d7d] transition-colors">
                        <span>+</span> Admit Patient
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Stat cards */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'Active Patients', value: '1,284', delta: '+12 today', color: '#0D8C8C', icon: '♥' },
                        { label: 'Bed Occupancy', value: '86%', delta: '312 / 362 beds', color: '#B45309', icon: '⊞' },
                        { label: "Today's Appts", value: '247', delta: '18 pending', color: '#1A7A4A', icon: '◷' },
                        { label: 'Revenue (KES)', value: '4.2M', delta: '+8.4% vs last wk', color: '#1A7A4A', icon: '₭' },
                      ].map((m, i) => (
                        <div key={i} className="bg-white border border-[#E8EDF2] rounded-xl p-3.5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="text-[9.5px] font-600 text-[#94A3B8] tracking-[.08em] uppercase">{m.label}</div>
                            <div className="text-[13px]" style={{ color: m.color }}>{m.icon}</div>
                          </div>
                          <div className="font-['Fraunces',serif] text-[22px] font-600 text-[#0D1B2A] leading-none mb-1">{m.value}</div>
                          <div className="text-[9.5px] font-medium mono" style={{ color: m.color }}>{m.delta}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-[1.1fr,1.4fr,1fr] gap-3 mb-3">
                      {/* Bar chart */}
                      <div className="bg-white border border-[#E8EDF2] rounded-xl p-3.5">
                        <div className="text-[11px] font-600 text-[#0D1B2A] mb-0.5">Patient Admissions</div>
                        <div className="text-[9px] text-[#94A3B8] mono mb-3">Last 7 days</div>
                        <div className="flex gap-1.5 h-17 items-end mb-1.5">
                          {[42,61,38,80,54,77,65].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t overflow-hidden" style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                              <div
                                className="w-full rounded-t"
                                style={{
                                  height: `${h}%`,
                                  background: i === 3 ? '#0D8C8C' : '#C0E8E8',
                                  transition: 'height .3s ease'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        {/* FIX: use index-based keys since day labels repeat (T, S) */}
                        <div className="flex gap-1.5">
                          {['M','T','W','T','F','S','S'].map((d, i) => (
                            <div key={i} className="flex-1 text-center text-[8.5px] text-[#C4D0D9] mono">{d}</div>
                          ))}
                        </div>
                      </div>

                      {/* Ward occupancy */}
                      <div className="bg-white border border-[#E8EDF2] rounded-xl p-3.5">
                        <div className="text-[11px] font-600 text-[#0D1B2A] mb-3">Ward Occupancy</div>
                        {[
                          { ward: 'ICU', occ: 94, color: '#C0392B', note: 'Critical' },
                          { ward: 'Maternity', occ: 78, color: '#0D8C8C', note: 'High' },
                          { ward: 'Paediatrics', occ: 62, color: '#1A7A4A', note: 'Normal' },
                          { ward: 'General A', occ: 85, color: '#B45309', note: 'High' },
                          { ward: 'General B', occ: 51, color: '#1A7A4A', note: 'Normal' },
                        ].map(w => (
                          <div key={w.ward} className="mb-2.5">
                            <div className="flex justify-between mb-1">
                              <span className="text-[9.5px] text-[#5C6B7A] mono">{w.ward}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8.5px] px-1.5 py-0.5 rounded mono" style={{ background: w.color + '18', color: w.color }}>{w.note}</span>
                                <span className="text-[9.5px] font-600 mono" style={{ color: w.color }}>{w.occ}%</span>
                              </div>
                            </div>
                            <div className="vitals-bar">
                              <div className="vitals-fill" style={{ width: `${w.occ}%`, background: w.color }}/>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live queue */}
                      <div className="bg-white border border-[#E8EDF2] rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="text-[11px] font-600 text-[#0D1B2A]">Live Queue</div>
                          <div className="flex items-center gap-1 bg-[#C0392B]/10 rounded px-1.5 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] danger-pulse inline-block"/>
                            <span className="text-[8.5px] text-[#C0392B] mono font-600">4 waiting</span>
                          </div>
                        </div>
                        {[
                          { name: 'J. Odhiambo', id: '#4821', status: 'Triaged', color: '#B45309' },
                          { name: 'A. Mwangi', id: '#4822', status: 'In Consult', color: '#0D8C8C' },
                          { name: 'F. Kipchoge', id: '#4823', status: 'Waiting', color: '#94A3B8' },
                          { name: 'B. Kamau', id: '#4824', status: 'Lab Sent', color: '#1A7A4A' },
                        ].map(p => (
                          <div key={p.name} className="flex items-center py-2 border-b border-[#F2F4F7] gap-2 last:border-none">
                            <div className="w-6 h-6 rounded-full bg-[#E8F5F5] flex items-center justify-center text-[8.5px] font-600 text-[#0D8C8C] shrink-0">
                              {p.name[0]}{p.name.split(' ')[1][0]}
                            </div>
                            <div className="flex-1">
                              <div className="text-[9.5px] font-medium text-[#0D1B2A]">{p.name}</div>
                              <div className="text-[8.5px] mono text-[#94A3B8]">{p.id}</div>
                            </div>
                            <div className="px-1.5 py-0.5 rounded text-[8.5px] font-600 mono" style={{ background: p.color + '18', color: p.color }}>
                              {p.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-white border border-[#E8EDF2] rounded-xl p-3.5">
                      <div className="text-[11px] font-600 text-[#0D1B2A] mb-2.5">Recent Activity</div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { text: 'Discharge processed — Bed 14A', time: '2m ago', color: '#1A7A4A', icon: '✓' },
                          { text: 'Lab result ready — Patient #4821', time: '6m ago', color: '#0D8C8C', icon: '🔬' },
                          { text: 'Emergency admission — A&E', time: '11m ago', color: '#C0392B', icon: '!' },
                          { text: 'Invoice generated — KES 48,200', time: '18m ago', color: '#B45309', icon: '₭' },
                        ].map(a => (
                          <div key={a.text} className="p-2.5 bg-[#F8FAFC] rounded-lg border-l-2" style={{ borderLeftColor: a.color }}>
                            <div className="text-[9.5px] font-medium text-[#0D1B2A] leading-normal mb-1">{a.text}</div>
                            <div className="text-[8.5px] text-[#A0AEC0] mono">{a.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ECG decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden opacity-[.07]">
            <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full">
              <polyline
                points="0,32 120,32 160,32 180,10 200,54 220,10 240,32 280,32 360,32 400,32 420,8 440,56 460,8 480,32 520,32 600,32 640,32 660,14 680,50 700,14 720,32 760,32 840,32 880,32 900,6 920,58 940,6 960,32 1000,32 1080,32 1120,32 1140,10 1160,54 1180,10 1200,32 1440,32"
                fill="none"
                stroke="#0D8C8C"
                strokeWidth="2"
                className="ecg-line"
              />
            </svg>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <section className="py-9 border-t border-b border-[#DDE3EA] bg-white">
          <div className="text-center text-[9.5px] font-600 text-[#C4D0D9] tracking-[.18em] uppercase mb-5 mono">
            Trusted by Leading Healthcare Institutions
          </div>
          <div className="marquee-wrap">
            <div className="marquee-inner">
              {[
                'Nairobi General Hospital','Kenyatta National Hospital','Aga Khan Hospital','MP Shah Hospital',
                'Mater Hospital','Avenue Healthcare','Karen Hospital',"Gertrude's Children Hospital",
                'Nairobi General Hospital','Kenyatta National Hospital','Aga Khan Hospital','MP Shah Hospital',
                'Mater Hospital','Avenue Healthcare','Karen Hospital',"Gertrude's Children Hospital",
              ].map((h, i) => (
                <span key={i} className="marquee-item">{h}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROLES ── */}
        <section className="py-24 px-8">
          <div className="max-w-300 mx-auto">
            <div className="text-center mb-14">
              <div className="section-label justify-center">Built for Every Role</div>
              <h2 className="text-[42px] font-300 tracking-[-.03em] text-[#0D1B2A] leading-[1.1]">
                One platform.<br />
                <em className="not-italic font-600 text-[#0D8C8C]">Every person in your hospital.</em>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="2" y="2" width="18" height="18" rx="4" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M11 7v8M7 11h8" stroke="#0D8C8C" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#E8F5F5', role: 'Hospital Admin',
                  desc: 'Full operational visibility. Manage wards, staff rosters, budgets, and hospital-wide KPIs from a single command centre.',
                  perks: ['Real-time bed management', 'Staff scheduling & payroll', 'Financial dashboards', 'Compliance reporting']
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="7" r="4" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M4 19c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke="#0D8C8C" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M16 3v4M14 5h4" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#E8F5F5', role: 'Clinicians & Doctors',
                  desc: 'Spend less time on paperwork. Digital patient records, e-prescriptions, lab orders and clinical notes — all in one flow.',
                  perks: ['Electronic Health Records', 'Lab & radiology orders', 'e-Prescription system', 'Patient history timeline']
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="2" y="5" width="18" height="14" rx="3" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M15 5V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M7 11h8M7 15h5" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#FFF5E8', role: 'Receptionists',
                  desc: 'Effortlessly manage walk-ins, appointments, and patient registration with a clean, fast interface built for speed.',
                  perks: ['Appointment scheduling', 'Patient registration', 'Insurance verification', 'Queue management']
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M8 4h6l1 4H7L8 4z" stroke="#0D8C8C" strokeWidth="1.8" strokeLinejoin="round"/>
                      <rect x="3" y="8" width="16" height="12" rx="2" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M11 12v4M9 14h4" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#F0FBF0', role: 'Pharmacists',
                  desc: 'Receive digital prescriptions, track inventory in real time, and flag drug interactions automatically.',
                  perks: ['Prescription management', 'Drug inventory tracking', 'Expiry date alerts', 'Dispensing history']
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="9" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M11 7v4l3 2" stroke="#0D8C8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 11h2M15 11h2" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#EEF4FF', role: 'Lab Technicians',
                  desc: 'Process test requests, enter results, and deliver reports directly to requesting clinicians — no paper chasing.',
                  perks: ['Digital test requests', 'Result entry & validation', 'Auto-notify clinicians', 'Equipment tracking']
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="2" y="5" width="18" height="14" rx="3" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M2 9h18" stroke="#0D8C8C" strokeWidth="1.8"/>
                      <path d="M6 14h3M13 14h3" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  bg: '#FFF0F0', role: 'Finance & Billing',
                  desc: 'Automate invoicing, manage insurance claims, and get financial reports that reconcile in real time.',
                  perks: ['Automated invoicing', 'NHIF/insurance claims', 'Revenue analytics', 'Multi-payer billing']
                },
              ].map((r, i) => (
                <div key={i} className="card-hover bg-white border-[1.5px] border-[#E2E8EF] rounded-[18px] p-8 relative overflow-hidden cursor-pointer">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-linear-to-r from-transparent via-[#0D8C8C]/30 to-transparent"/>
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5" style={{ background: r.bg }}>
                    {r.icon}
                  </div>
                  <div className="font-['Fraunces',serif] text-[17px] font-600 text-[#0D1B2A] mb-2.5 tracking-[-.01em]">
                    {r.role}
                  </div>
                  <p className="text-[13px] leading-[1.75] text-[#6B7A8D] mb-5">{r.desc}</p>
                  <ul className="flex flex-col gap-2">
                    {r.perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-[12.5px] text-[#4A5568]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="7" fill="#E8F5F5"/>
                          <path d="M4.5 7l1.8 1.8 3.2-3.6" stroke="#0D8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES DARK ── */}
        <section className="bg-[#0D1B2A] py-24 px-8 relative overflow-hidden">
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[.04]" style={{ backgroundImage: 'linear-gradient(rgba(13,140,140,1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,140,140,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}/>
          {/* Large cross decoration */}
          <div className="absolute right-[5%] top-[10%] opacity-[.04]">
            <svg width="240" height="240" viewBox="0 0 240 240">
              <rect x="100" y="0" width="40" height="240" rx="12" fill="#0D8C8C"/>
              <rect x="0" y="100" width="240" height="40" rx="12" fill="#0D8C8C"/>
            </svg>
          </div>

          <div className="max-w-300 mx-auto relative">
            <div className="text-center mb-14">
              <div className="section-label justify-center" style={{ color: '#12A5A5' }}>
                <span style={{ background: '#12A5A5', width: 18, height: 2, display: 'inline-block', borderRadius: 1 }}/>
                Platform Capabilities
              </div>
              <h2 className="text-[42px] font-300 tracking-[-.03em] text-white leading-[1.1]">
                Everything your hospital needs.<br />
                <em className="not-italic font-600 text-[#12A5A5]">Nothing it doesn't.</em>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '◈', color: '#0D8C8C', title: 'Real-Time Analytics', desc: 'Live dashboards for bed occupancy, revenue, patient flow, and clinical outcomes — refreshed every 60 seconds.' },
                { icon: '◉', color: '#7C3AED', title: 'Smart Clinical Alerts', desc: 'Automated escalation for critical lab values, overdue tasks, medication reminders, and bed availability.' },
                { icon: '⊕', color: '#059669', title: 'System Integrations', desc: 'Connect to NHIF, insurance APIs, existing lab equipment, and laboratory information systems seamlessly.' },
                { icon: '◐', color: '#B45309', title: 'Mobile-First Workflows', desc: 'Fully responsive on any device. Doctors on phones, nurses on tablets — real-time data, anywhere in the building.' },
                { icon: '◈', color: '#C0392B', title: 'HIPAA-Grade Security', desc: 'End-to-end encryption, role-based access control, full audit trails and data residency options.' },
                { icon: '⊞', color: '#0891B2', title: 'Multi-Branch Support', desc: 'Manage multiple hospital branches, satellite clinics, or an entire healthcare network from one unified login.' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group bg-white/3 border border-white/[.07] rounded-2xl p-7 transition-all duration-200 hover:bg-white/6 hover:-translate-y-1 hover:border-[#0D8C8C]/40 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 text-lg font-600"
                    style={{ background: f.color + '22', color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div className="font-['Fraunces',serif] text-[15px] font-600 text-white mb-2 tracking-[-.01em]">
                    {f.title}
                  </div>
                  <p className="text-[13px] leading-[1.8] text-white/40">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-300 mx-auto">
            <div className="text-center mb-14">
              <div className="section-label justify-center">Clinical Outcomes</div>
              <h2 className="text-[42px] font-300 tracking-[-.03em] text-[#0D1B2A] leading-[1.1]">
                Measurable results.<br />
                <em className="not-italic font-600 text-[#0D8C8C]">From day one.</em>
              </h2>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-5 mb-10">
              {[
                { stat: '↓78%', label: 'Reduction in discharge processing time', color: '#1A7A4A' },
                { stat: '↓34%', label: 'Drop in patient safety incidents', color: '#0D8C8C' },
                { stat: '↑3×', label: 'Faster NHIF claim reconciliation', color: '#B45309' },
              ].map((s, i) => (
                <div key={i} className="text-center py-8 px-6 bg-[#F8FAFC] border border-[#E2E8EF] rounded-2xl">
                  <div className="font-['Fraunces',serif] text-[52px] font-600 leading-none mb-2" style={{ color: s.color }}>{s.stat}</div>
                  <div className="text-[13px] text-[#5C6B7A] leading-[1.6]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial cards */}
            <div className="grid grid-cols-3 gap-5">
              {[
                { quote: 'RegaCare cut our patient discharge time from 4 hours to under 45 minutes. The billing automation alone paid for the system in 3 months.', name: 'Dr. James Otieno', title: 'CEO, Nairobi General Hospital', initials: 'JO' },
                { quote: 'Our nurses no longer chase paper files around the ward. Everything is at their fingertips. Patient safety incidents dropped by 34% in the first quarter.', name: 'Amina Waweru', title: 'Head of Nursing, Mater Hospital', initials: 'AW' },
                { quote: 'The NHIF integration saved my billing team 3 days per month of manual reconciliation. The ROI is not even a question anymore.', name: 'Peter Kariuki', title: 'CFO, MP Shah Hospital', initials: 'PK' },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-[#E2E8EF] rounded-2xl p-7 hover:shadow-[0_12px_40px_rgba(0,0,0,.08)] transition-shadow duration-200">
                  {/* Quotemark */}
                  <div className="font-['Fraunces',serif] text-[64px] leading-none text-[#C0E8E8] mb-2 select-none">"</div>
                  <p className="text-[13.5px] leading-[1.85] text-[#374151] mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-[#EEF1F6]">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5F5] flex items-center justify-center text-[11px] font-600 text-[#0D8C8C] mono shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-600 text-[#0D1B2A]">{t.name}</div>
                      <div className="text-[11px] text-[#94A3B8] mono mt-0.5">{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="bg-[#F5F7FA] py-24 px-8 border-t border-[#DDE3EA]">
          <div className="max-w-275 mx-auto">
            <div className="text-center mb-14">
              <div className="section-label justify-center">Pricing</div>
              <h2 className="text-[42px] font-300 tracking-[-.03em] text-[#0D1B2A] leading-[1.1]">
                Transparent pricing.<br />
                <em className="not-italic font-600 text-[#0D8C8C]">No surprises.</em>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {[
                {
                  name: 'Starter', price: 'KES 25K', per: '/mo',
                  desc: 'For clinics and small hospitals up to 50 beds.',
                  features: ['Up to 50 beds', '10 staff accounts', 'Core HMS modules', 'Email support'],
                  featured: false
                },
                {
                  name: 'Professional', price: 'KES 75K', per: '/mo',
                  desc: 'For mid-size hospitals requiring full automation.',
                  features: ['Up to 300 beds', 'Unlimited staff accounts', 'All modules incl. pharmacy & lab', 'NHIF integration', 'Priority support', 'Custom reports'],
                  featured: true
                },
                {
                  name: 'Enterprise', price: 'Custom', per: '',
                  desc: 'For hospital networks and multi-branch operations.',
                  features: ['Unlimited beds & branches', 'Dedicated account manager', 'Custom integrations', 'On-premise option', 'SLA guarantee', 'White-label available'],
                  featured: false
                },
              ].map(p => (
                <div
                  key={p.name}
                  className={`relative rounded-[20px] p-8 overflow-hidden transition-all duration-200 ${
                    p.featured
                      ? 'bg-[#0D1B2A] border-[1.5px] border-[#0D8C8C] shadow-[0_0_0_4px_rgba(13,140,140,.08)]'
                      : 'bg-white border-[1.5px] border-[#E2E8EF] hover:border-[#C0E8E8] hover:shadow-[0_12px_40px_rgba(0,0,0,.07)] hover:-translate-y-0.5'
                  }`}
                >
                  {p.featured && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#0D8C8C] to-transparent"/>
                      <div className="absolute top-5 right-5 px-2.5 py-0.5 bg-[#0D8C8C] rounded-full text-[9.5px] font-600 text-white mono uppercase tracking-wider">
                        Most Popular
                      </div>
                    </>
                  )}
                  <div className={`text-[10px] font-600 mb-2 tracking-widest uppercase mono ${p.featured ? 'text-[#0D8C8C]' : 'text-[#94A3B8]'}`}>
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`font-['Fraunces',serif] text-[38px] font-600 tracking-[-.03em] leading-none ${p.featured ? 'text-white' : 'text-[#0D1B2A]'}`}>
                      {p.price}
                    </span>
                    <span className={`text-[12px] mono ${p.featured ? 'text-white/40' : 'text-[#94A3B8]'}`}>{p.per}</span>
                  </div>
                  <p className={`text-[13px] leading-[1.7] mb-6 ${p.featured ? 'text-white/50' : 'text-[#6B7A8D]'}`}>{p.desc}</p>
                  <ul className="flex flex-col gap-2.5 mb-8">
                    {p.features.map(f => (
                      <li key={f} className={`flex items-center gap-2.5 text-[13px] ${p.featured ? 'text-white/75' : 'text-[#374151]'}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="7" fill={p.featured ? 'rgba(13,140,140,.2)' : '#E8F5F5'}/>
                          <path d="M4.5 7l1.8 1.8 3.2-3.6" stroke={p.featured ? '#0D8C8C' : '#0D8C8C'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <button
                      className={`w-full py-3 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        p.featured
                          ? 'bg-[#0D8C8C] text-white hover:bg-[#0b7d7d] shadow-[0_2px_16px_rgba(13,140,140,.3)]'
                          : 'bg-transparent text-[#0D1B2A] border border-[#DDE3EA] hover:border-[#B0BBC7] hover:bg-[#F4F7FB]'
                      }`}
                    >
                      {p.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-8 bg-[#0D8C8C] relative overflow-hidden">
          {/* Medical cross watermarks */}
          <div className="absolute -top-10 right-[8%] opacity-[.08] pointer-events-none">
            <svg width="280" height="280" viewBox="0 0 280 280">
              <rect x="117" y="0" width="46" height="280" rx="14" fill="white"/>
              <rect x="0" y="117" width="280" height="46" rx="14" fill="white"/>
            </svg>
          </div>
          <div className="absolute -bottom-15 left-[4%] opacity-[.06] pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect x="84" y="0" width="32" height="200" rx="10" fill="white"/>
              <rect x="0" y="84" width="200" height="32" rx="10" fill="white"/>
            </svg>
          </div>
          {/* ECG line */}
          <div className="absolute inset-0 flex items-center opacity-[.08] pointer-events-none">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full">
              <polyline
                points="0,40 200,40 240,40 260,12 280,68 300,12 320,40 400,40 500,40 540,40 560,8 580,72 600,8 620,40 700,40 800,40 840,40 860,10 880,70 900,10 920,40 1000,40 1100,40 1140,40 1160,12 1180,68 1200,12 1220,40 1440,40"
                fill="none" stroke="white" strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="max-w-160 mx-auto text-center relative z-10">
            <h2 className="font-['Fraunces',serif] text-[46px] font-600 text-white tracking-[-.03em] leading-[1.08] mb-5">
              Ready to modernise<br />your hospital?
            </h2>
            <p className="text-[16px] text-white/70 font-300 leading-[1.75] mb-9">
              Join 120+ hospitals already running on RegaCare. Our team handles the entire setup and staff training — go live in under a week.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/sign-up">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0D8C8C] font-['DM_Sans',sans-serif] text-[14px] font-600 border-none rounded-lg cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,.15)]">
                  Start Free Trial →
                </button>
              </Link>
              <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-['DM_Sans',sans-serif] text-[14px] font-medium border border-white/35 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
                Book a Live Demo
              </button>
            </div>
            <p className="text-[11.5px] text-white/45 mt-5 mono">No credit card required · Free 30-day trial</p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D1B2A] py-14 px-8">
        <div className="max-w-300 mx-auto">
          <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-14 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0D8C8C]/20 border border-[#0D8C8C]/30 rounded-lg flex items-center justify-center">
                  <div style={{ position: 'relative', width: 14, height: 14 }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, width: 2.5, height: '100%', background: '#0D8C8C', borderRadius: 1.5, transform: 'translateX(-50%)' }}/>
                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 2.5, background: '#0D8C8C', borderRadius: 1.5, transform: 'translateY(-50%)' }}/>
                  </div>
                </div>
                <div>
                  <div className="font-['Fraunces',serif] text-[15px] font-600 text-white">RegaCare HMS</div>
                  <div className="text-[9px] mono text-white/25 tracking-widest uppercase">Health Management System</div>
                </div>
              </div>
              <p className="text-[13px] leading-[1.8] text-white/30 max-w-65">
                The complete hospital management system for modern healthcare in Africa and beyond.
              </p>
              <div className="flex gap-2 mt-5">
                {['HIPAA', 'ISO 27001', 'NHIF'].map(b => (
                  <span key={b} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/35 mono font-medium">{b}</span>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Modules', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Community', 'Status'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-[9.5px] font-600 tracking-[.12em] uppercase text-white/25 mono mb-4">{col.title}</div>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-white/40 no-underline text-[13px] transition-colors duration-150 hover:text-white/80">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/6 pt-6 flex justify-between items-center">
            <p className="text-[11px] text-white/20 mono">© {new Date().getFullYear()} RegaCare. All rights reserved.</p>
            <p className="text-[11px] text-white/20 mono">Built for African Healthcare 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
