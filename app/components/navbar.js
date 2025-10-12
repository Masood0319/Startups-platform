"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState({ authenticated: false, role: null, email: null })
  const [profileOpen, setProfileOpen] = useState(false)

  const dashboardPath = React.useMemo(() => {
    if (session?.role === 'founder') return '/founderDashboard'
    if (session?.role === 'investor') return '/investorDashboard'
    if (session?.role === 'fund_manager') return '/fundManagerDashboard'    
  }, [session?.role])

  const initials = React.useMemo(() => {
    if (!session?.email) return 'U'
    const namePart = session.email.split('@')[0]
    return namePart.slice(0, 2).toUpperCase()
  }, [session?.email])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        if (isMounted) {
          setSession({
            authenticated: Boolean(data?.authenticated),
            role: data?.role || null,
            email: data?.email || null,
          })
        }
      } catch (e) {
        if (isMounted) setSession({ authenticated: false, role: null, email: null })
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (_) { /* noop */ }
    window.location.href = '/'
  }

  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'Startups', href: '/startups' },
    { name: 'Features', href: '/features' },
  ]

  const authedLinks = [
    { name: 'Home', href: '/' },
    { name: 'Startups', href: '/startups' },
    { name: 'Features', href: '/features' },
    { name: 'Dashboard', href: dashboardPath },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-black text-white">
      <nav aria-label="Global" className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img alt="Logo" src="/favicon.ico" className="h-10 w-10 rounded-xl" />
            <span className="sr-only">Travest</span>
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200 hover:text-white hover:bg-white/5"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex md:gap-x-8 md:pr-4">
          {(session.authenticated ? authedLinks : publicLinks).map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-semibold text-white hover:text-indigo-300">
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {!session.authenticated ? (
            <>
              <Link href="/login" className="text-sm font-semibold text-white hover:text-indigo-300">Login</Link>
              <Link href="/signup" className="text-sm font-semibold text-white hover:text-indigo-300">Signup</Link>
              <Link href="/signup" className="ml-2 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
                  {initials}
                </div>
                <span className="hidden lg:block text-sm">Profile</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg">
                  <Link
                    href={dashboardPath}
                    className="block px-4 py-2 cursor-pointer text-sm hover:bg-white/5"
                    onClick={() => setProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 cursor-pointer text-sm hover:bg-white/5"
                    onClick={() => setProfileOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 cursor-pointer text-left text-sm text-red-300 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
        <div className="fixed inset-0 z-50 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-black p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img alt="Logo" src="/favicon.ico" className="h-8 w-8 rounded" />
              <span className="sr-only">Travest</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-200 hover:text-white hover:bg-white/5"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {(session.authenticated ? authedLinks : publicLinks).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            {!session.authenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>
                  Signup
                </Link>
                <Link href="/signup" className="ml-auto inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
                    {initials}
                  </div>
                  <div className="text-sm opacity-80 truncate">{session.email}</div>
                </div>
                <Link href={dashboardPath} className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile" className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg:white/5" onClick={() => setMobileMenuOpen(false)}>
                  View Profile
                </Link>
                <button onClick={handleLogout} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-red-300 hover:bg-white/5">
                  Logout
                </button>
              </div>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

export default Navbar
