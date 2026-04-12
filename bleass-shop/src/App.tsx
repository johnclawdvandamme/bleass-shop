import { useState, useEffect } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProduct, getProducts, getCategories, formatPrice, getBundles, type Product, type ProductCategory, type Bundle } from "./lib/medusa";

const ACCENT = "#00b8f8";
const BG = "#0a0a0f";
const CARD_BG = "#111111";
const BORDER = "rgba(255,255,255,0.07)";

function formatTagline(t: string): string {
  if (!t) return "";
  if (t.length > 80) return t.slice(0, 80) + "…";
  return t;
}

// ─── BUNDLES SECTION ────────────────────────────────────────
function BundleCard({ bundle }: { bundle: Bundle }) {
  const { pricing, plugins, title, handle } = bundle;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: CARD_BG,
        borderRadius: "20px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,140,0,0.3)";
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Header with gradient */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #0d0d0d 100%)",
        padding: "2rem",
        borderBottom: `1px solid rgba(255,140,0,0.15)`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: "#ff8c00", color: "#000",
          padding: "0.2rem 0.6rem", borderRadius: "6px",
          fontFamily: "'Oswald', sans-serif", fontSize: "0.7rem",
          fontWeight: 700, letterSpacing: "0.08em",
        }}>
          -{pricing.savingsPercent}%
        </div>
        <h3 style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: "1.4rem", letterSpacing: "0.06em",
          textTransform: "uppercase", color: "#fff", marginBottom: "0.25rem",
        }}>{title}</h3>
        <p style={{ color: "#888", fontSize: "0.78rem" }}>
          {plugins.length} plugins included
        </p>
      </div>

      {/* Plugin list */}
      <div style={{ padding: "1.5rem" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem", marginBottom: "1.5rem",
        }}>
          {plugins.map((plugin) => (
            <div key={plugin.id} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px", padding: "0.5rem 0.75rem",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.75rem", color: "#aaa", fontWeight: 300,
              }}>{plugin.name}</span>
              <span style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.72rem", color: "#555",
              }}>{plugin.priceLabel}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{
          background: "rgba(0,184,248,0.05)",
          border: "1px solid rgba(0,184,248,0.1)",
          borderRadius: "12px", padding: "1rem",
          marginBottom: "1rem",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "baseline", marginBottom: "0.3rem",
          }}>
            <span style={{ color: "#666", fontSize: "0.8rem" }}>Plugins total</span>
            <span style={{ color: "#555", textDecoration: "line-through", fontSize: "0.85rem" }}>
              {pricing.originalTotalLabel}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "1.1rem", color: "#22c55e",
            }}>Bundle price</span>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "1.5rem", color: "#fff",
            }}>{pricing.bundlePriceLabel}</span>
          </div>
          <div style={{
            marginTop: "0.4rem", paddingTop: "0.4rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", justifyContent: "flex-end",
          }}>
            <span style={{ color: "#ff8c00", fontSize: "0.78rem", fontWeight: 600 }}>
              You save {pricing.savingsLabel}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/product/${handle}`)}
          style={{
            width: "100%", padding: "0.85rem",
            borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #ff8c00 0%, #ff6000 100%)",
            color: "#000",
            fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,140,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          View Bundle
        </button>
      </div>
    </motion.div>
  );
}

function BundlesSection() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBundles()
      .then(setBundles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && bundles.length === 0) return null;

  return (
    <section id="bundles" style={{ padding: "4rem 2rem 5rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "0.72rem",
            fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#ff8c00", marginBottom: "0.75rem",
          }}>
            Save more with bundles
          </p>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            color: "#fff",
          }}>
            Plugin Bundles
          </h2>
          <p style={{ color: "#666", fontSize: "0.95rem", marginTop: "0.75rem", fontWeight: 300 }}>
            Get all your favorite plugins at a special price.
          </p>
        </div>

        {/* Bundle cards */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}>
            {[0, 1].map((i) => (
              <div key={i} style={{
                height: "420px", borderRadius: "20px",
                background: "rgba(255,255,255,0.04)",
                animation: "shimmer 1.5s infinite",
                backgroundImage: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
                backgroundSize: "200% 100%",
              }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}>
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <BundleCard bundle={bundle} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setError("Invalid product handle.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getProduct(handle)
      .then((result) => {
        if (!result) {
          setProduct(null);
          return;
        }
        setProduct(result);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div style={{ background: BG, color: "#fff", minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "#888" }}>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: BG, color: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>
          <Link to="/" style={{ color: ACCENT, textDecoration: "none" }}>Back to shop</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: BG, color: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", marginBottom: "0.75rem" }}>Product not found</h1>
          <Link to="/" style={{ color: ACCENT, textDecoration: "none" }}>Back to shop</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants?.[0];
  const price = variant?.prices?.[0]?.amount;
  const compareAt = product.metadata?.compareAtPrice ? parseInt(product.metadata.compareAtPrice) : null;
  const isFree = product.metadata?.isFree === "true";

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        <Link to="/" style={{ color: ACCENT, textDecoration: "none", fontSize: "0.85rem" }}>← Back to products</Link>

        <div style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}>
          <div style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            padding: "1.5rem",
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {product.thumbnail ? (
              <img src={product.thumbnail} alt={product.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            ) : (
              <p style={{ color: "#666" }}>No image</p>
            )}
          </div>

          <div>
            <p style={{ color: ACCENT, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              BLEASS PRODUCT
            </p>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "1rem" }}>
              {product.title}
            </h1>
            <p style={{ color: "#999", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {product.description || "No description available."}
            </p>

            <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              {isFree ? (
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.8rem", color: "#22c55e" }}>Free</span>
              ) : price ? (
                <>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.8rem" }}>{formatPrice(price)}</span>
                  {compareAt ? <span style={{ color: "#666", textDecoration: "line-through" }}>{formatPrice(compareAt)}</span> : null}
                </>
              ) : (
                <span style={{ color: "#666" }}>Price unavailable</span>
              )}
            </div>

            <button style={{
              border: "none",
              borderRadius: "10px",
              background: ACCENT,
              color: BG,
              fontFamily: "'Oswald', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "0.85rem 1.5rem",
              fontWeight: 700,
            }}>
              Buy now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotFoundPage() {
  return <Navigate to="/" replace />;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const category = categories.find(c => c.name === activeCategory);
  let filtered = activeCategory === "all" ? products : products.filter(p => p.categories?.some(c => c.id === category?.id));

  if (activeCategory === "Preset Packs" && activeSubFilter) {
    filtered = filtered.filter(p => p.metadata?.compatibleWith === activeSubFilter);
  }

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ─── BLACK FRIDAY BANNER ─────────────────────────── */}
      <div style={{
        background: "linear-gradient(90deg, #111 0%, #1a0a00 50%, #111 100%)",
        borderBottom: "1px solid rgba(255,140,0,0.2)",
        padding: "0.6rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,140,0,0.03) 10px, rgba(255,140,0,0.03) 20px)",
        }} />
        <p style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "0.72rem",
          fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#ff8c00", margin: 0,
        }}>
          🔥 BLACK FRIDAY 2026 — code{' '}
          <span style={{
            background: "rgba(255,140,0,0.15)", padding: "0.1rem 0.5rem",
            borderRadius: "4px", border: "1px solid rgba(255,140,0,0.4)",
            letterSpacing: "0.1em", color: "#ffb060",
          }}>
            BLACKFRIDAY20
          </span>
          {' '}- 20% off everything — Nov 27 → Dec 1
        </p>
      </div>

      {/* ─── HEADER ─────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "64px", display: "flex", alignItems: "center",
        background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          width: "100%", maxWidth: "1280px", margin: "0 auto",
          padding: "0 2rem", display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: ACCENT, display: "flex", alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "1rem", color: BG,
            }}>B</div>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "1.1rem", letterSpacing: "0.15em", color: "#fff",
            }}>BLEASS</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {[
              { label: "Products", to: "/" },
              { label: "Bundles", to: "#bundles" },
              { label: "About", to: "#" },
              { label: "Support", to: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: "0.8rem",
                  fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#888", textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#888"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Admin */}
          <button style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "0.75rem",
            fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.5rem 1.2rem", borderRadius: "8px",
            border: `1px solid ${ACCENT}`, background: "transparent",
            color: ACCENT, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = BG; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = ACCENT; }}
          >Admin Panel</button>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────── */}
      <section style={{
        paddingTop: "64px", minHeight: "70vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle gradient */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${ACCENT}12 0%, transparent 70%)`,
        }} />

        <div style={{
          maxWidth: "800px", textAlign: "center", padding: "6rem 2rem 4rem",
          position: "relative",
        }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "0.72rem",
              fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
              color: ACCENT, marginBottom: "1.5rem",
            }}
          >
            Professional Audio Software
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              lineHeight: 0.95, letterSpacing: "-0.01em",
              textTransform: "uppercase", color: "#fff", marginBottom: "1.5rem",
            }}
          >
            Craft your
            <br />
            <span style={{ color: ACCENT }}>sound.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: "#777", fontSize: "1rem", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 2.5rem", fontWeight: 300 }}
          >
            Synthesizers, vocal effects, and creative plugins built for modern producers.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 600,
              fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "0.85rem 2rem", borderRadius: "10px",
              background: ACCENT, color: BG, border: "none",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${ACCENT}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            Browse Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </section>

      {/* ─── BUNDLES ─────────────────────────────────── */}
      <BundlesSection />

      {/* ─── PRODUCTS ───────────────────────────────── */}
      <section id="products" style={{ padding: "2rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "flex", gap: "0.5rem", marginBottom: "2.5rem",
              overflowX: "auto", paddingBottom: "0.5rem",
              scrollbarWidth: "none",
            }}
          >
            <button
              onClick={() => { setActiveCategory("all"); setActiveSubFilter(null); }}
              style={{
                flexShrink: 0, padding: "0.5rem 1.2rem", borderRadius: "999px",
                border: "none", fontFamily: "'Oswald', sans-serif",
                fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", cursor: "pointer",
                background: activeCategory === "all" ? "#fff" : "rgba(255,255,255,0.06)",
                color: activeCategory === "all" ? BG : "#888",
                transition: "all 0.2s",
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.name); setActiveSubFilter(null); }}
                style={{
                  flexShrink: 0, padding: "0.5rem 1.2rem", borderRadius: "999px",
                  border: "none", fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                  background: activeCategory === cat.name ? ACCENT : "rgba(255,255,255,0.06)",
                  color: activeCategory === cat.name ? BG : "#888",
                  transition: "all 0.2s",
                }}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Sub-filters for Preset Packs */}
          {activeCategory === "Preset Packs" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", gap: "0.5rem", marginBottom: "1rem",
                overflowX: "auto", paddingBottom: "0.5rem",
                scrollbarWidth: "none",
              }}
            >
              <button
                onClick={() => setActiveSubFilter(null)}
                style={{
                  flexShrink: 0, padding: "0.4rem 1rem", borderRadius: "999px",
                  border: "none", fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                  background: activeSubFilter === null ? "#ff8c00" : "rgba(255,140,0,0.1)",
                  color: activeSubFilter === null ? BG : "#ff8c00",
                  transition: "all 0.2s",
                }}
              >
                All Synths
              </button>
              {[...new Set(filtered.map(p => p.metadata?.compatibleWith).filter((x): x is string => x != null))].map((synth) => (
                <button
                  key={synth}
                  onClick={() => setActiveSubFilter(synth)}
                  style={{
                    flexShrink: 0, padding: "0.4rem 1rem", borderRadius: "999px",
                    border: "none", fontFamily: "'Oswald', sans-serif",
                    fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer",
                    background: activeSubFilter === synth ? "#ff8c00" : "rgba(255,140,0,0.1)",
                    color: activeSubFilter === synth ? BG : "#ff8c00",
                    transition: "all 0.2s",
                  }}
                >
                  {synth}
                </button>
              ))}
            </motion.div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                  height: "380px", borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  animation: "shimmer 1.5s infinite",
                  backgroundImage: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
                  backgroundSize: "200% 100%",
                }} />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => {
                  const variant = product.variants?.[0];
                  const price = variant?.prices?.[0]?.amount;
                  const compareAt = product.metadata?.compareAtPrice ? parseInt(product.metadata.compareAtPrice) : null;
                  const isFree = product.metadata?.isFree === "true";
                  const discount = compareAt && price && compareAt > price
                    ? Math.round((1 - price / compareAt) * 100)
                    : null;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      onClick={() => navigate(`/product/${product.handle}`)}
                      style={{
                        background: CARD_BG, borderRadius: "16px",
                        border: `1px solid ${BORDER}`,
                        overflow: "hidden", cursor: "pointer",
                        transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,184,248,0.25)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.transform = "";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        height: "200px", background: "#0d0d0d",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "1.5rem", position: "relative",
                      }}>
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{
                              maxHeight: "100%", maxWidth: "100%",
                              objectFit: "contain",
                              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
                            }}
                          />
                        ) : null}

                        {/* Badges */}
                        {isFree && (
                          <span style={{
                            position: "absolute", top: "12px", left: "12px",
                            padding: "0.25rem 0.6rem", borderRadius: "6px",
                            background: "#22c55e", color: "#fff",
                            fontFamily: "'Oswald', sans-serif", fontSize: "0.65rem",
                            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                          }}>Free</span>
                        )}
                        {discount && (
                          <span style={{
                            position: "absolute", top: "12px", right: "12px",
                            padding: "0.25rem 0.6rem", borderRadius: "6px",
                            background: "#ef4444", color: "#fff",
                            fontFamily: "'Oswald', sans-serif", fontSize: "0.65rem",
                            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                          }}>-{discount}%</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "1.25rem" }}>
                        <h3 style={{
                          fontFamily: "'Oswald', sans-serif", fontWeight: 500,
                          fontSize: "0.95rem", letterSpacing: "0.04em",
                          textTransform: "uppercase", color: "#fff",
                          marginBottom: "0.4rem", lineHeight: 1.2,
                        }}>{product.title}</h3>

                        <p style={{
                          color: "#666", fontSize: "0.78rem", lineHeight: 1.5,
                          marginBottom: "1rem", display: "-webkit-box",
                          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          overflow: "hidden", fontWeight: 300,
                        }}>
                          {formatTagline(product.description ?? "")}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            {isFree ? (
                              <span style={{
                                fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                                fontSize: "1.1rem", color: "#22c55e",
                              }}>Free</span>
                            ) : price ? (
                              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                                <span style={{
                                  fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                                  fontSize: "1.1rem", color: "#fff",
                                }}>{formatPrice(price)}</span>
                                {compareAt && (
                                  <span style={{
                                    color: "#555", fontSize: "0.75rem",
                                    textDecoration: "line-through",
                                  }}>{formatPrice(compareAt)}</span>
                                )}
                              </div>
                            ) : null}
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); }}
                            style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: "rgba(0,184,248,0.1)", border: `1px solid rgba(0,184,248,0.2)`,
                              color: ACCENT, display: "flex", alignItems: "center",
                              justifyContent: "center", cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = BG; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,184,248,0.1)"; e.currentTarget.style.color = ACCENT; }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`, padding: "2rem",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "6px",
              background: ACCENT, display: "flex", alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "0.75rem", color: BG,
            }}>B</div>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: "0.9rem", letterSpacing: "0.15em",
            }}>BLEASS</span>
          </div>

          <p style={{ color: "#555", fontSize: "0.78rem", fontWeight: 300 }}>
            © 2026 BLEASS. Professional audio software for iOS, Mac, and Windows.
          </p>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l} href="#"
                style={{
                  color: "#555", fontSize: "0.78rem", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#555"}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        * { cursor: default !important; }
        a, button { cursor: pointer !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        ::selection { background: ${ACCENT}; color: ${BG}; }
        html { scroll-behavior: smooth; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:handle" element={<ProductPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}