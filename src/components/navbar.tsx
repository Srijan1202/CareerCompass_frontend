"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Brain, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, logout } = useAuth()

  // Navbar scroll state
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY

      // Navbar background toggle
      setScrolled(currentScroll > 50)

      // Hide/show on scroll direction
      if (currentScroll > lastScrollY && currentScroll > 100) {
        // scrolling down
        setHidden(true)
      } else {
        // scrolling up
        setHidden(false)
      }

      setLastScrollY(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
  ]

  return (
    <nav
      className={`fixed left-1/2 top-0 mt-2 transform -translate-x-1/2 w-3/4 rounded-2xl border-b border-gray-200 z-50 transition-all duration-500
        ${scrolled ? "bg-transparent backdrop-blur-2xl border-b-0" : "bg-white/95 backdrop-blur-md shadow-md"}
        ${hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCompass</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                </div>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-600 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-gray-600 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
