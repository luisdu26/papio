import { ESPLoader, Transport } from "https://unpkg.com/esptool-js@0.6.1/bundle.js";

const FW_URL = "./papio.bin";
const FW_SIZE = 4230880;
const FW_SHA256 = "bfa2d5adb465eabeedf357aa5d4aa0e139f3651bfbb1a8dc09d613af04827c3a";
const FLASH_OFFSET = 0x00000000;
const TARGET_CHIP = "ESP32-S3";

let firmware = null;
let port = null;
let transport = null;
let loader = null;
let connectedChip = null;

const $ = (id) => document.getElementById(id);
const logEl = $("log");

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logEl.textContent += `[${time}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function setBadge(text, online=false) {
  const el = $("connectionBadge");
  el.textContent = online ? `● ${text}` : `● ${text}`;
  el.className = `badge ${online ? "online" : "offline"}`;
}

function setProgress(p) {
  const pct = Math.max(0, Math.min(100, p));
  $("progressBar").style.width = `${pct}%`;
  $("progressText").textContent = `${pct.toFixed(1)}%`;
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2,"0")).join("");
}

async function loadFirmware() {
  log("Loading bundled Papio firmware...");
  const response = await fetch(FW_URL, {cache:"no-store"});
  if (!response.ok) throw new Error(`Firmware HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();
  firmware = new Uint8Array(buffer);

  if (firmware.length !== FW_SIZE) {
    throw new Error(`Firmware size mismatch: ${firmware.length} bytes`);
  }

  const digest = await sha256(firmware);
  if (digest !== FW_SHA256) {
    throw new Error("Firmware SHA-256 mismatch.");
  }

  $("fwSize").textContent = `${(firmware.length / 1048576).toFixed(2)} MB`;
  $("fwHash").textContent = digest.slice(0,16) + "…";
  log(`Firmware verified: ${firmware.length.toLocaleString()} bytes`);
  log(`SHA-256: ${digest}`);
}

const terminal = {
  clean() { },
  writeLine(data) { log(String(data)); },
  write(data) { log(String(data)); }
};

async function connect() {
  if (!("serial" in navigator)) {
    throw new Error("Web Serial is not supported. Use Chrome or Edge.");
  }

  // Vendor filters are intentionally broad because the board may expose
  // different USB-UART/USB-JTAG bridges depending on hardware revision.
  port = await navigator.serial.requestPort({
    filters: [
      {usbVendorId: 0x1A86},
      {usbVendorId: 0x10C4},
      {usbVendorId: 0x303A},
      {usbVendorId: 0x0403}
    ]
  });

  transport = new Transport(port, true);
  loader = new ESPLoader({
    transport,
    baudrate: 460800,
    terminal,
    debugLogging: false
  });

  log("Connecting to ESP bootloader...");
  connectedChip = await loader.main();
  log(`Detected chip: ${connectedChip}`);

  if (!String(connectedChip).toUpperCase().includes(TARGET_CHIP)) {
    await transport.disconnect().catch(()=>{});
    throw new Error(`Wrong target: ${connectedChip}. Papio is locked to ESP32-S3.`);
  }

  setBadge(`CONNECTED • ${connectedChip}`, true);
  $("chipInfo").textContent = `${connectedChip} detected. Target accepted.`;
  $("connectBtn").textContent = "RECONNECT DEVICE";
  $("flashBtn").disabled = false;
}

async function flash() {
  if (!loader || !firmware) throw new Error("Device or firmware not ready.");

  $("flashBtn").disabled = true;
  $("connectBtn").disabled = true;
  setProgress(0);

  const eraseAll = $("eraseAll").checked;
  log("========================================");
  log("PAPIO FLASH START");
  log(`Target: T-Embed CC1101 Plus / ESP32-S3`);
  log(`Address: 0x${FLASH_OFFSET.toString(16).padStart(8,"0")}`);
  log(`Erase all: ${eraseAll ? "YES" : "NO"}`);

  try {
    await loader.writeFlash({
      fileArray: [{data: firmware, address: FLASH_OFFSET}],
      flashMode: "dio",
      flashFreq: "40m",
      flashSize: "16MB",
      eraseAll,
      compress: true,
      reportProgress: (_fileIndex, written, total) => {
        setProgress((written / total) * 100);
      }
    });

    log("Flash write completed.");
    setProgress(100);
    await loader.after("hard_reset");
    log("Device reset.");
    log("PAPIO HAS LANDED.");
    setBadge("FLASH COMPLETE", true);
  } catch (err) {
    log(`ERROR: ${err?.message || err}`);
    setBadge("FLASH ERROR", false);
    throw err;
  } finally {
    $("connectBtn").disabled = false;
    $("flashBtn").disabled = false;
  }
}

$("connectBtn").addEventListener("click", async () => {
  try {
    if (!firmware) await loadFirmware();
    await connect();
  } catch (err) {
    log(`ERROR: ${err?.message || err}`);
    setBadge("DISCONNECTED", false);
  }
});

$("flashBtn").addEventListener("click", async () => {
  try {
    await flash();
  } catch (err) {
    log(`FLASH FAILED: ${err?.message || err}`);
  }
});

$("clearLog").addEventListener("click", () => logEl.textContent = "");

(async () => {
  try {
    await loadFirmware();
  } catch (err) {
    log(`FIRMWARE ERROR: ${err?.message || err}`);
  }
})();
