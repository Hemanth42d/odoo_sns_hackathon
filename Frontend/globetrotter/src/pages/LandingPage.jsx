import { useState } from "react";
import { Link } from "react-router-dom";

const destinationsData = {
  Adventure: [
    { name: "Swiss Alps", type: "Alpine Explorer", emoji: "🇨🇭", tag: "Peak", image: "/swiss_alps_hero_1767434473640.png" },
    { name: "Patagonia", type: "Wilderness Trek", emoji: "🇦🇷", tag: "Rugged", image: "/machu_picchu_trending_1767434490655.png" },
    { name: "Moab", type: "Desert Action", emoji: "🇺🇸", tag: "Red Rock", image: "/wild_safari_serengeti_1767434570460.png" },
    { name: "Iceland", type: "Glacial Tour", emoji: "🇮🇸", tag: "Frozen", image: "/kyoto_culture_1767434529732.png" }
  ],
  Relax: [
    { name: "Santorini", type: "Cycladic Escape", emoji: "🇬🇷", tag: "Sun", image: "/santorini_relax_1767434508896.png" },
    { name: "Maldives", type: "Overwater Bliss", emoji: "🇲🇻", tag: "Luxury", image: "/urban_new_york_skyline_1767434589257.png" },
    { name: "Bali", type: "Tropical Zen", emoji: "🇮🇩", tag: "Nature", image: "/machu_picchu_trending_1767434490655.png" },
    { name: "Amalfi", type: "Coastal Dream", emoji: "🇮🇹", tag: "Classic", image: "/gourmet_paris_1767434554190.png" }
  ],
  Culture: [
    { name: "Kyoto", type: "Ancient Temples", emoji: "🇯🇵", tag: "Zen", image: "/kyoto_culture_1767434529732.png" },
    { name: "Rome", type: "Eternal City", emoji: "🇮🇹", tag: "History", image: "/gourmet_paris_1767434554190.png" },
    { name: "Athens", type: "Mythic Ruins", emoji: "🇬🇷", tag: "Ancient", image: "/santorini_relax_1767434508896.png" },
    { name: "Cairo", type: "Pyramid Mystery", emoji: "🇪🇬", tag: "Legend", image: "/wild_safari_serengeti_1767434570460.png" }
  ],
  Gourmet: [
    { name: "Paris", type: "Michelin Tour", emoji: "🇫🇷", tag: "Fine", image: "/gourmet_paris_1767434554190.png" },
    { name: "Tokyo", type: "Sushi Master", emoji: "🇯🇵", tag: "Fresh", image: "/kyoto_culture_1767434529732.png" },
    { name: "Bologna", type: "Pasta Haven", emoji: "🇮🇹", tag: "Hearty", image: "/santorini_relax_1767434508896.png" },
    { name: "Oaxaca", type: "Mole Heritage", emoji: "🇲🇽", tag: "Spice", image: "/machu_picchu_trending_1767434490655.png" }
  ],
  Wild: [
    { name: "Serengeti", type: "Savanna Safari", emoji: "🇹🇿", tag: "Wild", image: "/wild_safari_serengeti_1767434570460.png" },
    { name: "Amazon", type: "Jungle Canopy", emoji: "🇧🇷", tag: "Deep", image: "/machu_picchu_trending_1767434490655.png" },
    { name: "Banff", type: "Rocky Mountain", emoji: "🇨🇦", tag: "Native", image: "/swiss_alps_hero_1767434473640.png" },
    { name: "Galapagos", type: "Unique Species", emoji: "🇪🇨", tag: "Origin", image: "/santorini_relax_1767434508896.png" }
  ],
  Urban: [
    { name: "New York", type: "Metropolis Glow", emoji: "🇺🇸", tag: "Fast", image: "/urban_new_york_skyline_1767434589257.png" },
    { name: "London", type: "Royal Streets", emoji: "🇬🇧", tag: "Grand", image: "/gourmet_paris_1767434554190.png" },
    { name: "Singapore", type: "Garden City", emoji: "🇸🇬", tag: "Fusion", image: "/wild_safari_serengeti_1767434570460.png" },
    { name: "Dubai", type: "Desert Oasis", emoji: "🇦🇪", tag: "Gold", image: "/machu_picchu_trending_1767434490655.png" }
  ]
};

