# 🚀 Production Deployment & AI Setup Guide

This guide details the steps required to deploy the **AI Crowd Analytics Platform** to Vercel and Neon PostgreSQL, as well as configure and run the Python AI pipeline on a GPU/local server.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
* **Node.js (v18.x or later)**
* **Python (3.8 - 3.11)** (Note: YOLOv8 supports up to Python 3.11)
* **Git**

---

## 2. Database Setup (Neon PostgreSQL)

1. Sign up/Login to [Neon Console](https://neon.tech).
2. Create a new project (e.g., `neuralcrowd-analytics`).
3. Under the **Dashboard**, copy your **Connection String** (use the pooled connection string ending in `-pooler` for serverless environments).
4. Paste it into your `.env` file at the root:
   ```env
   DATABASE_URL="postgresql://username:password@ep-host-pooler.region.neon.tech/dbname?sslmode=require"
   ```

---

## 3. Local Web Server Startup

To run the Next.js 14 Web UI and Socket.IO server:

1. **Install dependencies**:
   ```powershell
   npm.cmd install
   ```
2. **Push the database schema**:
   Creates required analytics, camera, and alert tables in Neon PostgreSQL.
   ```powershell
   node_modules/prisma/build/index.js db push
   ```
3. **Generate Prisma Client**:
   ```powershell
   node_modules/prisma/build/index.js generate
   ```
4. **Start the server**:
   Runs the unified Next.js + Socket.IO server on `http://localhost:3000`.
   ```powershell
   npm.cmd run dev
   ```

---

## 4. Python AI Server Setup

The Python AI pipeline runs separately on your GPU/local machine. It analyzes video feeds (RTSP/Webcam/MP4), calculates crowd metrics, and sends analytics via HTTP POST requests to `http://localhost:3000/api/update`.

### Installation Steps

1. Navigate to your `crowd_analytics` folder:
   ```powershell
   cd c:\Users\gnand\OneDrive\Desktop\crowd_analytics\crowd_analytics
   ```
2. Install Python dependencies:
   * **Windows users**:
     ```powershell
     pip install -r requirements-windows.txt
     ```
   * **General**:
     ```powershell
     pip install -r requirements.txt
     ```
3. Ensure you have `yolov8m.pt` inside the `models/` directory, or YOLO will automatically download it.

### Launching the AI Stream

Run the AI detection loop on a sample video, webcam, or RTSP URL:

* **Sample Video**:
  ```powershell
  python app.py --source videos/test_sample.mp4 --camera-id ghat_1
  ```
* **Webcam Feed**:
  ```powershell
  python app.py --source 0 --camera-id local_webcam --realtime
  ```
* **RTSP Camera Network**:
  ```powershell
  python app.py --source "rtsp://admin:password@192.168.1.100:554/h264" --camera-id ghat_entrance
  ```

---

## 5. Vercel Serverless Deployment

Deploying the Next.js frontend and database APIs to Vercel is extremely straightforward:

1. Push your code repository to **GitHub / GitLab / Bitbucket**.
2. Connect your repository to **Vercel**:
   * Create a new project on Vercel.
   * Import your repository.
3. Configure the following **Environment Variables** in the Vercel dashboard:
   * `DATABASE_URL` (Your Neon pooled URL)
   * `NEXT_PUBLIC_API_URL` (Your production Vercel deployment URL, e.g. `https://your-domain.vercel.app`)
   * `JWT_SECRET` (A secure random string)
4. Click **Deploy**. Vercel will build the Next.js 14 App Router and expose the endpoints.

---

## 6. How Real-time Socket.IO Broadcasts Work

1. **AI loop (`app.py`)** processes camera frames $\rightarrow$ calculates crowd totals, genders, and stampede risks.
2. **HTTP POST** is triggered to `/api/update` on the Next.js server.
3. **Database Insertion**: Next.js logs the telemetry into the Neon PostgreSQL DB.
4. **WebSocket Broadcast**: The Next.js server utilizes `global.io` to emit an immediate broadcast event (`analytics_update`) to all connected browser clients.
5. **UI Update**: The React dashboard displays the updated crowd metrics, lines, charts, and alarm feeds instantly without page refresh!
