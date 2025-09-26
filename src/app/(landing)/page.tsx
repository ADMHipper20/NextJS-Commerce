
"use client"

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "Bread & Rolls" | "Pastry" | "Cakes & Sweets" | "Pies & Tarts";
  image: string;
  kind: string;
  stock: number;
};

const products: Product[] = [
  { id: "p1", name: "Artisan Sourdough", price: 3.9, category: "Bread & Rolls", image: "/assets/Bread & Rolls/sliced-loaf-artisan-sourdough-bread.jpg", kind: "Sourdough", stock: 6 },
  { id: "p2", name: "Baguette", price: 2.5, category: "Bread & Rolls", image: "/assets/Bread & Rolls/baguettes-bread.jpg", kind: "French Bread", stock: 12 },
  { id: "p3", name: "Square Loaf", price: 3.2, category: "Bread & Rolls", image: "/assets/Bread & Rolls/square-loaf-bread.jpg", kind: "Soft Loaf", stock: 8 },
  { id: "p4", name: "Spelt Teacakes", price: 2.8, category: "Bread & Rolls", image: "/assets/Bread & Rolls/spelt-english-teackes.jpg", kind: "Spelt", stock: 9 },

  { id: "p5", name: "Butter Croissant", price: 2.2, category: "Pastry", image: "/assets/Pastry/butter-croissantsjpg.jpg", kind: "Viennoiserie", stock: 14 },
  { id: "p6", name: "Cinnamon Roll", price: 2.7, category: "Pastry", image: "/assets/Pastry/cinnamon-roll.jpg", kind: "Sweet Roll", stock: 7 },
  { id: "p7", name: "Baked Cinnamon Buns", price: 2.6, category: "Pastry", image: "/assets/Pastry/baked-cinnamon-buns.jpg", kind: "Bun", stock: 10 },
  { id: "p8", name: "Pain au Chocolat", price: 2.9, category: "Pastry", image: "/assets/Pastry/pain_au_chocolat_luc_viatour.jpg", kind: "Viennoiserie", stock: 11 },
  { id: "p9", name: "Puff with Raisins", price: 2.4, category: "Pastry", image: "/assets/Pastry/puff-pastry-with-raisins.jpg", kind: "Puff Pastry", stock: 5 },
  { id: "p10", name: "Sausage Roll", price: 2.3, category: "Pastry", image: "/assets/Pastry/british-sausage-rolls.jpg", kind: "Savory", stock: 10 },

  { id: "p11", name: "Brownies", price: 3.0, category: "Cakes & Sweets", image: "/assets/Cakes & Sweets/variants-brownies.jpg", kind: "Chocolate", stock: 16 },
  { id: "p12", name: "Victoria Sponge", price: 4.5, category: "Cakes & Sweets", image: "/assets/Cakes & Sweets/victoria-sponge-cake.jpg", kind: "Classic Cake", stock: 4 },
  { id: "p13", name: "Dundee Cake", price: 4.2, category: "Cakes & Sweets", image: "/assets/Cakes & Sweets/traditional-scottish-dundee-cake.jpg", kind: "Fruit Cake", stock: 3 },

  { id: "p14", name: "Apple Pie", price: 4.0, category: "Pies & Tarts", image: "/assets/Pies & Tarts/old-fashioned-apple_pie.jpg", kind: "Pie", stock: 5 },
  { id: "p15", name: "Pastéis de Nata", price: 2.0, category: "Pies & Tarts", image: "/assets/Pies & Tarts/portuguese-custard-tarts-pasteis-de-nata.jpg", kind: "Custard Tart", stock: 20 },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const handler = (e: Event) => setQuery((e as CustomEvent<string>).detail || "");
    window.addEventListener("bc:search", handler as EventListener);
    return () => window.removeEventListener("bc:search", handler as EventListener);
  }, []);

  const formatCurrency = useMemo(() => new Intl.NumberFormat(undefined, { style: "currency", currency }), [currency]);

  return (
    <main>
      {/* Hero */}
      <section id="home" style={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: 1,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #eee1ba 0%, #fffaf2 70%)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url(/assets/Pastry/croissant-with-melted-chocolate.jpg) center/cover no-repeat", opacity: 0.24 }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ color: "#894e3f", fontSize: 44, margin: 0, fontWeight: 800 }}>Bloom & Crust</h1>
          <p style={{ color: "#9c634f", fontSize: 18, marginTop: 12 }}>Freshly baked breads, pastries, and sweets every morning.</p>
        </div>
      </section>

      {/* Filters + Catalog */}
      <section id="menu" style={{ padding: "3rem 1rem", maxWidth: 1200, margin: "0 auto", scrollMarginTop: 96 }}>
        <h2 style={{ color: "#894e3f", textAlign: "center", marginBottom: 16, fontWeight: 800, letterSpacing: 1 }}>Our Menu</h2>
        <Filters />
        <Catalog query={query} formatCurrency={(n:number)=>formatCurrency.format(n)} />
      </section>

      {/* About */}
      <section id="about" style={{ background: "#fdf7ea", padding: "3rem 1rem", scrollMarginTop: 96 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", color: "#7a4a3d" }}>
          <h3 style={{ marginTop: 0 }}>About Bloom & Crust</h3>
          <p>We are a micro-bakery focusing on naturally leavened breads and classic pastries. Ingredients are simple, butter is real, and everything is baked with care.</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "3rem 1rem", scrollMarginTop: 96 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", color: "#7a4a3d" }}>
          <h3 style={{ marginTop: 0 }}>Find Us</h3>
          <p>WhatsApp: +62 812-1234-5678 · Instagram: @bloomandcrust · Location: Jakarta, Indonesia</p>
        </div>
      </section>
    </main>
  );
}

function Filters() {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "center",
      marginBottom: 20,
    }}>
      {[
        { id: "all", label: "All" },
        { id: "Bread & Rolls", label: "Bread & Rolls" },
        { id: "Pastry", label: "Pastry" },
        { id: "Cakes & Sweets", label: "Cakes & Sweets" },
        { id: "Pies & Tarts", label: "Pies & Tarts" },
      ].map(btn => (
        <a key={btn.id} href={`#menu-${btn.id.replace(/\s|&/g, '')}`}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid #f0d7a7",
            background: "#fff",
            color: "#9c634f",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >{btn.label}</a>
      ))}
    </div>
  );
}

