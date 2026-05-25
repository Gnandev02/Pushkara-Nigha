"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  Video, 
  Plus, 
  Trash2, 
  Camera as CameraIcon, 
  Play, 
  StopCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw
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
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">SURVEILLANCE INPUT PIPELINES</span>
          <h1 className="gov-header-title">Camera Pipeline Management</h1>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] hover:underline"
        >
          <RefreshCw style={{ width: 13, height: 13 }} /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Columns: Registered cameras & webcam simulator */}
        <div className="lg:col-span-2 space-y-5">
          {/* Registered Cameras list */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <h3 className="card-heading">Active Pipeline Feeds</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0D9488]/10 text-[#0D9488]">
                {cameras.length} Active Feeds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cameras.map((cam) => {
                const statusColors = {
                  active: "safe",
                  warning: "busy",
                  critical: "critical"
                };
                const col = statusColors[cam.status] || "safe";
                
                return (
                  <div key={cam.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-3 hover:border-slate-200 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">{cam.cameraId}</span>
                        <span className={`table-risk-badge ${col}`}>
                          {cam.status}
                        </span>
                      </div>
                      <h4 className="text-slate-800 font-bold text-sm tracking-wide">{cam.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cam.location}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono truncate max-w-[160px] text-[11px]" title={cam.rtspUrl}>
                        {cam.rtspUrl ? cam.rtspUrl : "Simulated AI Feed"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded font-mono">
                        {cam.peopleCount} live
                      </span>
                    </div>
                  </div>
                );
              })}
              {cameras.length === 0 && (
                <div className="col-span-2 py-12 text-center text-slate-400">
                  <Video className="w-10 h-10 mx-auto opacity-20 mb-3" />
                  <p className="font-semibold text-sm">No cameras registered</p>
                  <p className="text-xs mt-0.5">Use the registration form or turn on the local webcam.</p>
                </div>
              )}
            </div>
          </div>

          {/* Local Device Webcam Simulator */}
          <div className="dashboard-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <CameraIcon className="w-24 h-24 text-[#0B6B53]" />
            </div>

            <h3 className="card-heading mb-2">Command Center WebCam Stream (Simulator)</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Demonstrate live capabilities without launching a Python GPU environment. Activating your webcam calculates mock YOLO crowd counters in your browser and posts updates to <code className="font-mono bg-slate-100 text-slate-600 px-1 rounded">/api/update</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden">
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
                    <CameraIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="text-[11px] text-slate-400 font-mono">Stream Standby</span>
                  </div>
                )}
                {isWebcamActive && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded animate-pulse">
                    LIVE STREAMING
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[9px] text-slate-400 font-mono tracking-wider block uppercase">PIPELINE NODE</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block font-mono">local_webcam</span>
                </div>
                {!isWebcamActive ? (
                  <button
                    onClick={startWebcam}
                    className="w-full py-2.5 font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                    style={{ background: "linear-gradient(135deg, #0B6B53, #0D9488)" }}
                  >
                    <Play style={{ width: 14, height: 14 }} />
                    Activate Webcam Feed
                  </button>
                ) : (
                  <button
                    onClick={stopWebcam}
                    className="w-full py-2.5 font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                  >
                    <StopCircle style={{ width: 14, height: 14 }} />
                    Shutdown Stream Node
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: registration Form */}
        <div>
          <div className="dashboard-card">
            <h3 className="card-heading mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0B6B53]" />
              Register New Camera Node
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-1">
                  Unique Camera ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ghat_13"
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Entrance East"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-1">
                  Physical Grid Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godavari Ghat Sector A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-1">
                  RTSP Stream URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="rtsp://192.168.1.100:554/live"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 font-mono"
                />
              </div>

              {formStatus.message && (
                <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                  formStatus.type === "success" 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {formStatus.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-[#0B6B53] text-white font-bold tracking-widest text-xs font-mono uppercase rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
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
