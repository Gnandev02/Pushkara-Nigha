-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passcode" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedDistrict" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLogin" TEXT NOT NULL DEFAULT 'Never',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ghat" (
    "id" TEXT NOT NULL,
    "ghatName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentCrowd" INTEGER NOT NULL,
    "occupancyPercentage" DOUBLE PRECISION NOT NULL,
    "entryCount" INTEGER NOT NULL,
    "exitCount" INTEGER NOT NULL,
    "activeCameras" INTEGER NOT NULL,
    "zoneStatus" TEXT NOT NULL,
    "aiRisk" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "coordinatesX" DOUBLE PRECISION NOT NULL,
    "coordinatesY" DOUBLE PRECISION NOT NULL,
    "anomaliesDetected" INTEGER NOT NULL,
    "safetyStatus" TEXT NOT NULL,
    "inMen" INTEGER NOT NULL,
    "inWomen" INTEGER NOT NULL,
    "inOthers" INTEGER NOT NULL,
    "outMen" INTEGER NOT NULL,
    "outWomen" INTEGER NOT NULL,
    "outOthers" INTEGER NOT NULL,
    "camInId" TEXT NOT NULL,
    "camOutId" TEXT NOT NULL,
    "aiTrend" TEXT NOT NULL,
    "lastUpdated" TEXT NOT NULL,

    CONSTRAINT "Ghat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringData" (
    "id" SERIAL NOT NULL,
    "temp" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" TEXT NOT NULL,
    "wind" TEXT NOT NULL,
    "waterLevel" TEXT NOT NULL,
    "safetyAlert" TEXT NOT NULL,
    "totalMonitoredGhats" INTEGER NOT NULL,
    "activeFeeds" INTEGER NOT NULL,
    "onlineSensors" INTEGER NOT NULL,
    "incidentsResolvedToday" INTEGER NOT NULL,
    "citizenReportsReceived" INTEGER NOT NULL,
    "aiModelAccuracy" TEXT NOT NULL,
    "inferenceLatency" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoringData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedUnit" TEXT NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CameraFeed" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "peopleCount" INTEGER NOT NULL,
    "densityLabel" TEXT NOT NULL,
    "aiDetections" TEXT[],
    "riskLevel" TEXT NOT NULL,
    "feedStatus" TEXT NOT NULL,
    "boundingBoxes" JSONB NOT NULL,

    CONSTRAINT "CameraFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftOfficer" (
    "id" SERIAL NOT NULL,
    "officerName" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "shiftTime" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "assignedGhat" TEXT NOT NULL,
    "dutyStatus" TEXT NOT NULL,
    "attendance" TEXT NOT NULL,
    "reportingOfficer" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,

    CONSTRAINT "ShiftOfficer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "District"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftOfficer_officerId_key" ON "ShiftOfficer"("officerId");
