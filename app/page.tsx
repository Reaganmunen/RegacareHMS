import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
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
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large soft blue circle top-right */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1d4ed8, transparent 70%)" }}
        />
        {/* Smaller accent circle bottom-left */}
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #1d4ed8, transparent 70%)" }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top Nav Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-blue-700 font-bold text-lg tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
            RegaCare
          </span>
        </div>
        {userId && <UserButton />}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-sm font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Hospital Management System
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-4"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Welcome to{" "}
          <span
            className="text-blue-700 relative inline-block"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            RegaCare
            {/* Underline accent */}
            <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-200 rounded-full" />
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
          Your trusted platform for managing healthcare records with{" "}
          <span className="text-gray-700 font-medium">clarity, ease, and security</span>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          {userId ? (
            <>
              <Link href={`/${role}`}>
                <button className="px-7 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base shadow-md hover:bg-blue-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  View Dashboard →
                </button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <button className="px-7 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base shadow-md hover:bg-blue-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  Get Started as Patient
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="px-7 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:border-blue-300 hover:text-blue-700 transition-all duration-200 hover:-translate-y-0.5">
                  Login to Account
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Pills */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {[
            { icon: "🔒", label: "Secure Records" },
            { icon: "📋", label: "Easy Scheduling" },
            { icon: "💊", label: "Prescription Management" },
            { icon: "📊", label: "Health Analytics" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-gray-600 text-sm font-medium"
            >
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-gray-400 text-xs tracking-wide">
          © {new Date().getFullYear()} RegaCare Hospital Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}