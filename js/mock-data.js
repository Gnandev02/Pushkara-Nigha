// Pushkara Crowd Command Center - Global Telemetry Database
// Contains exactly 12 Monitored Sectors grouped under 3 Districts

const MONITORED_GHATS = [
    // --- EAST GODAVARI DISTRICT ---
    {
        id: "ghat-dowleswaram",
        name: "Dowleswaram Ghat",
        district: "East Godavari",
        districtFull: "East Godavari - Dowleswaram",
        occupancy: 4500,
        capacity: 8000,
        risk: "busy",
        trend: "up",
        camerasCount: 24,
        sensorsOnline: 12,
        crowdDensity: 56.2,
        lastUpdated: "Just Now",
        coordinates: { x: 42, y: 20 },
        anomaliesDetected: 1,
        safetyStatus: "Verbal warning broadcasts active",
        inMen: 2500, inWomen: 2300, inOthers: 200,
        outMen: 300, outWomen: 150, outOthers: 50,
        camInId: "CAM-IN-DOWL-01", camOutId: "CAM-OUT-DOWL-01",
        aiTrend: "Peak projected in 15m"
    },
    {
        id: "ghat-goshpada",
        name: "Goshpada Ghat",
        district: "East Godavari",
        districtFull: "East Godavari - Goshpada",
        occupancy: 2800,
        capacity: 6500,
        risk: "moderate",
        trend: "stable",
        camerasCount: 18,
        sensorsOnline: 8,
        crowdDensity: 43.1,
        lastUpdated: "Just Now",
        coordinates: { x: 48, y: 28 },
        anomaliesDetected: 0,
        safetyStatus: "Nominal flow bounds",
        inMen: 1500, inWomen: 1600, inOthers: 100,
        outMen: 200, outWomen: 150, outOthers: 50,
        camInId: "CAM-IN-GOSH-01", camOutId: "CAM-OUT-GOSH-01",
        aiTrend: "Flow velocity normal"
    },
    {
        id: "ghat-kotipalli",
        name: "Kotipalli Ghat",
        district: "East Godavari",
        districtFull: "East Godavari - Kotipalli",
        occupancy: 1200,
        capacity: 5000,
        risk: "safe",
        trend: "down",
        camerasCount: 12,
        sensorsOnline: 6,
        crowdDensity: 24.0,
        lastUpdated: "3 mins ago",
        coordinates: { x: 55, y: 35 },
        anomaliesDetected: 0,
        safetyStatus: "Safe clearance capacity margins",
        inMen: 800, inWomen: 700, inOthers: 50,
        outMen: 200, outWomen: 100, outOthers: 50,
        camInId: "CAM-IN-KOTI-01", camOutId: "CAM-OUT-KOTI-01",
        aiTrend: "Low density clearance"
    },
    {
        id: "ghat-pushkar",
        name: "Pushkar Ghat",
        district: "East Godavari",
        districtFull: "East Godavari - Rajamahendravaram",
        occupancy: 7200,
        capacity: 9000,
        risk: "busy",
        trend: "stable",
        camerasCount: 36,
        sensorsOnline: 18,
        crowdDensity: 80.0,
        lastUpdated: "Just Now",
        coordinates: { x: 50, y: 12 },
        anomaliesDetected: 2,
        safetyStatus: "Entry gating controls recommended",
        inMen: 4200, inWomen: 4000, inOthers: 300,
        outMen: 800, outWomen: 400, outOthers: 100,
        camInId: "CAM-IN-PUSH-01", camOutId: "CAM-OUT-PUSH-01",
        aiTrend: "Steady flow projected"
    },

    // --- WEST GODAVARI DISTRICT ---
    {
        id: "ghat-kovvur",
        name: "Kovvur Ghat",
        district: "West Godavari",
        districtFull: "West Godavari - Kovvur",
        occupancy: 4800,
        capacity: 7500,
        risk: "busy",
        trend: "up",
        camerasCount: 22,
        sensorsOnline: 10,
        crowdDensity: 64.0,
        lastUpdated: "Just Now",
        coordinates: { x: 62, y: 48 },
        anomaliesDetected: 0,
        safetyStatus: "Monitoring inflow streams",
        inMen: 2800, inWomen: 2600, inOthers: 150,
        outMen: 400, outWomen: 300, outOthers: 50,
        camInId: "CAM-IN-KOVV-01", camOutId: "CAM-OUT-KOVV-01",
        aiTrend: "Devotee inflow rising"
    },
    {
        id: "ghat-narasapuram",
        name: "Narasapuram Ghat",
        district: "West Godavari",
        districtFull: "West Godavari - Narasapuram",
        occupancy: 1500,
        capacity: 6000,
        risk: "safe",
        trend: "stable",
        camerasCount: 14,
        sensorsOnline: 8,
        crowdDensity: 25.0,
        lastUpdated: "Just Now",
        coordinates: { x: 68, y: 56 },
        anomaliesDetected: 0,
        safetyStatus: "Monitoring normal flow levels",
        inMen: 1000, inWomen: 900, inOthers: 50,
        outMen: 250, outWomen: 150, outOthers: 50,
        camInId: "CAM-IN-NARA-01", camOutId: "CAM-OUT-NARA-01",
        aiTrend: "Monitoring stable"
    },
    {
        id: "ghat-pattiseema",
        name: "Pattiseema Ghat",
        district: "West Godavari",
        districtFull: "West Godavari - Pattiseema",
        occupancy: 5400,
        capacity: 7000,
        risk: "busy",
        trend: "up",
        camerasCount: 28,
        sensorsOnline: 12,
        crowdDensity: 77.1,
        lastUpdated: "3 mins ago",
        coordinates: { x: 78, y: 72 },
        anomaliesDetected: 1,
        safetyStatus: "Diversion routing active",
        inMen: 3200, inWomen: 3000, inOthers: 100,
        outMen: 500, outWomen: 350, outOthers: 50,
        camInId: "CAM-IN-PATT-01", camOutId: "CAM-OUT-PATT-01",
        aiTrend: "Flow vector stable"
    },
    {
        id: "ghat-siddhantam",
        name: "Siddhantam Ghat",
        district: "West Godavari",
        districtFull: "West Godavari - Siddhantam",
        occupancy: 1100,
        capacity: 5500,
        risk: "safe",
        trend: "down",
        camerasCount: 10,
        sensorsOnline: 5,
        crowdDensity: 20.0,
        lastUpdated: "Just Now",
        coordinates: { x: 72, y: 64 },
        anomaliesDetected: 0,
        safetyStatus: "Clear access gates",
        inMen: 700, inWomen: 600, inOthers: 50,
        outMen: 150, outWomen: 80, outOthers: 20,
        camInId: "CAM-IN-SIDD-01", camOutId: "CAM-OUT-SIDD-01",
        aiTrend: "Standard flow index"
    },

    // --- KHAMMAM DISTRICT ---
    {
        id: "ghat-bhadrachalam",
        name: "Bhadrachalam Main Ghat",
        district: "Khammam",
        districtFull: "Khammam - Bhadrachalam",
        occupancy: 5920,
        capacity: 7500,
        risk: "busy",
        trend: "up",
        camerasCount: 34,
        sensorsOnline: 14,
        crowdDensity: 78.9,
        lastUpdated: "2 mins ago",
        coordinates: { x: 78, y: 30 },
        anomaliesDetected: 1,
        safetyStatus: "Crowd routing advisory active",
        inMen: 3500, inWomen: 3200, inOthers: 150,
        outMen: 500, outWomen: 350, outOthers: 80,
        camInId: "CAM-IN-BHAD-01", camOutId: "CAM-OUT-BHAD-01",
        aiTrend: "Bathing steps density elevated"
    },
    {
        id: "ghat-edugurallapalli",
        name: "Edugurallapalli Ghat",
        district: "Khammam",
        districtFull: "Khammam - Edugurallapalli",
        occupancy: 950,
        capacity: 5000,
        risk: "safe",
        trend: "stable",
        camerasCount: 8,
        sensorsOnline: 4,
        crowdDensity: 19.0,
        lastUpdated: "Just Now",
        coordinates: { x: 82, y: 22 },
        anomaliesDetected: 0,
        safetyStatus: "Nominal operation parameters",
        inMen: 600, inWomen: 550, inOthers: 30,
        outMen: 120, outWomen: 80, outOthers: 30,
        camInId: "CAM-IN-EDUG-01", camOutId: "CAM-OUT-EDUG-01",
        aiTrend: "Safe flow margins"
    },
    {
        id: "ghat-koonavaram",
        name: "Koonavaram Ghat",
        district: "Khammam",
        districtFull: "Khammam - Koonavaram",
        occupancy: 2100,
        capacity: 6000,
        risk: "moderate",
        trend: "stable",
        camerasCount: 16,
        sensorsOnline: 8,
        crowdDensity: 35.0,
        lastUpdated: "5 mins ago",
        coordinates: { x: 86, y: 38 },
        anomaliesDetected: 0,
        safetyStatus: "Monitoring confluence flow status",
        inMen: 1200, inWomen: 1100, inOthers: 100,
        outMen: 180, outWomen: 100, outOthers: 20,
        camInId: "CAM-IN-KOON-01", camOutId: "CAM-OUT-KOON-01",
        aiTrend: "Steady volume index"
    },
    {
        id: "ghat-seetharama",
        name: "Seetharama Ghat",
        district: "Khammam",
        districtFull: "Khammam - Seetharama",
        occupancy: 5100,
        capacity: 7000,
        risk: "busy",
        trend: "up",
        camerasCount: 24,
        sensorsOnline: 12,
        crowdDensity: 72.9,
        lastUpdated: "Just Now",
        coordinates: { x: 90, y: 45 },
        anomaliesDetected: 1,
        safetyStatus: "Advisory routing active",
        inMen: 3000, inWomen: 2800, inOthers: 100,
        outMen: 400, outWomen: 350, outOthers: 50,
        camInId: "CAM-IN-SEET-01", camOutId: "CAM-OUT-SEET-01",
        aiTrend: "Advisory routing active"
    }
];

