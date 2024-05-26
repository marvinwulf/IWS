import si from "systeminformation";
import fs from "fs";
import path from "path";

let cachedData: any = {
  cpu: null,
  disks: null,
  memory: null,
  staticInfo: null,
};
let lastFetchTime: any = {
  cpu: 0,
  disks: 0,
  memory: 0,
};

const CPU_CACHE_DURATION = 4000;
const RAM_DISK_CACHE_DURATION = 16000;

let staticInfoFetched = false;

async function fetchStaticInfoOnce() {
  try {
    if (!staticInfoFetched) {
      const filePath = path.join(process.cwd(), "public", "staticinfo.json");
      const staticInfoData = fs.readFileSync(filePath, "utf8");
      const staticInfo = JSON.parse(staticInfoData);

      cachedData.staticInfo = staticInfo;

      staticInfoFetched = true;
    }
  } catch (error) {
    console.error("Error fetching static information:", error);
  }
}

async function fetchCPUData() {
  try {
    const cpuData = await si.currentLoad();
    let cpuLoad = Math.ceil(cpuData.currentLoad);
    if (cpuLoad < 1) {
      cpuLoad = 1;
    }
    const cpuLoadPerCore = cpuData.cpus.map((core) => Math.ceil(core.load * 10) / 10);

    cachedData.cpu = {
      totalLoad: cpuLoad,
      loadPerCore: cpuLoadPerCore,
    };

    lastFetchTime.cpu = Date.now();
  } catch (error) {
    console.error("Error fetching CPU data:", error);
  }
}

async function fetchDiskData() {
  try {
    const disks = await si.fsSize();

    cachedData.disks = disks;
    lastFetchTime.disks = Date.now();
  } catch (error) {
    console.error("Error fetching disk data:", error);
  }
}

async function fetchMemoryData() {
  try {
    const memData = await si.mem();
    let memLoad = Math.ceil((memData.used / memData.total) * 100);

    cachedData.memory = {
      totalLoad: memLoad,
      data: memData,
    };

    lastFetchTime.memory = Date.now();
  } catch (error) {
    console.error("Error fetching memory data:", error);
  }
}

fetchStaticInfoOnce();

fetchCPUData();
fetchDiskData();
fetchMemoryData();

setInterval(fetchCPUData, CPU_CACHE_DURATION);
setInterval(fetchDiskData, RAM_DISK_CACHE_DURATION);
setInterval(fetchMemoryData, RAM_DISK_CACHE_DURATION);

export function getCachedData() {
  return cachedData;
}

export function getLastFetchTime() {
  return lastFetchTime;
}
