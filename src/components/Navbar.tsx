'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logoutAction } from '@/app/login/actions';

interface SubMenuItem {
  label: string;
  href: string;
  external?: boolean;
}

interface SidebarSection {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
  children?: SubMenuItem[];
}

const STUDENT_PATHS = ['/all-students', '/result', '/fetch-detail', '/add-student'];
const STAFF_PATHS = ['/all-staff', '/fetch-staff-detail', '/add-staff'];

const SIDEBAR_MENU: SidebarSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'students',
    label: 'Students',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    children: [
      { label: 'All Students', href: '/all-students' },
      { label: 'Result 2026', href: '/result' },
      { label: 'Fetch Detail', href: '/fetch-detail' },
      { label: 'Add Student', href: '/add-student' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
      </svg>
    ),
    children: [
      { label: 'All Staff', href: '/all-staff' },
      { label: 'Fetch Staff Detail', href: '/fetch-staff-detail' },
      { label: 'Add Staff', href: '/add-staff' },
    ],
  },
  {
    id: 'statements',
    label: 'Statements',
    href: '/statements',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'mdm',
    label: 'MDM (Mid-Day Meal)',
    href: 'https://mdmcal.vercel.app/',
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
];

export default function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    students: true,
    staff: true,
  }));

  useEffect(() => {
    if (!pathname) return;

    const isStudentRoute = STUDENT_PATHS.some((p) => pathname.startsWith(p));
    const isStaffRoute = STAFF_PATHS.some((p) => pathname.startsWith(p));

    setOpenGroups((prev) => {
      const nextStudents = isStudentRoute ? true : prev.students;
      const nextStaff = isStaffRoute ? true : prev.staff;

      // Return exact same object reference if nothing changed to prevent re-render loops
      if (nextStudents === prev.students && nextStaff === prev.staff) {
        return prev;
      }

      return {
        ...prev,
        students: nextStudents,
        staff: nextStaff,
      };
    });
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isPathActive = (href?: string) => {
    if (!href) return false;
    return href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(href));
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between border-b border-cyan-500/25 px-5 py-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/60 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.35)] transition group-hover:border-fuchsia-400 group-hover:text-fuchsia-300">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-base font-extrabold tracking-tight text-transparent">
                GMS WARPORA
              </span>
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                UDISE: 01011301201
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Sidebar"
            className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 lg:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-1.5 px-3 py-5">
          {SIDEBAR_MENU.map((section) => {
            if (section.children && section.children.length > 0) {
              const isOpen = Boolean(openGroups[section.id]);
              const hasActiveChild = section.children.some((child) =>
                isPathActive(child.href)
              );

              return (
                <div key={section.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(section.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                      hasActiveChild
                        ? 'border-cyan-400/60 bg-cyan-950/50 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.2)]'
                        : 'border-transparent text-slate-300 hover:border-cyan-500/30 hover:bg-slate-900/80 hover:text-cyan-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={hasActiveChild ? 'text-cyan-300' : 'text-slate-400'}>
                        {section.icon}
                      </span>
                      <span>{section.label}</span>
                    </span>
                    <svg
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-300' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="ml-4 space-y-1 border-l border-cyan-500/25 pl-3 pt-0.5">
                      {section.children.map((sub) => {
                        const active = isPathActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition ${
                              active
                                ? 'bg-fuchsia-950/65 text-fuchsia-200 shadow-[0_0_12px_rgba(217,70,239,0.28)] ring-1 ring-fuchsia-400/50'
                                : 'text-slate-400 hover:bg-slate-900/70 hover:text-cyan-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                active
                                  ? 'bg-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,1)]'
                                  : 'bg-slate-600'
                              }`}
                            />
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (section.external && section.href) {
              return (
                <a
                  key={section.id}
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-950/40 hover:text-emerald-200"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-emerald-400">{section.icon}</span>
                    <span>{section.label}</span>
                  </span>
                  <svg
                    className="h-3.5 w-3.5 text-emerald-400/80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              );
            }

            const active = isPathActive(section.href);
            return (
              <Link
                key={section.id}
                href={section.href || '/'}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                  active
                    ? 'border-cyan-400/80 bg-cyan-950/70 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                    : 'border-transparent text-slate-300 hover:border-cyan-500/30 hover:bg-slate-900/80 hover:text-cyan-300'
                }`}
              >
                <span className={active ? 'text-cyan-300' : 'text-slate-400'}>
                  {section.icon}
                </span>
                <span>{section.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Auth Action */}
      <div className="border-t border-cyan-500/20 p-4">
        {isAuthenticated ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/70 bg-rose-950/60 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.28)] transition hover:bg-rose-900/85 hover:text-white"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-fuchsia-400/80 bg-fuchsia-950/65 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.32)] transition hover:bg-fuchsia-900/85 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Staff Login</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-cyan-500/30 bg-slate-950/90 px-4 py-3 backdrop-blur-xl lg:hidden print:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-base font-extrabold tracking-tight text-transparent">
            GMS WARPORA
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Navigation Sidebar"
          className="inline-flex items-center justify-center rounded-xl border border-cyan-500/40 bg-slate-900 p-2 text-cyan-300 hover:border-cyan-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile Slide-Over Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden print:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <aside className="relative z-10 w-72 border-r border-cyan-500/35 bg-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-cyan-500/30 bg-slate-950/95 backdrop-blur-xl shadow-[4px_0_30px_rgba(34,211,238,0.1)] lg:block print:hidden">
        {sidebarContent}
      </aside>
    </>
  );
}