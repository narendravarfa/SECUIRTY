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
// 2. ADVANCED ALL-BRAND DEVICE DETECTOR
// ==========================================
function getDeviceBrand() {
    const ua = navigator.userAgent;

    // Apple
    if (/iPhone/i.test(ua)) return "Apple iPhone";
    if (/iPad/i.test(ua)) return "Apple iPad";

    // Major Brands
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
    if (/Lava/i.test(ua)) return "Lava";
    if (/Micromax/i.test(ua)) return "Micromax";
    if (/Asus|ROG/i.test(ua)) return "ASUS ROG Phone";
    if (/Nokia/i.test(ua)) return "Nokia";
    if (/Honor|Huawei/i.test(ua)) return "Honor / Huawei";

    // Generic OS Detection Fallback
    if (/Android/i.test(ua)) return "Android Smartphone";
    if (/Windows/i.test(ua)) return "Windows PC/Laptop";
    if (/Macintosh/i.test(ua)) return "MacBook / Mac";

    return "Smart Mobile Device";
}

// ==========================================
// 3. FORM SUBMIT FUNCTION (index.html)
// ==========================================
function submitData() {
    const nameInput = document.getElementById('studentName');
    const classInput = document.getElementById('studentClass');

    const name = nameInput ? nameInput.value.trim() : "";
    const studentClass = classInput ? classInput.value.trim() : "";
    
    // Auto Brand Detection
    const device = getDeviceBrand();

    if (name === "" || studentClass === "") {
        alert("⚠️ ACCESS DENIED: Please enter Name and Class!");
        return;
    }

    if (database) {
        database.ref('hacked_logs').push({
            name: name,
            class: studentClass,
            device: device,
            time: new Date().toLocaleTimeString()
        });
    } else {
        console.error("Firebase not initialized!");
    }

    if (document.getElementById('formSection')) {
        document.getElementById('formSection').style.display = 'none';
    }
    if (document.getElementById('warning')) {
        document.getElementById('warning').style.display = 'block';
    }
}

// ==========================================
// 4. REALTIME DASHBOARD LISTENER (dashboard.html)
// ==========================================
if (document.getElementById('logsContainer')) {
    const logsContainer = document.getElementById('logsContainer');
    const alertSound = document.getElementById('alertSound');
    const counterElement = document.getElementById('targetCounter');

    if (database) {
        // A. Entry Added Listener
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
            card.style.borderLeft = "5px solid #ff003c";
            card.style.borderRight = "1px solid #330000";
            card.style.borderTop = "1px solid #330000";
            card.style.borderBottom = "1px solid #330000";
            card.style.padding = "15px 20px";
            card.style.margin = "10px 0";
            card.style.borderRadius = "4px";
            card.style.boxShadow = "0 0 15px rgba(255, 0, 60, 0.4)";
            card.style.animation = "popIn 0.3s ease-out";

            const randomIP = `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

            card.innerHTML = `
                <div style="font-size: 18px; color: #ffffff; font-weight: bold; margin-bottom: 5px;">
                    🚨 TARGET DETECTED: <span style="color: #ff003c; text-shadow: 0 0 5px #ff003c;">${data.name.toUpperCase()}</span>
                </div>
                <div style="font-size: 13px; color: #ff8888; line-height: 1.5;">
                    Class: <span style="color: #00ff66;">${data.class}</span> | Device: <span style="color: #00ff66;">${data.device}</span> | Captured IP: <span style="color: #00ff66;">${randomIP} (SPOOF)</span>
                </div>
                <div style="font-size: 13px; color: #ff003c; font-weight: bold; margin-top: 5px;">
                    ❌ DATA STATUS: LEAKED ❌ <span style="color: #e6e6e6; font-size: 11px; font-weight: normal;">(Device Vulnerability: CRITICAL)</span>
                </div>
            `;

            logsContainer.prepend(card);

            if (counterElement) {
                counterElement.innerText = logsContainer.children.length;
            }
        });

        // B. Entry Removed Listener (Firebase Delete Sync)
        database.ref('hacked_logs').on('child_removed', (snapshot) => {
            const key = snapshot.key;
            const cardToRemove = document.getElementById(`log-${key}`);

            if (cardToRemove) {
                cardToRemove.remove();
                if (counterElement) {
                    counterElement.innerText = logsContainer.children.length;
                }
            }
        });
    }
}

// ==========================================
// 5. RESET ALL DATA FUNCTION (For New Demo)
// ==========================================
function resetAllData() {
    const confirmReset = confirm("⚠️ Are you sure you want to clear all student records for the new school demo?");
    if (confirmReset) {
        if (database) {
            database.ref('hacked_logs').remove()
                .then(() => {
                    alert("✅ All demo data cleared successfully! Ready for the new presentation.");
                })
                .catch((error) => {
                    alert("❌ Error clearing data: " + error.message);
                });
        }
    }
}

// Random Telecom Network Spoofing for visual impact
const networks = ["Jio 5G", "Airtel 5G", "Vi 4G", "BSNL Mobile"];
const randomNetwork = networks[Math.floor(Math.random() * networks.length)];