"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  Video, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Play,
  StopCircle,
  Camera as CameraIcon,
  MapPin,
  HelpCircle,
  FileCheck
} from "lucide-react";

export default function Cameras() {
  const { cameras, fetchData } = useSocket();
  const [cameraId, setCameraId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  
  // Webcam test streamer states
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const webcamVideoRef = useRef(null);
  const webcamIntervalRef = useRef(null);
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cameraId || !name || !location) {
      setFormStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });
    
    try {
      const res = await fetch("/api/cameras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId: cameraId.trim().toLowerCase().replace(/\s+/g, "_"),
          name: name.trim(),
          location: location.trim(),
          rtspUrl: rtspUrl.trim() || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus({ type: "success", message: "Camera registered to AI pipeline successfully!" });
        setCameraId("");
        setName("");
        setLocation("");
        setRtspUrl("");
        fetchData(); // reload
      } else {
        setFormStatus({ type: "error", message: data.message || "Failed to register camera." });
      }
    } catch (err) {
      console.error(err);
      setFormStatus({ type: "error", message: "Network connection error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Webcam Mock Stream Logic
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setWebcamStream(stream);
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      setIsWebcamActive(true);

      // Registers a webcam camera in database if it doesn't exist
      await fetch("/api/cameras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId: "local_webcam",
          name: "ICCC Local Webcam Stream",
          location: "Command Center Desk 1",
          rtspUrl: "webcam://stream"
        })
      });
      fetchData();

      // Begin Mocking AI Telemetry POSTs to testing API /api/update!
      webcamIntervalRef.current = setInterval(async () => {
        // Generate mock YOLO evaluations
        const total = Math.floor(Math.random() * 20) + 1; // 1 to 20 people
        const unique = total + Math.floor(Math.random() * 5);
        const male = Math.floor(total * 0.55);
        const female = Math.floor(total * 0.40);
        const unknown = total - male - female;
        const risk = parseFloat((total > 15 ? 0.75 + Math.random() * 0.15 : 0.15 + Math.random() * 0.2).toFixed(2));

        try {
          await fetch("/api/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              camera_id: "local_webcam",
              total_people: total,
              unique_people: unique,
              male_count: male,
              female_count: female,
              unknown_gender: unknown,
              risk_score: risk
            })
          });
        } catch (err) {
          console.error("Mock post failed:", err);
        }
      }, 2500);

    } catch (err) {
      console.error("Webcam trigger failed:", err);
      alert("Could not access local webcam. Please check browser permissions.");
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
    }
    if (webcamIntervalRef.current) {
      clearInterval(webcamIntervalRef.current);
    }
    setWebcamStream(null);
    setIsWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      if (webcamIntervalRef.current) {
        clearInterval(webcamIntervalRef.current);
      }
    };
  }, [webcamStream]);

  return (
    <div className="dashboard-content font-mono">
      {/* Header */}
      <div className="gov-header-card">
        <div className="gov-header-left">
          <div className="gov-header-title-container">
            <span className="gov-header-subtitle">ICCC FEED CONFIGURATIONS</span>
            <h1 className="gov-header-title flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-400" />
              Camera Pipeline Management
            </h1>
          </div>
        </div>
        <div className="gov-header-right">
          <span className="gov-sync-badge">✦ Core Telemetry Active</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Camera list & Webcam simulator */}
        <div className="left-panel-stack">
          {/* Active Cameras Status Grid */}
          <div className="dashboard-card">
            <div className="card-header-row mb-4">
              <div className="card-title-group flex items-center gap-2">
                <div className="card-icon-container" style={{ color: "var(--primary)" }}>
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="card-heading">Registered Camera Inputs</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Active camera streams inside AI pipeline</span>
                </div>
              </div>
              <span className="district-badge safe font-bold">{cameras.length} TOTAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {cameras.map((cam) => {
                let riskClass = "safe";
                if (cam.status === "critical") riskClass = "critical";
                else if (cam.status === "warning") riskClass = "busy";
                else if (cam.status === "moderate") riskClass = "moderate";

                return (
                  <div key={cam.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">{cam.cameraId}</span>
                        <span className={`table-risk-badge ${riskClass} font-bold px-2 py-0.5 rounded capitalize`}>
                          {cam.status}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm mt-3 tracking-wide">{cam.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cam.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono truncate max-w-[180px]" title={cam.rtspUrl}>
                        {cam.rtspUrl ? cam.rtspUrl : "Simulated AI Feed"}
                      </span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-teal-400">
                        {cam.peopleCount} devotees
                      </span>
                    </div>
                  </div>
                );
              })}
              {cameras.length === 0 && (
                <div className="col-span-2 py-8 text-center text-slate-500">
                  No active camera feeds registered in the database pipeline yet.
                </div>
              )}
            </div>
          </div>

          {/* Local Device Webcam Simulator Card */}
          <div className="dashboard-card relative overflow-hidden">
            <h3 className="card-heading flex items-center gap-2 mb-2">
              <CameraIcon className="w-4 h-4 text-teal-400" />
              Command Center WebCam Stream (Simulator Mode)
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Demonstrate the platform's capabilities instantly. Activating your webcam stream evaluates mock YOLO crowd telemetry in your browser and posts updates straight to your API routes!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-44 rounded-xl border border-dashed border-slate-800 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {isWebcamActive ? (
                  <video 
                    ref={webcamVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <CameraIcon className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                    <span className="text-xs text-slate-500 mt-2 block font-mono">Stream Standby</span>
                  </div>
                )}
                {isWebcamActive && (
                  <div className="absolute top-3 left-3 bg-red-500/20 text-red-400 text-[9px] font-extrabold font-mono tracking-widest border border-red-500/30 px-2 py-0.5 rounded animate-pulse">
                    LIVE STREAMING
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider block">PIPELINE NODE</span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">local_webcam</span>
                </div>
                {!isWebcamActive ? (
                  <button
                    onClick={startWebcam}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Activate Webcam Feed
                  </button>
                ) : (
                  <button
                    onClick={stopWebcam}
                    className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/30 font-extrabold tracking-widest text-xs font-mono uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    <StopCircle className="w-4 h-4" />
                    Shutdown Stream Node
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="right-sidebar-panel">
          <div className="dashboard-card">
            <h3 className="card-heading flex items-center gap-2 mb-6">
              Register New Camera Node
              <Plus className="w-4 h-4 text-teal-400" />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5">
                  Unique Camera ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ghat_1"
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5">
                  Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Entrance East"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5">
                  Physical Grid Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dowleswaram Plaza"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5">
                  RTSP Stream URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="rtsp://192.168.1.100:554/live"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {formStatus.message && (
                <div className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
                  formStatus.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {formStatus.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-extrabold tracking-widest uppercase rounded-lg shadow-md hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "REGISTERING NODE..." : "MOUNT PIPELINE NODE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
