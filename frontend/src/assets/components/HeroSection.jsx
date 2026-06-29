import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, ChevronDown, Star, BadgeCheck, GraduationCap, Building2, Users, ThumbsUp } from "lucide-react";

// Google Fonts import — add this to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,800;1,700&display=swap" rel="stylesheet">

const STATS = [
  { value: "10K+", label: "Posted Internships",     Icon: GraduationCap },
  { value: "500+", label: "Hiring Partners",         Icon: Building2     },
  { value: "2K+",  label: "Successful Placements",  Icon: Users         },
  { value: "95%",  label: "Satisfaction Rate",      Icon: ThumbsUp      },
];

const POPULAR = ["All", "Business", "Engineering", "Finance", "Health", "Design", "Tech"];

export default function HeroSection() {
  const [activeTag, setActiveTag] = useState("All");
  const [role,      setRole]      = useState("");
  const [location,  setLocation]  = useState("");
  const [duration,  setDuration]  = useState("");

  return (
    <section
      className="relative w-full overflow-hidden bg-white flex flex-col"
      style={{
        minHeight: "calc(100vh - 68px)",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ── Soft warm blob behind right image ── */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "52%", height: "100%",
          background: "radial-gradient(ellipse 80% 90% at 70% 40%, #FDF3E7 0%, #FDEBD0 40%, transparent 75%)",
          zIndex: 0,
        }}
      />

      {/* ══════════════ MAIN HERO BODY ══════════════ */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 flex items-center">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 flex flex-col justify-center py-12 pr-8" style={{ maxWidth: 580 }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5831F]" />
            <span className="text-xs font-semibold text-[#F5831F] tracking-[0.12em] uppercase">
              Your Future Starts Here
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-5 text-[#0D0D0D] leading-[1.1]" style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}>
            <span className="block font-extrabold" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800 }}>
              Find Your Perfect
            </span>
            <span className="block" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700, color: "#F5831F", lineHeight: 1.15 }}>
              Internship or
            </span>
            <span className="block font-extrabold" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800 }}>
              Attachment
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-[14.5px] text-[#6B7280] leading-[1.7] mb-8" style={{ maxWidth: 420 }}>
            Discover thousands of verified internships and industrial attachments from top companies, organisations and institutions.
          </p>

          {/* Search Bar */}
          <div
            className="flex items-center bg-white mb-6 flex-wrap md:flex-nowrap"
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 24px rgba(0,0,0,0.10), 0 0 0 1.5px #F0EDE8",
              overflow: "hidden",
            }}
          >
            <div className="flex items-center gap-2 flex-1 px-4 py-3.5 border-r border-[#F0EDE8] min-w-[120px]">
              <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <input
                type="text"
                placeholder="Course / Field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex-1 text-[13px] text-[#111] placeholder-[#9CA3AF] outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 border-r border-[#F0EDE8]" style={{ minWidth: 140 }}>
              <MapPin className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter Region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-[13px] text-[#111] placeholder-[#9CA3AF] outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 border-r border-[#F0EDE8]" style={{ minWidth: 140 }}>
              <Clock className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="text-[13px] text-[#9CA3AF] outline-none bg-transparent appearance-none cursor-pointer"
                style={{ minWidth: 100 }}
              >
                <option value="">Time Duration</option>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
            </div>
            <button
              className="flex items-center gap-2 text-white text-[13px] font-semibold px-5 py-3.5 transition-all hover:brightness-105 active:scale-[0.98] flex-shrink-0"
              style={{ background: "#F5831F" }}
            >
              <Search className="w-4 h-4" />
              Find Opportunities
            </button>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-medium text-[#9CA3AF] mr-1">Popular Searches:</span>
            {POPULAR.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="text-[12px] font-medium px-3 py-1 rounded-full transition-all"
                style={{
                  background: activeTag === tag ? "#F5831F" : "#F5F5F5",
                  color:      activeTag === tag ? "#fff"     : "#4B5563",
                  border:     activeTag === tag ? "1px solid #F5831F" : "1px solid #E5E7EB",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN — Image ── */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative" style={{ minHeight: 500 }}>
          {/* Organic blob */}
          <div
            className="absolute"
            style={{
              width: 440, height: 480,
              background: "linear-gradient(145deg, #FDEBD0 0%, #FDE8C2 60%, #FDDBA0 100%)",
              borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }}
          />
          
          {/* Image Container */}
          <div className="relative z-10 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#F5831F]/20 blur-3xl" />
              <div className="relative rounded-[40%_60%_55%_45%/45%_40%_60%_55%] overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="/hero2.png"
                  alt="Internlink marketplace"
                  className="h-[400px] lg:h-[450px] w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Floating: Verified Opportunities */}
          <div
            className="absolute right-2 top-16 z-20 bg-white flex items-start gap-3 px-4 py-3"
            style={{ borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.10)", minWidth: 180 }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: "#FFF0E0" }}>
              <BadgeCheck className="w-5 h-5 text-[#F5831F]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0D0D0D] leading-tight">Verified Opportunities</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Every listing is reviewed</p>
              <div className="flex items-center gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-[#F5831F] fill-[#F5831F]" />
                ))}
                <span className="text-[10px] text-[#9CA3AF] ml-1">4.9</span>
              </div>
            </div>
          </div>

          {/* Floating: Students placed */}
          <div
            className="absolute left-0 bottom-20 z-20 bg-white flex items-center gap-3 px-4 py-3"
            style={{ borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.10)" }}
          >
            <div className="flex -space-x-2">
              {["#F5831F", "#6366F1", "#10B981"].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: color, zIndex: 3 - i }}
                >
                  {["A", "B", "C"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0D0D0D] leading-tight">2,400+ Students</p>
              <p className="text-[11px] text-[#9CA3AF]">Placed this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ STATS BOTTOM BAR ══════════════ */}
      <div
        className="relative z-10 w-full"
        style={{ borderTop: "1.5px solid #F0ECE6", background: "#FAFAF9" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ value, label, Icon }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-6 px-6"
                style={{
                  borderRight: i < STATS.length - 1 ? "1.5px solid #F0ECE6" : "none",
                }}
              >
                {/* Icon box */}
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-xl"
                  style={{
                    width: 44, height: 44,
                    background: "linear-gradient(135deg, #FFF0E0 0%, #FFE4C4 100%)",
                    border: "1px solid #FDDBA0",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#F5831F" }} />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span
                    className="font-extrabold text-[#0D0D0D] leading-none"
                    style={{
                      fontSize: "1.55rem",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {value}
                  </span>
                  <span className="text-[12px] text-[#9CA3AF] mt-1 leading-tight font-medium">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}