"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/components/SocketProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Plus, 
  Globe, 
  Trash2, 
  Upload, 
  Camera as CameraIcon, 
  Play, 
  StopCircle,
  HelpCircle,
  CheckCircle,
  AlertCircle
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
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Camera Pipeline Management
          <Video className="w-8 h-8 text-neonPurple" />
        </h2>
        <p className="text-gray-400 mt-1">
          Connect RTSP feeds, test local webcams, or register simulated camera networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left column: Camera registrations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Cameras Status Grid */}
          <div className="glassmorphism rounded-2xl p-6 border border-glassBorder">
            <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6 flex items-center justify-between">
              Registered Camera Inputs
              <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold bg-neonBlue/10 text-neonBlue border border-neonBlue/20 rounded">
                {cameras.length} TOTAL
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cameras.map((cam) => {
                const statusColors = {
                  active: "bg-green-500 text-green-400 border-green-500/20",
                  warning: "bg-amber-500 text-amber-400 border-amber-500/20",
                  critical: "bg-neonPink text-neonPink border-neonPink/20"
                };
                const col = statusColors[cam.status] || "bg-gray-500 text-gray-400";
                
                return (
                  <div key={cam.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase font-bold">{cam.cameraId}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold font-mono border capitalize flex items-center gap-1.5 bg-opacity-10 ${col}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'critical' ? 'bg-neonPink animate-ping' : cam.status === 'warning' ? 'bg-amber-400' : 'bg-green-500'}`} />
                          {cam.status}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-base mt-2 tracking-wide">{cam.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{cam.location}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span className="font-mono truncate max-w-[200px]" title={cam.rtspUrl}>
                        {cam.rtspUrl ? cam.rtspUrl : "Simulated AI Feed"}
                      </span>
                      <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 font-mono text-neonBlue">
                        {cam.peopleCount} crowd
                      </span>
                    </div>
                  </div>
                );
              })}
              {cameras.length === 0 && (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  No camera inputs registered. Use registration panel or activate local webcam.
                </div>
              )}
            </div>
          </div>

          {/* Local Device Webcam Simulator Card */}
          <div className="glassmorphism rounded-2xl p-6 border border-glassBorder relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <CameraIcon className="w-32 h-32 text-neonBlue" />
            </div>

            <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-4">
              Command Center WebCam Stream (Simulator Mode)
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Demonstrate the platform's live capabilities immediately without launching a Python GPU environment. Active webcam streams will calculate mock YOLO crowd counters in your browser and post updates straight to the API route!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-48 rounded-xl border border-dashed border-glassBorder bg-darkBg flex items-center justify-center relative overflow-hidden">
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
                    <CameraIcon className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                    <span className="text-xs text-gray-500 mt-2 block font-mono">Stream Standby</span>
                  </div>
                )}
                {isWebcamActive && (
                  <div className="absolute top-3 left-3 bg-neonPink/20 text-neonPink text-[9px] font-extrabold font-mono tracking-widest border border-neonPink/30 px-2 py-0.5 rounded animate-pulse">
                    LIVE STREAMING
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider block">PIPELINE NODE</span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">local_webcam</span>
                </div>
                {!isWebcamActive ? (
                  <button
                    onClick={startWebcam}
                    className="w-full py-3 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl shadow-neonGlow hover:shadow-glow flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Activate Webcam Feed
                  </button>
                ) : (
                  <button
                    onClick={stopWebcam}
                    className="w-full py-3 bg-neonPink/20 text-neonPink border border-neonPink/30 font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-neonPink/35 transition-all duration-300"
                  >
                    <StopCircle className="w-4 h-4" />
                    Shutdown Stream Node
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: registration Form */}
        <div>
          <div className="glassmorphism rounded-2xl p-6 border border-glassBorder sticky top-8">
            <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
              Register New Camera Node
              <Plus className="w-5 h-5 text-neonPurple" />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                  Unique Camera ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ghat_13"
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple font-mono transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                  Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Entrance East"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                  Physical Grid Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Godavari Ghat Sector A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                  RTSP Stream URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="rtsp://192.168.1.100:554/live"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple font-mono transition-colors"
                />
              </div>

              {formStatus.message && (
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  formStatus.type === "success" 
                    ? "bg-green-500/10 border-green-500/20 text-green-400" 
                    : "bg-neonPink/10 border-neonPink/20 text-neonPink"
                }`}>
                  {formStatus.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl shadow-neonGlow hover:shadow-glow disabled:opacity-50 transition-all duration-300"
              >
                {isSubmitting ? "REGISTERNIG NODE..." : "MOUNT PIPELINE NODE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