function LandingPage() {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Adventure");

  const handleGetStarted = (e) => {
    e.preventDefault();
    window.location.href = `/signup?email=${email}`;
  };

  return (
    <div className="min-h-screen bg-main-bg selection:bg-brand-tint selection:text-brand-primary font-sans">
      {/* Navigation - Floating & Rounded - BETTER CENTERING */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center">
        <nav className="w-full max-w-7xl bg-white/90 backdrop-blur-xl border border-card-border rounded-full shadow-brand h-20 px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-brand">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <span className="text-2xl font-black text-text-primary tracking-tighter">GlobeTrotter</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#destinations" className="text-xs font-black text-text-secondary hover:text-brand-primary transition-colors uppercase tracking-[0.2em]">Destinations</a>
            <a href="#how-it-works" className="text-xs font-black text-text-secondary hover:text-brand-primary transition-colors uppercase tracking-[0.2em]">How it works</a>
            <a href="#features" className="text-xs font-black text-text-secondary hover:text-brand-primary transition-colors uppercase tracking-[0.2em]">Features</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/signin" className="hidden sm:block text-xs font-black text-text-secondary hover:text-brand-primary transition-colors uppercase tracking-[0.2em]">Log in</Link>
            <Link
              to="/signup"
              className="bg-brand-primary text-white px-8 py-4 rounded-full text-xs font-black hover:bg-brand-hover transition-all shadow-brand uppercase tracking-[0.2em]"
            >
              Start Planning
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section - REDUCED TEXT SIZE & CENTERED */}
      <section className="relative h-screen min-h-[850px] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/swiss_alps_hero_1767434473640.png"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10 shadow-3xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Explore The World</span>
          </div>

          <div className="mb-14">
            <span className="block text-brand-accent font-serif italic text-3xl md:text-3xl mb-4 drop-shadow-lg">Explore The</span>
            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase drop-shadow-2xl">
              Mountains
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-16 font-medium drop-shadow-md">
            The only travel planner you'll ever need. Multi-city itineraries, smart budgeting, and visual timelines—all in one place.
          </p>

          {/* Centered Search Bar */}
          <form onSubmit={handleGetStarted} className="w-full max-w-4xl p-2 bg-white rounded-full shadow-2xl border border-white/20 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-8 py-4 gap-4 border-r border-slate-100 group">
              <span className="text-xl transition-transform group-hover:scale-125 text-brand-primary">📍</span>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Destination</span>
                <input type="text" placeholder="Where next?" className="bg-transparent outline-none font-bold text-text-primary placeholder:text-slate-300 text-base w-full" />
              </div>
            </div>
            <div className="flex-1 flex items-center px-8 py-4 gap-4 border-r border-slate-100 group">
              <span className="text-xl transition-transform group-hover:scale-125 text-brand-primary">📅</span>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Travel Dates</span>
                <input type="text" placeholder="Add dates" className="bg-transparent outline-none font-bold text-text-primary placeholder:text-slate-300 text-base w-full" />
              </div>
            </div>
            <button type="submit" className="bg-brand-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] hover:bg-brand-hover transition-all flex items-center gap-3 text-sm">
              <span>Start Planning</span>
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-main-bg to-transparent z-10" />
      </section>

      {/* Category Discovery Section - CENTERED HEADERS */}
      <section id="destinations" className="pt-32 pb-40 bg-main-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-6">Discovery</h2>
              <p className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-tight">
                Browse by <span className="text-brand-accent/40 tracking-[-0.05em]">travel style</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.keys(destinationsData).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-300 ${selectedCategory === cat ? 'bg-brand-primary text-white border-brand-primary shadow-brand scale-110' : 'bg-white text-text-secondary border-card-border hover:border-brand-primary hover:text-brand-primary shadow-sm hover:shadow-md'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinationsData[selectedCategory].map((d, i) => (
              <div key={i} className="group cursor-pointer bg-white rounded-[40px] border border-card-border overflow-hidden hover:shadow-[0_24px_48px_-12px_rgba(31,122,99,0.12)] transition-all duration-500 flex flex-col h-full">
                <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[32px]">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm border border-card-border px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] text-brand-primary shadow-lg">
                    {d.tag}
                  </div>
                </div>

                <div className="p-8 pt-2 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-text-primary tracking-tighter">{d.name}</h3>
                      <span className="text-xl">{d.emoji}</span>
                    </div>
                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{d.type}</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-brand-tint flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">View Experience</span>
                    <div className="w-8 h-8 rounded-full bg-brand-tint flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section - CENTERED CONTENT */}
      <section id="how-it-works" className="relative py-40 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-8">Process</h2>
          <p className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-tight mb-20 max-w-4xl">
            Smart tools for <span className="text-brand-accent/30 tracking-[-0.05em]">unlimited travel</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
            <div className="space-y-10 text-left">
              {[
                { title: "Design Your Route", desc: "Select cities and dates. Our engine handles the logistics of your flow." },
                { title: "Budget Smarter", desc: "Real-time estimates and currency conversions for every single stop." },
                { title: "Share the Vibe", desc: "Generate public links or invite companions to plan collaboratively." }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 group cursor-default">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-tint flex items-center justify-center text-brand-primary font-black text-lg border border-card-border group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-text-primary mb-2 tracking-tight">{s.title}</h4>
                    <p className="text-text-secondary leading-relaxed font-medium text-base">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative pt-10 lg:pt-0">
              <div className="relative bg-brand-tint rounded-[70px] p-3 aspect-square shadow-brand border-2 border-white overflow-hidden max-w-lg mx-auto">
                <div className="absolute inset-0 z-0">
                  <img src="/machu_picchu_trending_1767434490655.png" alt="Machu Picchu" className="w-full h-full object-cover brightness-90 grayscale-[0.2]" />
                  <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply" />
                </div>
                <div className="relative z-10 w-full h-full bg-black/5 rounded-[56px] border border-white/20 shadow-inner p-8 flex flex-col justify-end overflow-hidden">
                  <div className="absolute top-8 left-8 p-5 bg-white rounded-3xl shadow-xl border border-card-border animate-bounce max-w-[200px] hidden md:block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-tint rounded-full flex items-center justify-center text-xl text-brand-primary">⛰️</div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest leading-none mb-1">Route Optimized</span>
                        <span className="text-xs font-black text-text-primary">Machu Picchu Loop</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-4xl font-black text-white tracking-tighter leading-[0.9] mb-4">
                    Plot your next <br /> legend.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Grid - REDUCED TEXT SIZES */}


      {/* High-End CTA Section - CENTERED */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-brand-primary rounded-[80px] p-20 md:p-32 overflow-hidden text-center shadow-brand">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-[0.8] uppercase max-w-4xl">
                Your world. <br />
                Your way. <br />
                <span className="text-brand-accent brightness-125">Start now.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
                <Link to="/signup" className="px-14 py-6 bg-white text-brand-primary rounded-full font-black uppercase tracking-[0.2em] hover:scale-105 transition-all text-sm shadow-xl">
                  Plan First Trip
                </Link>
                <Link to="/signup" className="px-14 py-6 border-2 border-brand-accent text-white rounded-full font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-sm">
                  Join Community
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-40 -right-40 w-1/2 aspect-square bg-brand-accent rounded-full blur-[200px]" />
              <div className="absolute -bottom-40 -left-40 w-1/2 aspect-square bg-brand-tint rounded-full blur-[200px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - CLEANER TEXT SIZES */}
      <footer className="bg-white pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-24 pb-20 border-b border-card-border mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-brand">
                  <span className="text-white font-black text-xl">G</span>
                </div>
                <span className="text-3xl font-black text-text-primary tracking-tighter">GlobeTrotter</span>
              </div>
              <p className="text-text-secondary text-lg font-medium leading-relaxed">
                The world is waiting. <br />
                Plan it better. Travel it smarter.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-24">
              <div>
                <h4 className="text-[9px] font-black text-text-primary uppercase tracking-[0.3em] mb-10">Platform</h4>
                <div className="flex flex-col gap-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                  <a href="#destinations" className="hover:text-brand-primary transition-colors">Planner</a>
                  <a href="#destinations" className="hover:text-brand-primary transition-colors">Sync</a>
                  <a href="#destinations" className="hover:text-brand-primary transition-colors">Discovery</a>
                </div>
              </div>
              <div>
                <h4 className="text-[9px] font-black text-text-primary uppercase tracking-[0.3em] mb-10">Resources</h4>
                <div className="flex flex-col gap-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                  <Link to="/" className="hover:text-brand-primary transition-colors">Guides</Link>
                  <Link to="/" className="hover:text-brand-primary transition-colors">Stories</Link>
                  <Link to="/" className="hover:text-brand-primary transition-colors">Help</Link>
                </div>
              </div>
              <div>
                <h4 className="text-[9px] font-black text-text-primary uppercase tracking-[0.3em] mb-10">Company</h4>
                <div className="flex flex-col gap-6 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                  <Link to="/" className="hover:text-brand-primary transition-colors">About</Link>
                  <Link to="/" className="hover:text-brand-primary transition-colors">Privacy</Link>
                  <Link to="/" className="hover:text-brand-primary transition-colors">Admin</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em]">© 2026 GlobeTrotter International.</span>
            <div className="flex gap-10">
              {['Instagram', 'X', 'LinkedIn'].map(s => (
                <span key={s} className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] cursor-pointer hover:text-brand-primary transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
