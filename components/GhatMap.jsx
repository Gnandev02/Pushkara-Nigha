"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { MONITORED_GHATS } from "@/lib/ghats-data";

// ─── Risk color mapping ──────────────────────────────────────
function getRiskColor(risk) {
  if (risk === "safe") return { bg: "#10B981", ring: "rgba(16,185,129,0.45)", text: "#065F46" };
  if (risk === "moderate") return { bg: "#D97706", ring: "rgba(217,119,6,0.45)", text: "#92400E" };
  if (risk === "busy") return { bg: "#EA580C", ring: "rgba(234,88,12,0.45)", text: "#9A3412" };
  if (risk === "monitored" || risk === "blue" || risk === "ai") return { bg: "#2563EB", ring: "rgba(37,99,235,0.45)", text: "#1E3A8A" };
  return { bg: "#DC2626", ring: "rgba(220,38,38,0.5)", text: "#991B1B" };
}

// ─── Professional abstract light GIS map style ────────────────
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#F1F5F9" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748B" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F8FAFC" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#CBD5E1" }, { weight: 1 }] },
  { featureType: "administrative.province", stylers: [{ visibility: "on" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F8FAFC" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#BAE6FD" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#0369A1" }] }
];

const MAP_CENTER = { lat: 17.05, lng: 81.30 };
const MAP_OPTIONS = {
  styles: MAP_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  minZoom: 7,
  maxZoom: 15,
  gestureHandling: "greedy",
};

const CONTAINER_STYLE = { width: "100%", height: "100%" };

// ─── Marker Pulse Animation (CSS injected once) ──────────────
const PULSE_CSS = `
@keyframes ghat-marker-pulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  50%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(1);   opacity: 0; }
}
.ghat-marker-ring {
  animation: ghat-marker-pulse 2s ease-out infinite;
}
`;

// ─── Main Component ──────────────────────────────────────────
export default function GhatMap({ liveGhats, onGhatSelect }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBtu-pHBMT2MD-9O3zqMQRulSPyVQwtRyw",
  });

  const mapRef = useRef(null);
  const [selectedGhat, setSelectedGhat] = useState(null);
  const [hoveredGhat, setHoveredGhat] = useState(null);

  const ghatsToRender = liveGhats || MONITORED_GHATS;
  const activeSelectedGhat = selectedGhat ? ghatsToRender.find(g => g.id === selectedGhat.id) : null;

  // Inject pulse CSS once
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "ghat-marker-pulse-css";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = PULSE_CSS;
      document.head.appendChild(style);
    }
  }, []);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = useCallback((ghat) => {
    setSelectedGhat(ghat);
    if (onGhatSelect) onGhatSelect(ghat);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: ghat.lat, lng: ghat.lng });
      mapRef.current.setZoom(11);
    }
  }, [onGhatSelect]);

  // ── Loading / Error states ─────────────────────────────────
  if (loadError) {
    return (
      <div className="w-full h-full rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 p-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="font-semibold text-slate-800">Map failed to load</p>
        <p className="text-xs text-center max-w-xs">Set <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">.env</code> file.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-t-[#0D9488] border-slate-200 rounded-full animate-spin" />
          <span className="text-xs font-mono font-semibold">Loading Godavari Map...</span>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      center={MAP_CENTER}
      zoom={9}
      options={MAP_OPTIONS}
      onLoad={onLoad}
      onClick={() => setSelectedGhat(null)}
    >
      {/* ── Ghat Markers ──────────────────────────────────── */}
      {ghatsToRender.map((ghat) => {
        const crowd = Math.max(0, (ghat.inMen + ghat.inWomen + ghat.inOthers) - (ghat.outMen + ghat.outWomen + ghat.outOthers));
        const pct = ghat.capacity > 0 ? ((crowd / ghat.capacity) * 100).toFixed(1) : "0.0";
        const color = getRiskColor(ghat.risk);
        const isSelected = activeSelectedGhat?.id === ghat.id;
        const isHovered = hoveredGhat === ghat.id;
        const markerSize = isSelected ? 20 : isHovered ? 17 : 14;

        return (
          <OverlayView
            key={ghat.id}
            position={{ lat: ghat.lat, lng: ghat.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{ position: "relative", cursor: "pointer", transform: "translate(-50%, -50%)" }}
              onClick={(e) => { e.stopPropagation(); handleMarkerClick(ghat); }}
              onMouseEnter={() => setHoveredGhat(ghat.id)}
              onMouseLeave={() => setHoveredGhat(null)}
            >
              {/* Animated pulse ring */}
              <div
                className="ghat-marker-ring"
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: markerSize * 2, height: markerSize * 2,
                  marginTop: -markerSize, marginLeft: -markerSize,
                  borderRadius: "50%",
                  background: color.ring,
                  pointerEvents: "none",
                }}
              />

              {/* Core marker dot */}
              <div
                style={{
                  width: markerSize,
                  height: markerSize,
                  borderRadius: "50%",
                  background: color.bg,
                  border: `2px solid rgba(255,255,255,0.9)`,
                  boxShadow: `0 0 12px ${color.ring}, 0 0 4px rgba(0,0,0,0.4)`,
                  transition: "all 0.2s ease",
                  position: "relative",
                  zIndex: isSelected ? 30 : isHovered ? 20 : 10,
                }}
              />

              {/* Hover/Selected label */}
              {(isHovered || isSelected) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: markerSize + 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(255,255,255,0.98)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${color.bg}40`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    minWidth: 180,
                    zIndex: 50,
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.bg, flexShrink: 0 }} />
                    <span style={{ color: "#0F172A", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>{ghat.name}</span>
                  </div>
                  <div style={{ color: "#64748B", fontSize: 10, marginBottom: 6, fontFamily: "monospace" }}>
                    {ghat.districtFull}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                    <div style={{ color: "#94A3B8", fontSize: 9, fontWeight: 600 }}>CROWD</div>
                    <div style={{ color: "#0F172A", fontSize: 11, fontWeight: 800, fontFamily: "monospace", textAlign: "right" }}>{crowd.toLocaleString()}</div>
                    <div style={{ color: "#94A3B8", fontSize: 9, fontWeight: 600 }}>OCCUPANCY</div>
                    <div style={{ color: color.bg, fontSize: 11, fontWeight: 800, fontFamily: "monospace", textAlign: "right" }}>{pct}%</div>
                    <div style={{ color: "#94A3B8", fontSize: 9, fontWeight: 600 }}>CAMERAS</div>
                    <div style={{ color: "#0F172A", fontSize: 11, fontWeight: 800, fontFamily: "monospace", textAlign: "right" }}>{ghat.camerasCount}</div>
                    <div style={{ color: "#94A3B8", fontSize: 9, fontWeight: 600 }}>RISK</div>
                    <div style={{ fontSize: 9, fontWeight: 800, textAlign: "right", textTransform: "uppercase", color: color.bg }}>{ghat.risk}</div>
                  </div>
                  {/* Arrow */}
                  <div style={{
                    position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                    borderTop: "6px solid rgba(15,23,42,0.95)",
                  }} />
                </div>
              )}
            </div>
          </OverlayView>
        );
      })}

      {/* ── Selected ghat info card ───────────────────────── */}
      {activeSelectedGhat && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              maxWidth: 380,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderRadius: 12,
              border: `1px solid ${getRiskColor(activeSelectedGhat.risk).bg}30`,
              padding: "16px 20px",
              zIndex: 100,
              color: "#0F172A",
            }}
          >
            {(() => {
              const g = activeSelectedGhat;
              const crowd = Math.max(0, (g.inMen + g.inWomen + g.inOthers) - (g.outMen + g.outWomen + g.outOthers));
              const pct = g.capacity > 0 ? ((crowd / g.capacity) * 100).toFixed(1) : "0.0";
              const color = getRiskColor(g.risk);
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.3, color: "#0F172A" }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: "#64748B", fontFamily: "monospace", marginTop: 2 }}>{g.districtFull}</div>
                    </div>
                    <div style={{
                      background: `${color.bg}15`, color: color.bg,
                      fontSize: 9, fontWeight: 800, padding: "4px 10px",
                      borderRadius: 6, textTransform: "uppercase", letterSpacing: 1,
                    }}>
                      {g.risk}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
                    {[
                      { label: "Live Crowd", value: crowd.toLocaleString(), clr: "#0F172A" },
                      { label: "Occupancy", value: `${pct}%`, clr: color.bg },
                      { label: "Capacity", value: g.capacity.toLocaleString(), clr: "#64748B" },
                      { label: "Cameras", value: String(g.camerasCount), clr: "#0D9488" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "monospace", color: s.clr }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Occupancy bar */}
                  <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: `linear-gradient(90deg, ${color.bg}, ${color.bg}CC)`,
                      width: `${Math.min(100, parseFloat(pct))}%`,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 9, color: "#64748B", fontFamily: "monospace" }}>AI Prediction: {g.aiTrend}</span>
                    <span style={{ fontSize: 9, color: "#64748B", fontFamily: "monospace" }}>{g.lastUpdated}</span>
                  </div>
                  <button
                    onClick={() => setSelectedGhat(null)}
                    style={{
                      position: "absolute", top: 10, right: 12,
                      background: "rgba(0,0,0,0.05)", border: "none",
                      borderRadius: 6, width: 24, height: 24,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#64748B", cursor: "pointer", fontSize: 14,
                    }}
                  >
                    ×
                  </button>
                </>
              );
            })()}
          </div>
      )}
    </GoogleMap>
  );
}
