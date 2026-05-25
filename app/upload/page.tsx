"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  Video, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, success, error
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["mp4", "mov", "avi", "mkv"];
    
    if (!ext || !validExtensions.includes(ext)) {
      setStatus("error");
      setMessage("Invalid format. Please select a valid video file (MP4, MOV, AVI, or MKV).");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setMessage("");
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);
    setMessage("Uploading video file to AI Backend Node...");

    const formData = new FormData();
    formData.append("file", file);

    // Simulate progress bar movement
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      // POST direct to FastAPI local server
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("processing");
        setMessage("AI Pipeline Triggered! Running YOLOv8 detection & ByteTrack model...");
        
        setTimeout(() => {
          setStatus("success");
          setMessage("YOLO Model is successfully evaluating frames in the background!");
        }, 2500);
      } else {
        setStatus("error");
        setMessage(data.detail || "Server failed to process the uploaded video.");
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setStatus("error");
      setMessage("AI Backend is offline. Please make sure uvicorn server.py is running on port 8000.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">SURVEILLANCE VIDEO INGESTION</span>
          <h1 className="gov-header-title">Automated AI Video Ingestion</h1>
        </div>
      </div>

      {/* Main Card */}
      <div className="dashboard-card relative overflow-hidden flex flex-col gap-5">
        <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
          <Video className="w-48 h-48 text-[#0B6B53]" />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Upload recorded CCTV footage or simulated crowd movement sequences. The integrated pipeline triggers YOLOv8 detection and unique devotee multi-object indexing (ByteTrack) to live-calculate densities.
        </p>

        {/* Dropzone Area */}
        {status === "idle" && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              dragActive 
                ? "border-[#0D9488] bg-[#0D9488]/5 scale-[0.99]" 
                : "border-slate-200 hover:border-[#0D9488]/60 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,.avi,.mkv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <UploadCloud style={{ width: 24, height: 24, color: "#0B6B53" }} />
            </div>

            <div className="text-center space-y-1 px-4">
              <p className="text-sm font-bold text-slate-700">
                {file ? file.name : "Drag & Drop video file here"}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Supports MP4, MOV, AVI, or MKV up to 500MB"}
              </p>
            </div>

            {!file && (
              <button
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Browse Local Files
              </button>
            )}
          </div>
        )}

        {/* Dynamic Uploader Status Panels */}
        {status !== "idle" && (
          <div className="min-h-[220px] p-6 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col justify-center items-center text-center gap-5">
            {status === "uploading" && (
              <div className="space-y-4 w-full max-w-md">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-2">
                    <Activity style={{ width: 14, height: 14, color: "#0D9488" }} className="animate-pulse" />
                    {message}
                  </span>
                  <span className="font-bold text-[#0D9488]">{progress}%</span>
                </div>
                
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0B6B53] h-full rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="space-y-3">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20 animate-spin mx-auto">
                  <Sparkles style={{ width: 20, height: 20, color: "#0D9488" }} />
                </div>
                <h4 className="font-mono text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Initializing YOLO Model Node
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {message}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle style={{ width: 24, height: 24 }} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800">AI Ingestion Pipeline Active!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Surveillance frames are streaming into the detection node. Calculations will sync real-time into the centralized Neon database log.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/")}
                  className="mx-auto px-5 py-2.5 bg-[#0B6B53] text-white font-bold tracking-wider text-xs uppercase rounded-lg hover:shadow-md flex items-center gap-2 transition-all"
                >
                  Enter Command Center
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
                  <AlertCircle style={{ width: 24, height: 24 }} />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-slate-800">Pipeline Halted</h4>
                  <p className="text-xs text-red-600 font-mono max-w-md mx-auto leading-relaxed bg-red-50 px-3 py-2 rounded-lg border border-red-150">
                    {message}
                  </p>
                </div>

                <button
                  onClick={() => setStatus("idle")}
                  className="mx-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg border border-slate-200 transition-all"
                >
                  Select Another Video
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Buttons */}
        {file && status === "idle" && (
          <div className="flex gap-4">
            <button
              onClick={() => setFile(null)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold tracking-wider text-xs uppercase rounded-lg border border-slate-200 transition-colors"
            >
              Cancel Selection
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 py-2.5 bg-[#0B6B53] text-white font-bold tracking-wider text-xs uppercase rounded-lg flex items-center justify-center gap-2 hover:shadow-md transition-all"
            >
              <Play style={{ width: 14, height: 14 }} />
              Trigger AI Processing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
