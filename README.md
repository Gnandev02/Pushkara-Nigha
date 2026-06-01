# 🚀 NeuralCrowd AI Platform

> **Production-Grade AI Crowd Analytics Platform**

NeuralCrowd AI Platform is a real-time, comprehensive crowd analytics and safety monitoring solution. It combines a high-performance Next.js web application with a standalone Python AI pipeline. The AI pipeline analyzes video feeds (CCTV, webcams, RTSP streams) using computer vision models (like YOLOv8) to track crowd density, identify stampede risks, and extract demographic data. This telemetry is instantly transmitted to the Next.js dashboard, providing actionable, real-time insights through interactive charts, maps, and alerts.

## ✨ Key Features

* **Real-time Analytics Dashboard:** Built with Next.js 14 and Recharts for live, interactive data visualization.
* **AI Computer Vision Pipeline:** Integrates seamlessly with an external Python/YOLOv8 pipeline processing RTSP, MP4, or live camera feeds.
* **Instantaneous Socket.IO Updates:** Pushes analytics and alerts directly to browser clients in real-time—no page refreshes required.
* **Stampede & Risk Detection:** Triggers automated alerts based on crowd density thresholds and movement anomalies.
* **Modern & Responsive UI:** Styled with Tailwind CSS and animated with Framer Motion for a premium user experience.
* **Robust Data Persistence:** Utilizes Prisma ORM with Neon serverless PostgreSQL for scalable, reliable data storage.
* **Geolocation & Mapping:** Features interactive camera mapping using the Google Maps API.

## 🛠️ Technology Stack

* **Frontend:** Next.js 14 (React), Tailwind CSS, Framer Motion, Recharts, Lucide React
* **Backend:** Node.js, Next.js API Routes, Socket.IO
* **Database:** PostgreSQL (Neon Serverless), Prisma ORM
* **External AI Pipeline:** Python, YOLOv8 (Computer Vision)
* **Storage:** Vercel Blob (for static assets/images)
* **Maps:** Google Maps API

## 🚀 Getting Started

To get the NeuralCrowd AI Platform up and running, you need to configure both the web application and the accompanying Python AI server.

### 1. Database Configuration (Neon PostgreSQL)

1. Create a new PostgreSQL database (we recommend [Neon](https://neon.tech)).
2. Copy your connection string (use the pooled connection string ending in `-pooler` if using Neon).
3. Create a `.env` file in the root of the project and add your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@ep-host-pooler.region.neon.tech/dbname?sslmode=require"
   ```

### 2. Local Web Server Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the Database:**
   Push the schema to your database to create the necessary tables.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Start the Development Server:**
   This starts both the Next.js application and the Socket.IO server.
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### 3. AI Pipeline Setup

The Python AI engine runs independently on a machine with GPU capabilities. It processes video and sends analytics data to your Next.js server via HTTP POST.

*Please ensure you have Python (3.8 - 3.11) installed.*

1. **Navigate to the AI directory** (e.g., `crowd_analytics`):
   ```bash
   cd path/to/crowd_analytics
   ```

2. **Install Python Requirements:**
   ```bash
   pip install -r requirements.txt
   # Or for Windows: pip install -r requirements-windows.txt
   ```

3. **Run the AI Stream:**
   You can analyze video files, webcams, or live RTSP streams. Examples:
   ```bash
   # Analyze a sample video file
   python app.py --source videos/test_sample.mp4 --camera-id cam_01

   # Analyze local webcam
   python app.py --source 0 --camera-id local_webcam --realtime

   # Analyze RTSP network camera
   python app.py --source "rtsp://admin:password@192.168.1.100:554/h264" --camera-id entrance_cam
   ```

## 🏗️ Architecture & Data Flow

1. **AI Processing (`app.py`):** The Python script analyzes frames, extracting crowd metrics (headcounts, demographics, risk levels).
2. **Data Ingestion:** The AI pipeline sends HTTP POST requests containing this telemetry to the Next.js API endpoint (`/api/update`).
3. **Storage:** Next.js persists the telemetry data into the Neon PostgreSQL database using Prisma.
4. **Real-time Broadcast:** Upon successful database insertion, the Next.js server utilizes `Socket.IO` to broadcast an `analytics_update` event to all connected web clients.
5. **Dynamic UI:** The React frontend receives the WebSocket event and immediately updates the charts, maps, and alert feeds.

## ☁️ Deployment

For detailed instructions on deploying the application to production environments like Vercel, please refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