const CCTV_FEEDS = [
    {
        id: "CAM-IN-DOWL-01",
        location: "Dowleswaram - Barrage Entrance Plaza",
        resolution: "4K UHD @ 30FPS",
        peopleCount: 254,
        densityLabel: "Elevated",
        aiDetections: ["Pedestrian queuing active", "Plaza cluster"],
        riskLevel: "busy",
        feedStatus: "online",
        boundingBoxes: [
            { x: 30, y: 50, w: 140, h: 160, label: "Queue overload 74%" }
        ]
    },
    {
        id: "CAM-IN-BHAD-01",
        location: "Bhadrachalam Main - Bathing Stairs",
        resolution: "1080p HD @ 60FPS",
        peopleCount: 385,
        densityLabel: "High Density",
        aiDetections: ["Bathing stairs congestion threshold hit"],
        riskLevel: "busy",
        feedStatus: "online",
        boundingBoxes: [
            { x: 80, y: 60, w: 220, h: 130, label: "Stair cluster 82%" }
        ]
    },
    {
        id: "CAM-IN-PUSH-01",
        location: "Pushkar Ghat - Entrance Gateway",
        resolution: "4K UHD @ 30FPS",
        peopleCount: 198,
        densityLabel: "Elevated",
        aiDetections: ["Devotee flow constant"],
        riskLevel: "busy",
        feedStatus: "online",
        boundingBoxes: []
    },
    {
        id: "CAM-IN-KOVV-01",
        location: "Kovvur Ghat - Access Platform",
        resolution: "1080p HD @ 60FPS",
        peopleCount: 142,
        densityLabel: "Moderate",
        aiDetections: ["Nominal platform pacing"],
        riskLevel: "moderate",
        feedStatus: "online",
        boundingBoxes: []
    }
];