function Catalog({ query, formatCurrency }: { query: string; formatCurrency: (n:number)=>string; }) {
  const groups: Record<string, Product[]> = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.kind.toLowerCase().includes(query.toLowerCase()))
    .reduce((acc, p) => {
      acc[p.category] = acc[p.category] ? [...acc[p.category], p] : [p];
      return acc;
    }, {} as Record<string, Product[]>);

  const order = ["Bread & Rolls", "Pastry", "Cakes & Sweets", "Pies & Tarts"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {order.map(cat => (
        <div key={cat}>
          <div id={`menu-${cat.replace(/\s|&/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 18px 0', scrollMarginTop: 96 }}>
            <h3 style={{ margin: 0, color: "#894e3f" }}>{cat}</h3>
            <div style={{ height: 1, background: "#f0d7a7", flex: 1 }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {(groups[cat] || []).map(p => (
              <article key={p.id} style={{
                background: "#fff",
                border: "1px solid #f0d7a7",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ position: 'relative', paddingTop: '66%' }}>
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: '#f0d7a7', color: '#894e3f', padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>{p.kind}</div>
                  <div style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #f0d7a7', color: '#9c634f', padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 400 }}>{p.stock > 0 ? `${p.stock} left` : 'Sold out'}</div>
                </div>
                <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: "#894e3f", fontWeight: 500, letterSpacing: 0.5 }}>{p.name}</div>
                    <div style={{ color: "#9c634f", fontWeight: 400 }}>{formatCurrency(p.price)}</div>
                  </div>
                  <button disabled={p.stock === 0} style={{ background: p.stock ? '#9c634f' : '#b9a39e', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 12px', fontWeight: 700, cursor: p.stock ? 'pointer' : 'not-allowed' }}>Add</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
