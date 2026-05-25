"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, success, error
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const validExtensions = ["mp4", "mov", "avi", "mkv"];
    
    if (!validExtensions.includes(ext)) {
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

    // Simulate progress bar movement while transferring large block
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
        
        // After 2.5s simulation of model initializing, show success link
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
    <div className="space-y-8 flex-1 flex flex-col justify-center max-w-4xl mx-auto py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Automated AI Video Processor
          <UploadCloud className="w-8 h-8 text-neonPurple" />
        </h2>
        <p className="text-gray-400 mt-1">
          Upload recorded MP4/MOV surveillance streams. The pipeline automatically triggers YOLOv8 people counts, ByteTrack tracking, and registers real-time telemetry logs.
        </p>
      </div>

      {/* Main Glass Box Card */}
      <div className="glassmorphism rounded-2xl p-8 border border-glassBorder relative overflow-hidden flex flex-col gap-6 shadow-neonGlow/5">
        <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
          <Video className="w-64 h-64 text-neonBlue" />
        </div>

        {/* Dropzone Area */}
        {status === "idle" && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
              dragActive 
                ? "border-neonPurple bg-neonPurple/5 shadow-neonGlow/10 scale-[0.99]" 
                : "border-glassBorder hover:border-neonPurple/55 hover:bg-white/[0.01]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,.avi,.mkv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-glassBorder flex items-center justify-center text-gray-400 group-hover:text-white transition-colors duration-300">
              <UploadCloud className="w-8 h-8 text-neonBlue" />
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white tracking-wide">
                {file ? file.name : "Drag & Drop video file here"}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Supports MP4, MOV, AVI, or MKV up to 500MB"}
              </p>
            </div>

            {!file && (
              <button
                type="button"
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold tracking-widest uppercase border border-glassBorder rounded-xl transition-colors duration-300"
              >
                Browse Local Files
              </button>
            )}
          </div>
        )}

        {/* Dynamic Uploader Status Panels */}
        <AnimatePresence mode="wait">
          {status !== "idle" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-56 p-6 rounded-2xl bg-white/[0.02] border border-glassBorder flex flex-col justify-center items-center text-center gap-6"
            >
              {status === "uploading" && (
                <div className="space-y-6 w-full max-w-md">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-neonBlue animate-pulse" />
                      {message}
                    </span>
                    <span className="font-bold text-neonBlue">{progress}%</span>
                  </div>
                  
                  <div className="w-full bg-white/5 border border-glassBorder h-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-neonPurple to-neonBlue h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}

              {status === "processing" && (
                <div className="space-y-4">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-neonPurple/10 border border-neonPurple/20 animate-spin">
                    <Sparkles className="w-6 h-6 text-neonPurple" />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-white tracking-widest uppercase">
                    Initializing YOLO Model Node
                  </h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    {message}
                  </p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">AI Stream Pipeline Online!</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                      Your video is now being analyzed by YOLOv8 on your server backend. Dynamic counts are streaming straight to the Neon DB.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/")}
                    className="mx-auto px-6 py-3 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl shadow-neonGlow hover:shadow-glow flex items-center gap-2 transition-all duration-300"
                  >
                    Enter Live Command Center
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-neonPink/10 border border-neonPink/20 flex items-center justify-center mx-auto text-neonPink">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Pipeline Execution Halted</h4>
                    <p className="text-xs text-neonPink font-mono max-w-md mx-auto leading-relaxed bg-neonPink/5 p-3 rounded-xl border border-neonPink/15">
                      {message}
                    </p>
                  </div>

                  <button
                    onClick={() => setStatus("idle")}
                    className="mx-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold tracking-widest uppercase border border-glassBorder rounded-xl transition-all duration-300"
                  >
                    Select Another Video
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Upload Buttons */}
        {file && status === "idle" && (
          <div className="flex gap-4">
            <button
              onClick={() => setFile(null)}
              className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl border border-glassBorder transition-colors duration-300"
            >
              Cancel Selection
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl shadow-neonGlow hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Trigger AI Processing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