const INCIDENT_LOGS = [
    {
        id: "INC-2026-981",
        time: "15:52:14",
        location: "Pushkar Ghat",
        category: "Crowd Bottleneck",
        severity: "warning",
        description: "AI vision detected gate approach capacity nearing 80%. Entry rate modulation active.",
        status: "dispatched",
        assignedUnit: "Rapid Response Team Alpha"
    },
    {
        id: "INC-2026-980",
        time: "15:48:30",
        location: "Bhadrachalam Main Ghat",
        category: "Flow Stagnation",
        severity: "warning",
        description: "Devotee pedestrian velocity dropped below 0.3m/s on lower bathing steps. PA advisory issued.",
        status: "pending",
        assignedUnit: "Station Command Speaker System"
    },
    {
        id: "INC-2026-979",
        time: "15:15:00",
        location: "Dowleswaram Ghat",
        category: "Entry Overflow",
        severity: "moderate",
        description: "Minor queue spillover at gate 2. Resolved via auxiliary platform routing.",
        status: "resolved",
        assignedUnit: "Patrol Team 4"
    },
    {
        id: "INC-2026-978",
        time: "14:42:10",
        location: "Kotipalli Ghat",
        category: "Routine Check",
        severity: "moderate",
        description: "Standard density check complete. All bathing and plaza areas operating safely.",
        status: "resolved",
        assignedUnit: "Local Command Guard"
    }
];

const WEATHER_TELEMETRY = {
    temp: "34°C",
    condition: "Partly Cloudy",
    humidity: "68%",
    wind: "12 km/h SE",
    waterLevel: "Safe (+0.38m)",
    safetyAlert: "No severe weather alerts active for Godavari corridor."
};

const AI_RECOMMENDATIONS = [
    {
        id: "rec-1",
        title: "Preemptive Gating at Pushkar",
        desc: "Neural network predicts occupancy to hit 92% at Rajamahendravaram corridor in 25 mins. Advise gate throttle.",
        confidence: "91.8%",
        icon: "shield-alert"
    },
    {
        id: "rec-2",
        title: "Re-route Bhadrachalam Stairs",
        desc: "High density hotspots forming near lower steps. Recommend directional rerouting to auxiliary bath access.",
        confidence: "87.3%",
        icon: "git-branch"
    },
    {
        id: "rec-3",
        title: "Capacity Alerts at Pattiseema",
        desc: "West Godavari evening devotee wave incoming. Preemptively dispatch alert units to buffer zones.",
        confidence: "82.1%",
        icon: "construction"
    }
];

const SYSTEM_STATUS = {
    totalMonitoredGhats: 12,
    activeFeeds: 24,
    onlineSensors: 112,
    incidentsResolvedToday: 18,
    citizenReportsReceived: 96,
    aiModelAccuracy: "97.4%",
    inferenceLatency: "38ms"
};

window.SmartCityTelemetry = {
    MONITORED_GHATS,
    CCTV_FEEDS,
    INCIDENT_LOGS,
    WEATHER_TELEMETRY,
    AI_RECOMMENDATIONS,
    SYSTEM_STATUS
};
