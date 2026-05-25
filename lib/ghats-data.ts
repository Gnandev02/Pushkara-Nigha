// Pushkara Nigha - 12 Monitored Ghats across 3 Districts
// TypeScript constants mirroring js/mock-data.js for use in Next.js pages

export interface GhatData {
  id: string;
  name: string;
  district: string;
  districtFull: string;
  occupancy: number;
  capacity: number;
  risk: "safe" | "moderate" | "busy" | "critical";
  trend: "up" | "down" | "stable";
  camerasCount: number;
  crowdDensity: number;
  lastUpdated: string;
  inMen: number;
  inWomen: number;
  inOthers: number;
  outMen: number;
  outWomen: number;
  outOthers: number;
  camInId: string;
  camOutId: string;
  aiTrend: string;
}

export const MONITORED_GHATS: GhatData[] = [
  // --- EAST GODAVARI DISTRICT ---
  {
    id: "ghat-dowleswaram",
    name: "Dowleswaram Ghat",
    district: "East Godavari",
    districtFull: "East Godavari – Dowleswaram",
    occupancy: 4500, capacity: 8000, risk: "busy", trend: "up",
    camerasCount: 24, crowdDensity: 56.2, lastUpdated: "Just Now",
    inMen: 2500, inWomen: 2300, inOthers: 200,
    outMen: 300, outWomen: 150, outOthers: 50,
    camInId: "CAM-IN-DOWL-01", camOutId: "CAM-OUT-DOWL-01",
    aiTrend: "Peak projected in 15m",
  },
  {
    id: "ghat-goshpada",
    name: "Goshpada Ghat",
    district: "East Godavari",
    districtFull: "East Godavari – Goshpada",
    occupancy: 2800, capacity: 6500, risk: "moderate", trend: "stable",
    camerasCount: 18, crowdDensity: 43.1, lastUpdated: "Just Now",
    inMen: 1500, inWomen: 1600, inOthers: 100,
    outMen: 200, outWomen: 150, outOthers: 50,
    camInId: "CAM-IN-GOSH-01", camOutId: "CAM-OUT-GOSH-01",
    aiTrend: "Flow velocity normal",
  },
  {
    id: "ghat-kotipalli",
    name: "Kotipalli Ghat",
    district: "East Godavari",
    districtFull: "East Godavari – Kotipalli",
    occupancy: 1200, capacity: 5000, risk: "safe", trend: "down",
    camerasCount: 12, crowdDensity: 24.0, lastUpdated: "3 mins ago",
    inMen: 800, inWomen: 700, inOthers: 50,
    outMen: 200, outWomen: 100, outOthers: 50,
    camInId: "CAM-IN-KOTI-01", camOutId: "CAM-OUT-KOTI-01",
    aiTrend: "Low density clearance",
  },
  {
    id: "ghat-pushkar",
    name: "Pushkar Ghat",
    district: "East Godavari",
    districtFull: "East Godavari – Rajamahendravaram",
    occupancy: 7200, capacity: 9000, risk: "busy", trend: "stable",
    camerasCount: 36, crowdDensity: 80.0, lastUpdated: "Just Now",
    inMen: 4200, inWomen: 4000, inOthers: 300,
    outMen: 800, outWomen: 400, outOthers: 100,
    camInId: "CAM-IN-PUSH-01", camOutId: "CAM-OUT-PUSH-01",
    aiTrend: "Steady flow projected",
  },
  // --- WEST GODAVARI DISTRICT ---
  {
    id: "ghat-kovvur",
    name: "Kovvur Ghat",
    district: "West Godavari",
    districtFull: "West Godavari – Kovvur",
    occupancy: 4800, capacity: 7500, risk: "busy", trend: "up",
    camerasCount: 22, crowdDensity: 64.0, lastUpdated: "Just Now",
    inMen: 2800, inWomen: 2600, inOthers: 150,
    outMen: 400, outWomen: 300, outOthers: 50,
    camInId: "CAM-IN-KOVV-01", camOutId: "CAM-OUT-KOVV-01",
    aiTrend: "Devotee inflow rising",
  },
  {
    id: "ghat-narasapuram",
    name: "Narasapuram Ghat",
    district: "West Godavari",
    districtFull: "West Godavari – Narasapuram",
    occupancy: 1500, capacity: 6000, risk: "safe", trend: "stable",
    camerasCount: 14, crowdDensity: 25.0, lastUpdated: "Just Now",
    inMen: 1000, inWomen: 900, inOthers: 50,
    outMen: 250, outWomen: 150, outOthers: 50,
    camInId: "CAM-IN-NARA-01", camOutId: "CAM-OUT-NARA-01",
    aiTrend: "Monitoring stable",
  },
  {
    id: "ghat-pattiseema",
    name: "Pattiseema Ghat",
    district: "West Godavari",
    districtFull: "West Godavari – Pattiseema",
    occupancy: 5400, capacity: 7000, risk: "busy", trend: "up",
    camerasCount: 28, crowdDensity: 77.1, lastUpdated: "3 mins ago",
    inMen: 3200, inWomen: 3000, inOthers: 100,
    outMen: 500, outWomen: 350, outOthers: 50,
    camInId: "CAM-IN-PATT-01", camOutId: "CAM-OUT-PATT-01",
    aiTrend: "Flow vector stable",
  },
  {
    id: "ghat-siddhantam",
    name: "Siddhantam Ghat",
    district: "West Godavari",
    districtFull: "West Godavari – Siddhantam",
    occupancy: 1100, capacity: 5500, risk: "safe", trend: "down",
    camerasCount: 10, crowdDensity: 20.0, lastUpdated: "Just Now",
    inMen: 700, inWomen: 600, inOthers: 50,
    outMen: 150, outWomen: 80, outOthers: 20,
    camInId: "CAM-IN-SIDD-01", camOutId: "CAM-OUT-SIDD-01",
    aiTrend: "Standard flow index",
  },
  // --- KHAMMAM DISTRICT ---
  {
    id: "ghat-bhadrachalam",
    name: "Bhadrachalam Main Ghat",
    district: "Khammam",
    districtFull: "Khammam – Bhadrachalam",
    occupancy: 5920, capacity: 7500, risk: "busy", trend: "up",
    camerasCount: 34, crowdDensity: 78.9, lastUpdated: "2 mins ago",
    inMen: 3500, inWomen: 3200, inOthers: 150,
    outMen: 500, outWomen: 350, outOthers: 80,
    camInId: "CAM-IN-BHAD-01", camOutId: "CAM-OUT-BHAD-01",
    aiTrend: "Bathing steps density elevated",
  },
  {
    id: "ghat-edugurallapalli",
    name: "Edugurallapalli Ghat",
    district: "Khammam",
    districtFull: "Khammam – Edugurallapalli",
    occupancy: 950, capacity: 5000, risk: "safe", trend: "stable",
    camerasCount: 8, crowdDensity: 19.0, lastUpdated: "Just Now",
    inMen: 600, inWomen: 550, inOthers: 30,
    outMen: 120, outWomen: 80, outOthers: 30,
    camInId: "CAM-IN-EDUG-01", camOutId: "CAM-OUT-EDUG-01",
    aiTrend: "Safe flow margins",
  },
  {
    id: "ghat-koonavaram",
    name: "Koonavaram Ghat",
    district: "Khammam",
    districtFull: "Khammam – Koonavaram",
    occupancy: 2100, capacity: 6000, risk: "moderate", trend: "stable",
    camerasCount: 16, crowdDensity: 35.0, lastUpdated: "5 mins ago",
    inMen: 1200, inWomen: 1100, inOthers: 100,
    outMen: 180, outWomen: 100, outOthers: 20,
    camInId: "CAM-IN-KOON-01", camOutId: "CAM-OUT-KOON-01",
    aiTrend: "Steady volume index",
  },
  {
    id: "ghat-seetharama",
    name: "Seetharama Ghat",
    district: "Khammam",
    districtFull: "Khammam – Seetharama",
    occupancy: 5100, capacity: 7000, risk: "busy", trend: "up",
    camerasCount: 24, crowdDensity: 72.9, lastUpdated: "Just Now",
    inMen: 3000, inWomen: 2800, inOthers: 100,
    outMen: 400, outWomen: 350, outOthers: 50,
    camInId: "CAM-IN-SEET-01", camOutId: "CAM-OUT-SEET-01",
    aiTrend: "Advisory routing active",
  },
];

export const DISTRICTS = ["East Godavari", "West Godavari", "Khammam"] as const;

export function getGhatsByDistrict() {
  const grouped: Record<string, GhatData[]> = {};
  DISTRICTS.forEach(d => { grouped[d] = []; });
  MONITORED_GHATS.forEach(g => {
    if (grouped[g.district]) grouped[g.district].push(g);
  });
  return grouped;
}

export function getRiskColor(risk: string) {
  switch (risk) {
    case "safe": return "#10B981";
    case "moderate": return "#D97706";
    case "busy": return "#EA580C";
    case "critical": return "#DC2626";
    default: return "#94A3B8";
  }
}

export function getZoneLabel(density: number) {
  if (density < 30) return "OPEN ZONE";
  if (density <= 65) return "CROWDED";
  return "HIGHLY CROWDED";
}

export function getRiskLabel(density: number) {
  if (density < 30) return "safe";
  if (density <= 50) return "safe";
  if (density <= 65) return "warn";
  if (density <= 88) return "busy";
  return "crit";
}
