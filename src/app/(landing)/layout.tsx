'use client'

import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
// import { DiscordIcon, XTwitterIcon, InstagramIcon } from "@/components/icons";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

// Bakery palette (soft, calm):
// #f0d7a7, #c37960, #894e3f, #eee1ba, #9c634f
const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "menu", label: "Menu", href: "#menu" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
];

function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sectionIds = navItems.filter(n => n.href.startsWith("#")).map(n => n.id);
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id);
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Smooth scroll for in-page links
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      {/* Fixed Navbar - All sections aligned horizontally */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 0", background:'#fffaf2' }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "2rem" }}>
          {/* Navbar 1: Brand/Logo */}
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "#894e3f", display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 8, fontSize: 24 }}>🥐</span> Bloom & Crust
          </div>

          {/* Navbar 2: Navigation Links */}
          <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", letterSpacing: 1, alignItems: "center", justifyContent: "center" }}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={e => handleNavClick(e, item.href)}
                  style={{
                    fontWeight: active === item.id ? 800 : 500,
                    color: active === item.id ? "#9c634f" : "#894e3f",
                    fontSize: 18,
                    textDecoration: "none",
                    transition: "color 0.2s, background 0.2s",
                    padding: "8px 14px",
                    borderRadius: 96,
                    background: active === item.id ? "#f0d7a7" : "transparent",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#f0d7a7")}
                  onMouseOut={e => (e.currentTarget.style.background = active === item.id ? "#f0d7a7" : "transparent")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Navbar 3: Cart + Auth */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
            <Link href="/cart" style={{ color: "#894e3f", textDecoration: "none", 
              // fontWeight: 600, padding: "6px 8px", letterSpacing: 1 
              }}>
              <button aria-label="Cart" style={{ background: "#f0d7a7", border: "1px solid #e6c98c", color: "#894e3f", padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>🛒</span>
              </button>
            </Link>
            <Link href="/login" style={{ color: "#894e3f", textDecoration: "none", fontWeight: 600, padding: "6px 8px", letterSpacing: 1 }}>Login</Link>
            <Link href="/register" style={{ color: "#9c634f", textDecoration: "none", background: "#fff", border: "1px solid #f0d7a7", padding: "10px 14px", borderRadius: 10, fontWeight: 600, letterSpacing: 1 }}>Signup</Link>
          </div>
        </div>
      </nav>
    </>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#f0d7a7",
      color: "#894e3f",
      padding: "2rem 0 1.25rem 0",
      marginTop: 40,
      textAlign: "center",
      letterSpacing: 1,
      boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Bloom & Crust Bakery</div>
      <div style={{ marginBottom: 8, display: "flex", gap: 24, justifyContent: "center" }}>
        <a href="https://wa.me/6281212345678" target="_blank" rel="noopener noreferrer" style={{ color: "#894e3f", fontSize: 16, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>WhatsApp</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#894e3f", fontSize: 16, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>Instagram</a>
        <a href="#contact" style={{ color: "#894e3f", fontSize: 16, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>Location</a>
      </div>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        © {new Date().getFullYear()} Bloom & Crust. Freshly baked daily.
      </div>
    </footer>
  );
}

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect current route to hide search bar on login/register
  const isAuthPage = typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register'));

  return (
    <html lang="en">
      <body style={{ background: "#fffaf2", margin: 0, fontFamily: "HyliliangHeiJ, sans-serif" }}>
        <Navbar />
        {/* Search bar below navbar - no background */}
        {!isAuthPage && (
          <div id="home" style={{ scrollMarginTop: 80, paddingTop: "60px" }}>
            <div style={{ maxWidth: 900, margin: "24px auto 16px auto", padding: "0 24px" }}>
              <input
                type="search"
                placeholder="Search pastries, breads, cakes..."
                onChange={(e) => {
                  const q = e.currentTarget.value;
                  window.dispatchEvent(new CustomEvent("bc:search", { detail: q }));
                }}
                style={{ width: "100%", padding: "14px 18px", borderRadius: 999, border: "1px solid #e6c98c", outline: "none", color: "#7a4a3d", letterSpacing: 0.5, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
              />
            </div>
          </div>
        )}
        {children}
        <Footer />
      </body>
    </html>
  );
}
