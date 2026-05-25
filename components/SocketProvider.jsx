"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [summary, setSummary] = useState({
    totalPeople: 0,
    uniquePeople: 0,
    maleCount: 0,
    femaleCount: 0,
    unknownGender: 0,
    averageRisk: 0,
    activeCameras: 0,
    totalCameras: 0,
  });

  // 1. Initial Load of historical analytics, cameras, and alerts
  const fetchData = async () => {
    try {
      // Fetch cameras
      const camRes = await fetch("/api/cameras");
      const camData = await camRes.json();
      if (camData.success) {
        setCameras(camData.cameras);
        
        // Map initial analytics per camera
        const initialAnalytics = {};
        camData.cameras.forEach(cam => {
          if (cam.peopleCount !== undefined) {
            initialAnalytics[cam.cameraId] = {
              cameraId: cam.cameraId,
              totalPeople: cam.peopleCount,
              uniquePeople: cam.uniquePeople,
              riskScore: cam.riskScore,
              density: cam.density,
              maleCount: cam.genderBreakdown.male,
              femaleCount: cam.genderBreakdown.female,
              unknownGender: cam.genderBreakdown.unknown,
              name: cam.name,
              location: cam.location
            };
          }
        });
        setAnalytics(initialAnalytics);
      }

      // Fetch summary & history
      const analyticsRes = await fetch("/api/analytics?limit=1");
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success && analyticsData.summary) {
        setSummary(analyticsData.summary);
      }

      // Fetch active alerts
      const alertRes = await fetch("/api/alerts?resolved=false");
      const alertData = await alertRes.json();
      if (alertData.success) {
        setAlerts(alertData.alerts);
      }
    } catch (err) {
      console.error("Error bootstrapping initial telemetry data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // 2. Initialize Socket.IO connection
    const socketConn = io(window.location.origin, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketConn.on("connect", () => {
      console.log("📡 Connected to Socket.IO Event Broadcast Server");
      setSocket(socketConn);
    });

    // Handle real-time analytics updates from app.py
    socketConn.on("analytics_update", (data) => {
      // Update analytics record state map
      setAnalytics(prev => ({
        ...prev,
        [data.cameraId]: {
          ...prev[data.cameraId],
          ...data,
          totalPeople: data.totalPeople,
          uniquePeople: data.uniquePeople,
          riskScore: data.riskScore,
          density: data.density,
          maleCount: data.maleCount,
          femaleCount: data.femaleCount,
          unknownGender: data.unknownGender
        }
      }));

      // Recalculate summary live
      setAnalytics(current => {
        let total = 0;
        let unique = 0;
        let male = 0;
        let female = 0;
        let unknown = 0;
        let sumRisk = 0;
        const keys = Object.keys(current);

        keys.forEach(k => {
          const item = current[k];
          total += item.totalPeople || 0;
          unique += item.uniquePeople || 0;
          male += item.maleCount || 0;
          female += item.femaleCount || 0;
          unknown += item.unknownGender || 0;
          sumRisk += item.riskScore || 0;
        });

        setSummary(prev => ({
          ...prev,
          totalPeople: total,
          uniquePeople: unique,
          maleCount: male,
          femaleCount: female,
          unknownGender: unknown,
          averageRisk: keys.length > 0 ? parseFloat((sumRisk / keys.length).toFixed(4)) : 0
        }));

        return current;
      });
    });

    // Handle live alert triggers
    socketConn.on("alert_trigger", (newAlert) => {
      setAlerts(prev => {
        // Prevent duplicate alerts in live UI list
        if (prev.some(a => a.id === newAlert.id)) return prev;
        return [newAlert, ...prev];
      });
    });

    // Handle real-time resolved alerts
    socketConn.on("alert_resolved", (resolvedAlert) => {
      setAlerts(prev => prev.filter(a => a.id !== resolvedAlert.id));
    });

    return () => {
      if (socketConn) {
        socketConn.disconnect();
      }
    };
  }, []);

  // Resolve alert function
  const resolveAlert = async (alertId) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alertId, resolved: true }),
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  const value = {
    socket,
    analytics,
    alerts,
    cameras,
    summary,
    fetchData,
    resolveAlert
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
