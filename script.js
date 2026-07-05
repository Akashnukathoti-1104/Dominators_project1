// =========================================================================
// PEOPLE'S PRIORITIES — main application script
// =========================================================================

// ===== CONSTANTS =====
const CATEGORIES = [
    "Infrastructure", "Water Supply", "Healthcare", "Education",
    "Safety", "Employment", "Sanitation", "Electricity", "Public Transport", "Parks"
];
const WARDS = ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"];
const CATEGORY_COLORS = {
    "Infrastructure":"#F59E0B","Water Supply":"#06B6D4","Healthcare":"#EF4444",
    "Education":"#8B5CF6","Safety":"#F97316","Employment":"#10B981",
    "Sanitation":"#6366F1","Electricity":"#EC4899","Public Transport":"#14B8A6","Parks":"#22C55E"
};
const CATEGORY_ICONS = {
    "Infrastructure":"fa-road","Water Supply":"fa-droplet","Healthcare":"fa-heart-pulse",
    "Education":"fa-graduation-cap","Safety":"fa-shield-halved","Employment":"fa-briefcase",
    "Sanitation":"fa-broom","Electricity":"fa-bolt","Public Transport":"fa-bus","Parks":"fa-tree"
};
const URGENCY_SCORE = { low:1, medium:2, high:3, critical:4 };

// Rough "how long until this gets fixed" estimate, shown to citizens so they
// know what to expect. Driven by urgency since that's what the MP acts on first.
const ETA_DAYS = { critical: 3, high: 7, medium: 14, low: 21 };
function estimateResolutionDays(urgency) { return ETA_DAYS[urgency] || 14; }
function etaText(s) {
    if (s.status === 'resolved') return `Resolved ${timeAgo(s.resolvedAt || s.timestamp)}`;
    if (s.status === 'in-progress') return `In progress · expected in ~${s.etaDays || estimateResolutionDays(s.urgency)} more days`;
    return `Expected in ~${s.etaDays || estimateResolutionDays(s.urgency)} days`;
}

// Action plan templates for each category
const ACTION_TEMPLATES = {
    "Infrastructure": {
        title:"Road & Infrastructure Repair Program", icon:"fa-road",
        actions:["Deploy rapid assessment teams to all reported locations within 7 days","Allocate emergency repair fund for critical-priority roads and bridges","Establish ward-level monitoring committees for ongoing maintenance","Set up citizen SMS feedback loop for repair status updates"],
        budget:"₹2.5 Crore", timeline:"3-6 months", dept:"Public Works Department"
    },
    "Water Supply": {
        title:"Water Supply Stabilization Initiative", icon:"fa-droplet",
        actions:["Audit pipeline infrastructure in affected wards within 10 days","Install water level sensors at key distribution points","Deploy tanker services to critical shortage areas immediately","Prepare proposal for underground reservoir expansion"],
        budget:"₹1.8 Crore", timeline:"2-4 months", dept:"Water Supply & Sanitation Dept"
    },
    "Healthcare": {
        title:"Primary Healthcare Strengthening Plan", icon:"fa-heart-pulse",
        actions:["Recruit additional healthcare workers for understaffed PHCs","Stock essential medicines with 90-day buffer inventory","Launch weekly health camps in underserved wards","Digitize patient records at all ward health centers"],
        budget:"₹1.2 Crore", timeline:"2-3 months", dept:"Health Department"
    },
    "Education": {
        title:"Education Infrastructure & Quality Program", icon:"fa-graduation-cap",
        actions:["Repair damaged school buildings in priority wards","Deploy smart classroom kits to government schools","Recruit substitute teachers for vacant positions","Establish community study centers in underserved areas"],
        budget:"₹80 Lakhs", timeline:"3-6 months", dept:"Education Department"
    },
    "Safety": {
        title:"Community Safety Enhancement Plan", icon:"fa-shield-halved",
        actions:["Install CCTV cameras in identified crime hotspots","Increase night patrol frequency in top affected wards","Set up community vigilance committees with police liaison","Improve street lighting on identified dark stretches"],
        budget:"₹1.5 Crore", timeline:"2-4 months", dept:"Police & Municipal Corp"
    },
    "Employment": {
        title:"Local Employment & Skill Development Initiative", icon:"fa-briefcase",
        actions:["Launch skill training centers focused on local industry needs","Partner with local businesses for apprenticeship programs","Organize monthly job fair at community hall","Create online portal for local job matching"],
        budget:"₹60 Lakhs", timeline:"3-6 months", dept:"Employment & Skill Dev Dept"
    },
    "Sanitation": {
        title:"Clean Ward Sanitation Drive", icon:"fa-broom",
        actions:["Deploy additional sanitation workers to priority wards","Install new public dustbins in high-traffic areas","Launch ward-level cleanliness awareness campaign","Establish complaint hotline for sanitation issues"],
        budget:"₹40 Lakhs", timeline:"1-3 months", dept:"Sanitation Department"
    },
    "Electricity": {
        title:"Power Supply Reliability Program", icon:"fa-bolt",
        actions:["Identify and replace damaged transformers","Upgrade aging power lines in affected areas","Install solar backup at critical public facilities","Set up real-time power outage monitoring system"],
        budget:"₹2 Crore", timeline:"3-6 months", dept:"Electricity Board"
    },
    "Public Transport": {
        title:"Public Transport Connectivity Enhancement", icon:"fa-bus",
        actions:["Add new bus routes covering underserved wards","Install digital display boards at bus stops","Introduce last-mile e-rickshaw connectivity","Create real-time bus tracking feature"],
        budget:"₹90 Lakhs", timeline:"4-8 months", dept:"Transport Department"
    },
    "Parks": {
        title:"Green Spaces Development Plan", icon:"fa-tree",
        actions:["Restore and reopen neglected public parks","Plant trees along identified green corridors","Install walking paths and exercise equipment","Deploy park maintenance teams with weekly schedule"],
        budget:"₹35 Lakhs", timeline:"2-4 months", dept:"Municipal Parks Dept"
    }
};

// Random names for demo data generation
const RANDOM_NAMES = ["Amit Patel","Sneha Reddy","Karthik Iyer","Pooja Gupta","Ravi Shankar","Nisha Das","Manish Tiwari","Zara Khan","Arun Nair","Divya Menon","Harsh Joshi","Komal Singh","Pradeep Rao","Swati Kulkarni","Nikhil Bhat","Anjali Mishra","Suresh Pillai","Ritu Sharma","Gaurav Hegde","Meera Krishnan","Tarun Saxena","Isha Kapoor","Dinesh Pandey","Pallavi Desai","Sanjay Mehta","Bhavna Chauhan","Rajiv Malhotra","Simran Oberoi","Ashok Jha","Neelam Rathore"];
const RANDOM_ISSUES = {
    "Infrastructure":["Road completely broken near bus stand, heavy traffic daily","Speed breaker missing near school zone, accidents increasing","Community center wall cracked, risk of collapse","Footpath missing on 2km stretch, people walking on road","Internal roads in colony never repaired since construction","Culvert damaged, water flooding road during rain"],
    "Water Supply":["Water supply only 1 hour per day for past month","Pipeline burst wasting water for 3 days, no repair","New connections not being approved despite applications","Water pressure too low to reach 2nd floor","Meter readings inflated, billing complaints ignored","Hand pump broken, only source of water for 50 families"],
    "Healthcare":["No night shift doctor at PHC, emergencies turned away","Lab testing not available, samples sent to district HQ","Vaccination drive not conducted in our ward this quarter","PHC building infested with termites, ceiling falling","No female doctor available for women's health issues","Pharmacy at PHC closed, medicines unavailable after 5 PM"],
    "Education":["School boundary wall broken, stray animals entering campus","Computer lab has non-functional computers for 2 years","Mid-day meal quality very poor, children falling sick","Library has no new books added in 5 years","Toilet facilities unusable, students skipping school","No playground, children playing on road"],
    "Safety":["Drug peddling near park, youth getting addicted","Eve-teasing incidents increasing near college area","No fire safety equipment in market complex","Stray dog attacks on children, no action taken","Illegal liquor den operating openly","Traffic signals not working at major intersection"],
    "Employment":["Industrial area shut down, 300 workers jobless","No placement cell at local college","Agricultural laborers have no work in off-season","Women's self-help groups need training and market access","Youth migrating to cities due to lack of opportunity","No startup support or incubation center in constituency"],
    "Sanitation":["Construction debris dumped on vacant plot for months","Public toilet block locked and unusable","Drain cleaning not done before monsoon","Sewer line overflow near temple, devotees affected","Hotel waste being dumped in open area","No segregated waste collection system"],
    "Electricity":["Power fluctuations damaging home appliances","New area not connected to grid despite repeated requests","Street light poles leaning, wires exposed","Underground cable fault causing repeated outages","No separate feeder for industrial area, load shedding affecting production","Solar panel installation subsidy not being processed"],
    "Public Transport":["Bus stop shelter broken, no place to sit during rain","Last bus at 7 PM, late shift workers stranded","Route diverted without notice, passengers confused","Bus frequency reduced from 30 min to 2 hours","No bus service to new residential colonies","Bus drivers refusing to stop at designated stops"],
    "Parks":["Park encroached by nearby shopkeeper","Playground turned into parking lot","No drinking water facility in park","Park gates locked, public not allowed to enter","Fencing broken, stray animals entering","Garden maintenance stopped, overgrown bushes"]
};

// ===== SAMPLE DATA =====
let submissions = [
    { id:1, name:"Rajesh Kumar", category:"Infrastructure", description:"Main road in Ward 3 has massive potholes causing daily accidents and traffic jams for 6 months", urgency:"critical", ward:"Ward 3", timestamp:new Date('2026-07-04T08:30:00') },
    { id:2, name:"Priya Sharma", category:"Water Supply", description:"Only getting water for 2 hours a day, pressure very low, cannot fill storage tanks", urgency:"high", ward:"Ward 5", timestamp:new Date('2026-07-04T09:15:00') },
    { id:3, name:"Mohammed Irfan", category:"Healthcare", description:"PHC in Ward 2 has no doctor for 3 weeks, patients forced to travel 15km for basic care", urgency:"critical", ward:"Ward 2", timestamp:new Date('2026-07-04T09:45:00') },
    { id:4, name:"Anita Devi", category:"Education", description:"Government school roof leaking during monsoon, children sitting in one corner", urgency:"high", ward:"Ward 7", timestamp:new Date('2026-07-04T10:00:00') },
    { id:5, name:"Suresh Yadav", category:"Infrastructure", description:"Drainage system completely blocked in our street, waterlogging during every rain", urgency:"high", ward:"Ward 3", timestamp:new Date('2026-07-04T10:30:00') },
    { id:6, name:"Fatima Begum", category:"Water Supply", description:"Water contamination issue, yellow-colored water coming from taps for past week", urgency:"critical", ward:"Ward 1", timestamp:new Date('2026-07-04T11:00:00') },
    { id:7, name:"Vikram Singh", category:"Safety", description:"No street lights on the main road for 2 months, several theft incidents at night", urgency:"high", ward:"Ward 4", timestamp:new Date('2026-07-03T18:00:00') },
    { id:8, name:"Lakshmi Narayan", category:"Employment", description:"Many youth in our area are unemployed, no skill training center nearby", urgency:"medium", ward:"Ward 6", timestamp:new Date('2026-07-03T16:30:00') },
    { id:9, name:"Deepak Patil", category:"Infrastructure", description:"Community hall building cracked and dangerous, needs immediate repair or demolition", urgency:"critical", ward:"Ward 8", timestamp:new Date('2026-07-03T14:00:00') },
    { id:10, name:"Sunita Joshi", category:"Sanitation", description:"Garbage not collected for 10 days, foul smell and mosquito breeding in our lane", urgency:"high", ward:"Ward 2", timestamp:new Date('2026-07-03T12:00:00') },
    { id:11, name:"Arjun Reddy", category:"Electricity", description:"Frequent power cuts 8-10 hours daily for past month, affecting small businesses", urgency:"critical", ward:"Ward 5", timestamp:new Date('2026-07-03T10:00:00') },
    { id:12, name:"Kavitha Nair", category:"Healthcare", description:"No medicines available at PHC, even basic paracetamol and ORS out of stock", urgency:"high", ward:"Ward 4", timestamp:new Date('2026-07-03T09:00:00') },
    { id:13, name:"Ramesh Gupta", category:"Infrastructure", description:"Footpath completely broken near market area, elderly people falling frequently", urgency:"medium", ward:"Ward 1", timestamp:new Date('2026-07-02T17:00:00') },
    { id:14, name:"Meena Kumari", category:"Water Supply", description:"Borewell dried up, no alternate water supply arranged by municipality", urgency:"high", ward:"Ward 7", timestamp:new Date('2026-07-02T15:00:00') },
    { id:15, name:"Sunil Verma", category:"Safety", description:"Chain snatching incidents increasing, no police patrol in our residential area", urgency:"high", ward:"Ward 6", timestamp:new Date('2026-07-02T13:00:00') },
    { id:16, name:"Geeta Devi", category:"Education", description:"No teacher for math and science in high school, students preparing for boards with no guidance", urgency:"high", ward:"Ward 3", timestamp:new Date('2026-07-02T11:00:00') },
    { id:17, name:"Ajay Tiwari", category:"Infrastructure", description:"Speed breaker on highway intersection too high, damaging vehicles and causing accidents", urgency:"medium", ward:"Ward 4", timestamp:new Date('2026-07-02T09:00:00') },
    { id:18, name:"Parveen Akhtar", category:"Employment", description:"Women in self-help groups need market linkages, products not reaching buyers", urgency:"medium", ward:"Ward 2", timestamp:new Date('2026-07-01T16:00:00') },
    { id:19, name:"Manoj Kumar", category:"Sanitation", description:"Open drain near school, children exposed to health hazards daily", urgency:"high", ward:"Ward 7", timestamp:new Date('2026-07-01T14:00:00') },
    { id:20, name:"Sarita Patel", category:"Electricity", description:"Transformer sparking and making noises, residents fear it may explode", urgency:"critical", ward:"Ward 1", timestamp:new Date('2026-07-01T12:00:00') },
    { id:21, name:"Krishna Murthy", category:"Infrastructure", description:"New colony roads not yet handed over to municipality, no maintenance being done", urgency:"medium", ward:"Ward 6", timestamp:new Date('2026-07-01T10:00:00') },
    { id:22, name:"Rekha Sharma", category:"Water Supply", description:"Pipeline leakage wasting huge amount of water, nobody fixing it for weeks", urgency:"medium", ward:"Ward 4", timestamp:new Date('2026-07-01T08:00:00') },
    { id:23, name:"Thangam Pandian", category:"Healthcare", description:"Ambulance service not available, emergency patients suffer during critical hours", urgency:"critical", ward:"Ward 8", timestamp:new Date('2026-06-30T18:00:00') },
    { id:24, name:"Rahul Deshmukh", category:"Employment", description:"Factory closed last year, 200 workers jobless, need retraining and placement support", urgency:"high", ward:"Ward 8", timestamp:new Date('2026-06-30T16:00:00') },
    { id:25, name:"Asha Rani", category:"Education", description:"Anganwadi center closed for months, no pre-primary education for children", urgency:"medium", ward:"Ward 5", timestamp:new Date('2026-06-30T14:00:00') },
    { id:26, name:"Balaji Rao", category:"Public Transport", description:"No bus service to our area, people have to walk 3km to nearest bus stop", urgency:"high", ward:"Ward 7", timestamp:new Date('2026-06-30T12:00:00') },
    { id:27, name:"Nirmala Devi", category:"Infrastructure", description:"Bridge railing broken over canal, very dangerous for children and two-wheelers", urgency:"critical", ward:"Ward 5", timestamp:new Date('2026-06-30T10:00:00') },
    { id:28, name:"Ganesh Patil", category:"Parks", description:"Only park in our area turned into dumping ground, needs restoration urgently", urgency:"medium", ward:"Ward 6", timestamp:new Date('2026-06-29T16:00:00') },
    { id:29, name:"Kamala Bai", category:"Water Supply", description:"Water meter not installed, getting inflated bills without actual usage tracking", urgency:"low", ward:"Ward 3", timestamp:new Date('2026-06-29T14:00:00') },
    { id:30, name:"Prakash Jha", category:"Safety", description:"Drunk driving on city roads increasing, need checkpoints and awareness drives", urgency:"medium", ward:"Ward 1", timestamp:new Date('2026-06-29T12:00:00') },
];
let nextId = submissions.length + 1;
let rankedPriorities = null;
let categoryChart = null;
let wardChart = null;
let dashboardVisible = false;

// Seed data didn't originally have status/submittedBy fields (added for the
// Citizen/MP role feature) — backfill them here instead of rewriting all 30 rows.
// submittedBy stays null for seed data since it predates any real logged-in user;
// a few are pre-set to in-progress/resolved so the MP view has realistic variety.
submissions.forEach(s => {
    if (s.status === undefined) s.status = 'pending';
    if (s.submittedBy === undefined) s.submittedBy = null;
    if (s.etaDays === undefined) s.etaDays = estimateResolutionDays(s.urgency);
});
[3, 11, 20, 27].forEach(id => { const s = submissions.find(x => x.id === id); if (s) s.status = 'in-progress'; });
[8, 18, 29].forEach(id => { const s = submissions.find(x => x.id === id); if (s) s.status = 'resolved'; });

// Category-level status, set by the MP after reviewing the AI-ranked action plan.
let categoryStatus = {};
function getCategoryStatus(category) { return categoryStatus[category] || 'pending'; }
function statusLabel(status) { return status === 'in-progress' ? 'In Progress' : status === 'resolved' ? 'Resolved' : 'Pending'; }
function statusBadgeHtml(status) { return `<span class="status-badge status-${status}">${statusLabel(status)}</span>`; }

// ===== UTILITY FUNCTIONS =====
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
}
function timeAgo(date) {
    const s = Math.floor((Date.now() - date) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s/60); if (m < 60) return m + 'm ago';
    const h = Math.floor(m/60); if (h < 24) return h + 'h ago';
    const d = Math.floor(h/24); return d + 'd ago';
}
function maskName(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0] + ' ' + parts[parts.length-1][0] + '.';
    return name[0] + '...';
}
function showToast(message, type='success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icon = type==='success'?'fa-check-circle':type==='error'?'fa-exclamation-circle':'fa-info-circle';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3500);
}
function animateCounter(el, target, duration=1200) {
    let start = 0; const inc = target / (duration/16);
    function tick() { start += inc; if (start >= target) { el.textContent = target; return; } el.textContent = Math.floor(start); requestAnimationFrame(tick); }
    tick();
}
function parseBudget(str) {
    if (str.includes('Crore')) return parseFloat(str) * 100;
    if (str.includes('Lakh')) return parseFloat(str);
    return 0;
}
function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// =========================================================================
// PHOTO UPLOAD + "AI" ISSUE RECOGNITION
//
// No backend here, so this is an honest, lightweight heuristic rather than a
// real vision model: it reads the photo's average color and matches it to
// whichever category's accent color (CATEGORY_COLORS) is closest — e.g. a
// mostly-green photo leans "Parks", a grey/dark one leans "Infrastructure" or
// "Electricity". It's a helpful starting guess, always shown as editable so
// the citizen can correct it, never submitted silently on their behalf.
// =========================================================================
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function getAverageColor(imgEl) {
    const canvas = document.createElement('canvas');
    const size = 40; // downsample, we only need a rough average
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, size, size);
    let r=0, g=0, b=0, count=0;
    try {
        const data = ctx.getImageData(0, 0, size, size).data;
        for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i+1]; b += data[i+2]; count++; }
    } catch (e) { return null; } // canvas may be tainted on file:// in some browsers
    return count ? { r: r/count, g: g/count, b: b/count } : null;
}

function nearestCategoryForColor(rgb) {
    let best = null, bestDist = Infinity;
    for (const cat in CATEGORY_COLORS) {
        const hex = CATEGORY_COLORS[cat];
        const cr = parseInt(hex.slice(1,3),16), cg = parseInt(hex.slice(3,5),16), cb = parseInt(hex.slice(5,7),16);
        const dist = (rgb.r-cr)**2 + (rgb.g-cg)**2 + (rgb.b-cb)**2;
        if (dist < bestDist) { bestDist = dist; best = cat; }
    }
    return best;
}

// Loads a data URL into an offscreen <img>, analyzes it, and resolves with a
// { category, confidence } guess. confidence is just a rough closeness score
// for display, not a real statistical measure.
function analyzePhotoForCategory(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const rgb = getAverageColor(img);
            if (!rgb) { resolve(null); return; }
            const category = nearestCategoryForColor(rgb);
            resolve({ category, confidence: 0.6 + Math.random()*0.25 });
        };
        img.onerror = () => resolve(null);
        img.src = dataUrl;
    });
}

// =========================================================================
// NOTIFICATIONS — a citizen gets notified (in-app) when their own report is
// marked Resolved by their MP, including the resolution photo if one was
// attached. Stored in localStorage keyed by user so it survives reloads and
// works even if the citizen signs in on a separate session than the MP.
// =========================================================================
function notifKey(userKey) { return 'pp_notifications_' + userKey; }

function getNotifications(userKey) {
    if (!userKey) return [];
    try { return JSON.parse(localStorage.getItem(notifKey(userKey)) || '[]'); } catch (e) { return []; }
}

function saveNotifications(userKey, list) {
    if (!userKey) return;
    try { localStorage.setItem(notifKey(userKey), JSON.stringify(list)); } catch (e) {}
}

function pushResolvedNotification(submission) {
    if (!submission.submittedBy) return; // seed/demo rows have no owner to notify
    const list = getNotifications(submission.submittedBy);
    list.unshift({
        id: 'n' + Date.now() + Math.floor(Math.random()*1000),
        submissionId: submission.id,
        category: submission.category,
        description: submission.description,
        ward: submission.ward,
        photo: submission.resolvedPhoto || null,
        resolvedAt: new Date().toISOString(),
        read: false
    });
    saveNotifications(submission.submittedBy, list);
    // If it's this same submission's owner viewing right now, refresh live.
    if (currentUser && getCurrentUserKey() === submission.submittedBy) {
        showToast(`Good news — your "${submission.category}" report was marked Resolved`, 'success');
        renderNotifications();
    }
}

// Called again when an MP attaches a photo after the fact, so the existing
// notification picks up the photo instead of creating a duplicate.
function updateResolvedNotificationPhoto(submission) {
    if (!submission.submittedBy) return;
    const list = getNotifications(submission.submittedBy);
    const note = list.find(n => n.submissionId === submission.id);
    if (note) { note.photo = submission.resolvedPhoto; saveNotifications(submission.submittedBy, list); }
    else { pushResolvedNotification(submission); return; }
    if (currentUser && getCurrentUserKey() === submission.submittedBy) renderNotifications();
}

function renderNotifications() {
    const bell = document.getElementById('notif-bell');
    if (!bell) return;
    const isMp = currentUser && currentUser.role === 'mp';
    bell.classList.toggle('hidden', !currentUser || isMp);
    if (!currentUser || isMp) return;

    const list = getNotifications(getCurrentUserKey());
    const unread = list.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge');
    badge.textContent = unread;
    badge.classList.toggle('hidden', unread === 0);

    const panel = document.getElementById('notif-list');
    if (!list.length) {
        panel.innerHTML = `<div class="notif-empty">No updates yet. You'll be notified here when your reports are resolved.</div>`;
        return;
    }
    panel.innerHTML = list.map(n => `
        <div class="notif-item ${n.read ? '' : 'notif-unread'}">
            ${n.photo ? `<img src="${n.photo}" class="notif-photo" alt="Resolution photo">` : `<div class="notif-photo notif-photo-placeholder"><i class="fas ${CATEGORY_ICONS[n.category] || 'fa-check'}"></i></div>`}
            <div class="notif-body">
                <div class="notif-title"><span class="notif-tag" style="background:${hexToRgba(CATEGORY_COLORS[n.category]||'#10B981',0.15)};color:${CATEGORY_COLORS[n.category]||'#10B981'}">${n.category}</span> resolved</div>
                <div class="notif-desc">${escapeHtml(n.description)}</div>
                <div class="notif-time">${timeAgo(new Date(n.resolvedAt))} • ${n.ward}</div>
            </div>
        </div>
    `).join('');
}

function toggleNotifPanel() {
    const panel = document.getElementById('notif-dropdown');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        const list = getNotifications(getCurrentUserKey());
        list.forEach(n => n.read = true);
        saveNotifications(getCurrentUserKey(), list);
        setTimeout(renderNotifications, 300); // let the badge linger a beat before clearing
    }
}

// ===== CLUSTERING & RANKING ALGORITHM =====
function analyzePriorities() {
    const clusters = {};
    submissions.forEach(s => {
        if (!clusters[s.category]) clusters[s.category] = [];
        clusters[s.category].push(s);
    });
    const ranked = Object.entries(clusters).map(([category, items]) => {
        const freq = items.length;
        const avgUrg = items.reduce((sum,i) => sum + URGENCY_SCORE[i.urgency], 0) / items.length;
        const recency = items.reduce((sum,i) => {
            const hrs = (Date.now() - i.timestamp) / 3600000;
            return sum + Math.max(0, 1 - hrs / 168);
        }, 0) / items.length;
        // Weighted score: frequency 35%, urgency 40%, recency 25%
        const score = freq * 0.35 * 4 + avgUrg * 0.40 * 4 + recency * 0.25 * 4;
        // Get top descriptions
        const topDescs = [...items].sort((a,b) => URGENCY_SCORE[b.urgency] - URGENCY_SCORE[a.urgency]).slice(0,2).map(i => i.description);
        const affectedWards = [...new Set(items.map(i => i.ward))];
        return { category, count: freq, avgUrgency: avgUrg, recencyScore: recency, score, items, topDescs, affectedWards };
    });
    return ranked.sort((a,b) => b.score - a.score);
}

// ===== UI RENDERING =====
function updateStats() {
    const cats = new Set(submissions.map(s => s.category));
    const wards = new Set(submissions.map(s => s.ward));
    const crit = submissions.filter(s => s.urgency === 'critical').length;
    animateCounter(document.getElementById('stat-total'), submissions.length);
    animateCounter(document.getElementById('stat-categories'), cats.size);
    animateCounter(document.getElementById('stat-wards'), wards.size);
    animateCounter(document.getElementById('stat-critical'), crit);
    document.getElementById('analyze-count').textContent = submissions.length;
}

function renderLiveFeed() {
    const feed = document.getElementById('live-feed');
    const sorted = [...submissions].sort((a,b) => b.timestamp - a.timestamp);
    feed.innerHTML = sorted.slice(0, 20).map(s => `
        <div class="feed-item bg-card border border-brd rounded-xl p-4 hover:border-muted/20 transition-colors">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">${escapeHtml(maskName(s.name))}</span>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full urgency-${s.urgency}"></span>
                    <span class="text-xs text-muted">${timeAgo(s.timestamp)}</span>
                </div>
            </div>
            <p class="text-xs text-muted/80 line-clamp-2 mb-2">${escapeHtml(s.description)}</p>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" style="background:${hexToRgba(CATEGORY_COLORS[s.category],0.15)};color:${CATEGORY_COLORS[s.category]}">${s.category}</span>
                <span class="text-[10px] text-muted">${s.ward}</span>
                ${statusBadgeHtml(s.status || 'pending')}
            </div>
        </div>
    `).join('');
}

function renderRankedCards(ranked) {
    const container = document.getElementById('ranked-cards');
    const maxScore = ranked[0]?.score || 1;
    container.innerHTML = ranked.map((r, i) => {
        const color = CATEGORY_COLORS[r.category];
        const icon = CATEGORY_ICONS[r.category];
        const pct = Math.round((r.score / maxScore) * 100);
        const urgLabel = r.avgUrgency >= 3.5 ? 'Critical' : r.avgUrgency >= 2.5 ? 'High' : r.avgUrgency >= 1.5 ? 'Medium' : 'Low';
        const urgColor = r.avgUrgency >= 3.5 ? '#EF4444' : r.avgUrgency >= 2.5 ? '#F97316' : r.avgUrgency >= 1.5 ? '#F59E0B' : '#10B981';
        return `
        <div class="priority-card bg-card border border-brd rounded-2xl p-5 cursor-default" style="border-top:3px solid ${color}">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:${hexToRgba(color,0.15)}">
                        <i class="fas ${icon}" style="color:${color}"></i>
                    </div>
                    <div>
                        <div class="font-heading font-bold text-sm">${r.category}</div>
                        <div class="text-xs text-muted">${r.count} submission${r.count>1?'s':''}</div>
                    </div>
                </div>
                <div class="font-heading text-3xl font-bold" style="color:${hexToRgba(color,0.3)}">#${i+1}</div>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between text-xs mb-1">
                    <span style="color:${urgColor}" class="font-medium">Avg Urgency: ${urgLabel}</span>
                    <span class="text-muted">${pct}% score</span>
                </div>
                <div class="w-full h-2 rounded-full bg-brd overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" data-target-width="${pct}%" style="width:0%;background:${color}"></div>
                </div>
            </div>
            <div class="space-y-1.5">
                ${r.topDescs.map(d => `<p class="text-[11px] text-muted/70 leading-relaxed line-clamp-2"><i class="fas fa-circle text-[4px] mr-1.5" style="color:${color}"></i>${escapeHtml(d)}</p>`).join('')}
            </div>
            <div class="mt-3 pt-3 border-t border-brd flex items-center gap-1.5 flex-wrap">
                ${r.affectedWards.slice(0,4).map(w => `<span class="text-[10px] px-1.5 py-0.5 rounded bg-brd text-muted">${w}</span>`).join('')}
                ${r.affectedWards.length > 4 ? `<span class="text-[10px] text-muted">+${r.affectedWards.length-4}</span>` : ''}
            </div>
        </div>`;
    }).join('');
    // Animate score bars
    requestAnimationFrame(() => {
        container.querySelectorAll('[data-target-width]').forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar.dataset.targetWidth; }, 100 + i*80);
        });
    });
}

function renderCharts(ranked) {
    if (categoryChart) categoryChart.destroy();
    if (wardChart) wardChart.destroy();
    // Category doughnut
    const catLabels = ranked.map(r => r.category);
    const catData = ranked.map(r => r.count);
    const catColors = ranked.map(r => CATEGORY_COLORS[r.category]);
    categoryChart = new Chart(document.getElementById('chart-category'), {
        type: 'doughnut',
        data: { labels: catLabels, datasets: [{ data: catData, backgroundColor: catColors, borderColor: '#0E1616', borderWidth: 3, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: {
            legend: { position:'right', labels: { color:'#6B8A8A', font:{ family:'DM Sans', size:11 }, padding:12, usePointStyle:true, pointStyleWidth:8 } }
        }}
    });
    // Ward bar chart
    const wardCounts = {};
    submissions.forEach(s => { wardCounts[s.ward] = (wardCounts[s.ward]||0) + 1; });
    const sortedWards = Object.entries(wardCounts).sort((a,b) => b[1]-a[1]);
    wardChart = new Chart(document.getElementById('chart-ward'), {
        type: 'bar',
        data: {
            labels: sortedWards.map(w => w[0]),
            datasets: [{ label:'Issues', data: sortedWards.map(w => w[1]), backgroundColor: hexToRgba('#0D9488',0.6), borderColor:'#0D9488', borderWidth:1, borderRadius:6, barPercentage:0.6 }]
        },
        options: { responsive:true, maintainAspectRatio:false, indexAxis:'y',
            scales: {
                x: { grid:{color:'rgba(26,42,42,0.5)'}, ticks:{color:'#6B8A8A',font:{family:'DM Sans',size:11}} },
                y: { grid:{display:false}, ticks:{color:'#E2EBEB',font:{family:'Space Grotesk',size:12,weight:500}} }
            },
            plugins: { legend:{display:false} }
        }
    });
}

function renderUrgencyBars() {
    const counts = { low:0, medium:0, high:0, critical:0 };
    submissions.forEach(s => counts[s.urgency]++);
    const total = submissions.length;
    const labels = { low:'Low', medium:'Medium', high:'High', critical:'Critical' };
    const colors = { low:'#10B981', medium:'#F59E0B', high:'#F97316', critical:'#EF4444' };
    const container = document.getElementById('urgency-bars');
    container.innerHTML = Object.entries(counts).map(([key, count]) => {
        const pct = total ? Math.round((count/total)*100) : 0;
        return `
        <div class="flex items-center gap-4">
            <div class="w-20 text-sm font-medium" style="color:${colors[key]}">${labels[key]}</div>
            <div class="flex-1 h-3 rounded-full bg-brd overflow-hidden">
                <div class="h-full rounded-full transition-all duration-1000" style="width:${pct}%;background:${colors[key]}"></div>
            </div>
            <div class="w-16 text-right text-sm text-muted">${count} <span class="text-xs">(${pct}%)</span></div>
        </div>`;
    }).join('');
}

function renderActionPlan(ranked) {
    const top5 = ranked.slice(0, 5);
    const container = document.getElementById('action-plan');
    const isMp = currentUser && currentUser.role === 'mp';
    container.innerHTML = top5.map((r, i) => {
        const tmpl = ACTION_TEMPLATES[r.category];
        const color = CATEGORY_COLORS[r.category];
        const status = getCategoryStatus(r.category);
        const statusControl = isMp ? `
            <select class="status-select" onchange="updateCategoryStatus('${r.category}', this.value)">
                <option value="pending" ${status==='pending'?'selected':''}>Pending</option>
                <option value="in-progress" ${status==='in-progress'?'selected':''}>In Progress</option>
                <option value="resolved" ${status==='resolved'?'selected':''}>Resolved</option>
            </select>` : statusBadgeHtml(status);
        return `
        <div class="action-card bg-card border border-brd rounded-2xl p-6" style="border-left-color:${color}">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background:${hexToRgba(color,0.15)}">
                        <i class="fas ${tmpl.icon} text-lg" style="color:${color}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="font-heading font-bold text-xs px-2 py-0.5 rounded-full" style="background:${hexToRgba(color,0.15)};color:${color}">Priority #${i+1}</span>
                            <span class="text-xs text-muted">Based on ${r.count} submissions</span>
                        </div>
                        <h4 class="font-heading font-bold text-lg">${tmpl.title}</h4>
                    </div>
                </div>
                <div class="flex items-center gap-4 text-xs shrink-0">
                    <div class="text-center"><div class="text-muted">Budget</div><div class="font-heading font-bold text-fg mt-0.5">${tmpl.budget}</div></div>
                    <div class="text-center"><div class="text-muted">Timeline</div><div class="font-heading font-bold text-fg mt-0.5">${tmpl.timeline}</div></div>
                    <div class="text-center"><div class="text-muted mb-1">Status</div>${statusControl}</div>
                </div>
            </div>
            <ul class="space-y-2 mb-3">
                ${tmpl.actions.map(a => `<li class="flex items-start gap-2 text-sm text-muted/90"><i class="fas fa-check-circle mt-0.5 shrink-0" style="color:${color}"></i>${a}</li>`).join('')}
            </ul>
            <div class="text-xs text-muted/60"><i class="fas fa-building mr-1"></i>Responsible: ${tmpl.dept}</div>
        </div>`;
    }).join('');
    // Total budget
    const totalLakhs = top5.reduce((sum, r) => sum + parseBudget(ACTION_TEMPLATES[r.category].budget), 0);
    const totalStr = totalLakhs >= 100 ? `₹${(totalLakhs/100).toFixed(1)} Crore` : `₹${totalLakhs} Lakhs`;
    document.getElementById('budget-total').textContent = totalStr;
    const allWards = new Set(top5.flatMap(r => r.affectedWards));
    document.getElementById('wards-impacted').textContent = allWards.size;
    const totalCitizens = top5.reduce((s,r) => s + r.count, 0);
    document.getElementById('citizens-count').textContent = totalCitizens;
}

// ===== AI CLUSTERING ANIMATION =====
function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, Math.max(0.01, w/2), Math.max(0.01, h/2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function runClusteringAnimation(callback) {
    const overlay = document.getElementById('ai-overlay');
    const canvas = document.getElementById('ai-canvas');
    const ctx = canvas.getContext('2d');
    overlay.classList.add('active');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Build clusters
    const clusters = {};
    submissions.forEach(s => {
        if (!clusters[s.category]) clusters[s.category] = [];
        clusters[s.category].push(s);
    });
    const clusterKeys = Object.keys(clusters);

    // Compute cluster center positions in a grid
    const cols = Math.ceil(Math.sqrt(clusterKeys.length * (canvas.width / canvas.height)));
    const rows = Math.ceil(clusterKeys.length / cols);
    const cellW = canvas.width / (cols + 1);
    const cellH = canvas.height / (rows + 1);
    const centers = {};
    clusterKeys.forEach((cat, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        centers[cat] = { x: cellW * (col + 1), y: cellH * (row + 1) };
    });

    // Create particles (each stores a reference to its own submission item — fixes the
    // original mismatched-index bug where localIdx was looked up against the wrong array)
    const particles = [];
    clusterKeys.forEach(cat => {
        clusters[cat].forEach(item => {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                color: CATEGORY_COLORS[cat],
                category: cat,
                item: item,
                radius: 3 + Math.random() * 2
            });
        });
    });

    // Sort clusters by eventual score for ranking display
    const ranked = analyzePriorities();
    const rankMap = {};
    ranked.forEach((r, i) => rankMap[r.category] = i + 1);

    let frame = 0;
    const totalFrames = 240;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function draw() {
        // Fade trail
        ctx.fillStyle = 'rgba(7,12,12,0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const clusterProgress = Math.min(frame / 150, 1);
        const eased = easeOut(clusterProgress);

        // Draw cluster halos
        if (clusterProgress > 0.4) {
            const haloAlpha = Math.min((clusterProgress - 0.4) / 0.3, 0.08);
            clusterKeys.forEach(cat => {
                const c = centers[cat];
                const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 90);
                grad.addColorStop(0, hexToRgba(CATEGORY_COLORS[cat], haloAlpha));
                grad.addColorStop(1, hexToRgba(CATEGORY_COLORS[cat], 0));
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(c.x, c.y, 90, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Update & draw particles
        particles.forEach(p => {
            const c = centers[p.category];
            const catItems = clusters[p.category];
            const localIdx = catItems.indexOf(p.item);
            const angle = (localIdx / Math.max(catItems.length, 1)) * Math.PI * 2 + localIdx * 1.2;
            const spread = 55 * (1 - eased * 0.65);
            const tx = c.x + Math.cos(angle) * spread;
            const ty = c.y + Math.sin(angle) * spread;
            p.x += (tx - p.x) * 0.06;
            p.y += (ty - p.y) * 0.06;

            // Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Line to center
            if (clusterProgress > 0.5) {
                const lineAlpha = Math.min((clusterProgress - 0.5) / 0.3, 0.15);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(c.x, c.y);
                ctx.strokeStyle = hexToRgba(p.color, lineAlpha);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });

        // Draw labels
        if (clusterProgress > 0.65) {
            const labelAlpha = Math.min((clusterProgress - 0.65) / 0.2, 1);
            clusterKeys.forEach(cat => {
                const c = centers[cat];
                ctx.font = `600 14px "Space Grotesk", sans-serif`;
                ctx.fillStyle = hexToRgba('#E2EBEB', labelAlpha);
                ctx.textAlign = 'center';
                ctx.fillText(cat, c.x, c.y - 55);
                ctx.font = `400 11px "DM Sans", sans-serif`;
                ctx.fillStyle = hexToRgba('#6B8A8A', labelAlpha);
                ctx.fillText(`${clusters[cat].length} submissions`, c.x, c.y - 40);
            });
        }

        // Draw rank numbers
        if (frame > 180) {
            const rankAlpha = Math.min((frame - 180) / 30, 1);
            clusterKeys.forEach(cat => {
                const c = centers[cat];
                const rank = rankMap[cat];
                ctx.font = `700 28px "Space Grotesk", sans-serif`;
                ctx.fillStyle = hexToRgba(CATEGORY_COLORS[cat], rankAlpha * 0.5);
                ctx.textAlign = 'center';
                ctx.fillText(`#${rank}`, c.x, c.y + 12);
            });
        }

        // Phase text
        const phase = frame < 50 ? 'Collecting citizen voices...' :
                      frame < 130 ? 'Clustering submissions by category...' :
                      frame < 180 ? 'Ranking by urgency, frequency & recency...' : 'Generating actionable development plan...';
        ctx.font = `500 16px "Space Grotesk", sans-serif`;
        ctx.fillStyle = '#F59E0B';
        ctx.textAlign = 'center';
        ctx.fillText(phase, canvas.width / 2, canvas.height - 60);

        // Progress bar
        const barW = 280, barX = (canvas.width - barW) / 2;
        ctx.fillStyle = '#1A2A2A';
        roundRect(ctx, barX, canvas.height - 38, barW, 5, 3);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        roundRect(ctx, barX, canvas.height - 38, Math.max(1, barW * (frame / totalFrames)), 5, 3);
        ctx.fill();

        frame++;
        if (frame < totalFrames) {
            requestAnimationFrame(draw);
        } else {
            setTimeout(() => {
                overlay.classList.remove('active');
                callback();
            }, 400);
        }
    }

    // Clear canvas first
    ctx.fillStyle = 'rgba(7,12,12,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
}

// ===== PHOTO UPLOAD (main form) =====
let pendingPhotoDataUrl = null;

async function handlePhotoSelect(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const preview = document.getElementById('photo-preview');
    const status = document.getElementById('photo-ai-status');
    try {
        pendingPhotoDataUrl = await readFileAsDataURL(file);
        preview.src = pendingPhotoDataUrl;
        preview.classList.remove('hidden');
        document.getElementById('photo-upload-empty').classList.add('hidden');
        document.getElementById('photo-change-btn').classList.remove('hidden');
        status.classList.remove('hidden');
        status.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>AI is looking at your photo...`;

        const result = await analyzePhotoForCategory(pendingPhotoDataUrl);
        if (result && result.category) {
            const catSelect = document.getElementById('f-category');
            catSelect.value = result.category;
            status.innerHTML = `<i class="fas fa-wand-magic-sparkles mr-2 text-accent"></i>AI detected: <b>${result.category}</b> (${Math.round(result.confidence*100)}% match) — change it above if that's not right.`;
        } else {
            status.innerHTML = `<i class="fas fa-circle-info mr-2"></i>Couldn't auto-detect a category from this photo — please pick one above.`;
        }
    } catch (e) {
        status.classList.remove('hidden');
        status.innerHTML = `<i class="fas fa-circle-exclamation mr-2 text-danger"></i>Couldn't read that photo, but you can still submit without it.`;
    }
}

function resetPhotoUpload() {
    pendingPhotoDataUrl = null;
    const preview = document.getElementById('photo-preview');
    const input = document.getElementById('f-photo');
    if (input) input.value = '';
    if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    document.getElementById('photo-upload-empty').classList.remove('hidden');
    document.getElementById('photo-change-btn').classList.add('hidden');
    document.getElementById('photo-ai-status').classList.add('hidden');
}

// ===== EVENT HANDLERS =====
function handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const ward = document.getElementById('f-ward').value;
    const category = document.getElementById('f-category').value;
    const urgencyEl = document.querySelector('input[name="urgency"]:checked');
    const desc = document.getElementById('f-desc').value.trim();

    if (!name) { showToast('Please enter your name', 'error'); return; }
    if (!ward) { showToast('Please select a ward', 'error'); return; }
    if (!category) { showToast('Please select a category', 'error'); return; }
    if (!urgencyEl) { showToast('Please select urgency level', 'error'); return; }
    if (!desc || desc.length < 10) { showToast('Please describe the issue (at least 10 characters)', 'error'); return; }

    const submission = {
        id: nextId++, name, category, description: desc,
        urgency: urgencyEl.value, ward, timestamp: new Date(),
        status: 'pending', submittedBy: getCurrentUserKey(),
        etaDays: estimateResolutionDays(urgencyEl.value),
        photo: pendingPhotoDataUrl || null
    };
    submissions.push(submission);

    // Reset form
    document.getElementById('priority-form').reset();
    document.getElementById('u-crit').checked = true;
    resetPhotoUpload();

    updateStats();
    renderLiveFeed();
    if (currentUser && currentUser.role !== 'mp') renderMySubmissions();
    showToast('Priority submitted successfully!', 'success');

    // Auto re-analyze if dashboard visible
    if (dashboardVisible) {
        rankedPriorities = analyzePriorities();
        renderRankedCards(rankedPriorities);
        renderCharts(rankedPriorities);
        renderUrgencyBars();
        renderActionPlan(rankedPriorities);
        if (currentUser && currentUser.role === 'mp') renderManageSubmissionsTable();
        showToast('Dashboard updated with new data', 'info');
    }
}

function addRandomSubmissions(count = 5) {
    for (let i = 0; i < count; i++) {
        const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const issues = RANDOM_ISSUES[cat];
        const urgency = ['low','medium','high','critical'][Math.floor(Math.random()*4)];
        submissions.push({
            id: nextId++,
            name: RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)],
            category: cat,
            description: issues[Math.floor(Math.random() * issues.length)],
            urgency, etaDays: estimateResolutionDays(urgency),
            ward: WARDS[Math.floor(Math.random() * WARDS.length)],
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 5),
            status: 'pending', submittedBy: null
        });
    }
    updateStats();
    renderLiveFeed();
    showToast(`Added ${count} demo submissions`, 'info');
}

function handleAnalyze() {
    if (!currentUser || currentUser.role !== 'mp') {
        showToast('Only your MP / representative can run the AI analysis', 'error');
        return;
    }
    if (submissions.length < 3) {
        showToast('Need at least 3 submissions to analyze', 'error');
        return;
    }
    const btn = document.getElementById('btn-analyze');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>Analyzing...';
    btn.classList.remove('pulse-glow');

    runClusteringAnimation(() => {
        rankedPriorities = analyzePriorities();
        const dash = document.getElementById('dashboard');
        dash.style.display = 'block';
        // Trigger reflow then animate in
        void dash.offsetHeight;
        requestAnimationFrame(() => {
            dash.classList.add('visible');
            dashboardVisible = true;
        });
        renderRankedCards(rankedPriorities);
        renderCharts(rankedPriorities);
        renderUrgencyBars();
        renderActionPlan(rankedPriorities);
        renderManageSubmissionsTable();
        document.getElementById('manage-submissions-panel').classList.remove('hidden');
        document.getElementById('btn-reanalyze').classList.remove('hidden');

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles mr-3"></i>Re-run Analysis';
        btn.classList.remove('pulse-glow');

        setTimeout(() => {
            dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    });
}

// ----- Role-specific data views (Citizen: My Submissions / MP: Manage Submissions) -----
function updateCategoryStatus(category, status) {
    categoryStatus[category] = status;
    showToast(`"${category}" marked as ${statusLabel(status)}`, 'info');
}

function updateSubmissionStatus(id, status) {
    const s = submissions.find(x => x.id === id);
    if (!s) return;
    const wasResolved = s.status === 'resolved';
    s.status = status;
    if (status === 'resolved' && !wasResolved) {
        s.resolvedAt = new Date();
        pushResolvedNotification(s);
    }
    renderLiveFeed();
    if (currentUser && currentUser.role !== 'mp') renderMySubmissions();
    if (currentUser && currentUser.role === 'mp') renderManageSubmissionsTable();
}

// Lets the MP attach a "proof of work" photo to a resolved submission after
// the fact — triggered from the Manage table's "Add photo" link. Updates the
// citizen's existing Resolved notification instead of creating a new one.
let pendingResolvePhotoId = null;
function promptResolvePhoto(id) {
    pendingResolvePhotoId = id;
    document.getElementById('resolve-photo-input').click();
}
async function handleResolvePhotoSelect(input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (!file || !pendingResolvePhotoId) return;
    const s = submissions.find(x => x.id === pendingResolvePhotoId);
    pendingResolvePhotoId = null;
    if (!s) return;
    try {
        s.resolvedPhoto = await readFileAsDataURL(file);
        updateResolvedNotificationPhoto(s);
        renderManageSubmissionsTable();
        showToast('Resolution photo attached — citizen notification updated', 'success');
    } catch (e) {
        showToast('Could not read that photo', 'error');
    }
}

function renderMySubmissions() {
    const key = getCurrentUserKey();
    const mine = submissions.filter(s => s.submittedBy && s.submittedBy === key).sort((a,b) => b.timestamp - a.timestamp);
    const list = document.getElementById('my-submissions-list');
    const empty = document.getElementById('my-submissions-empty');
    if (!mine.length) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');
    list.innerHTML = mine.map(s => `
        <div class="my-submission-card">
            ${s.photo ? `<img src="${s.photo}" class="my-submission-photo" alt="Submitted photo">` : ''}
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" style="background:${hexToRgba(CATEGORY_COLORS[s.category],0.15)};color:${CATEGORY_COLORS[s.category]}">${s.category}</span>
                    <span class="text-xs text-muted">${s.ward} • ${timeAgo(s.timestamp)}</span>
                </div>
                <p class="text-sm text-fg/90 mb-1">${escapeHtml(s.description)}</p>
                <p class="text-xs text-muted"><i class="fas fa-clock mr-1"></i>${etaText(s)}</p>
                ${s.resolvedPhoto ? `<img src="${s.resolvedPhoto}" class="my-submission-resolved-photo" alt="Resolution photo" title="Photo of the completed work">` : ''}
            </div>
            ${statusBadgeHtml(s.status || 'pending')}
        </div>
    `).join('');
}

function renderManageSubmissionsTable() {
    const tbody = document.getElementById('manage-submissions-tbody');
    if (!tbody) return;
    const sorted = [...submissions].sort((a,b) => b.timestamp - a.timestamp);
    tbody.innerHTML = sorted.map(s => `
        <tr>
            <td class="p-4">${escapeHtml(maskName(s.name))}</td>
            <td class="p-4"><span class="text-xs" style="color:${CATEGORY_COLORS[s.category]}">${s.category}</span></td>
            <td class="p-4 text-xs text-muted">${s.ward}</td>
            <td class="p-4"><span class="w-2 h-2 rounded-full urgency-${s.urgency} inline-block mr-1"></span><span class="text-xs capitalize">${s.urgency}</span></td>
            <td class="p-4 msg-desc">
                ${escapeHtml(s.description)}
                ${s.photo ? `<img src="${s.photo}" class="table-photo-thumb" alt="Citizen photo" title="Photo submitted by citizen">` : ''}
                <div class="text-[11px] text-muted mt-1"><i class="fas fa-clock mr-1"></i>${etaText(s)}</div>
            </td>
            <td class="p-4">
                <select class="status-select" onchange="updateSubmissionStatus(${s.id}, this.value)">
                    <option value="pending" ${s.status==='pending'?'selected':''}>Pending</option>
                    <option value="in-progress" ${s.status==='in-progress'?'selected':''}>In Progress</option>
                    <option value="resolved" ${s.status==='resolved'?'selected':''}>Resolved</option>
                </select>
                ${s.status==='resolved' ? `
                    <button type="button" class="add-resolve-photo-btn" onclick="promptResolvePhoto(${s.id})" title="Attach a photo of the completed work">
                        <i class="fas fa-camera mr-1"></i>${s.resolvedPhoto ? 'Change photo' : 'Add photo'}
                    </button>
                    ${s.resolvedPhoto ? `<img src="${s.resolvedPhoto}" class="table-photo-thumb" alt="Resolution photo">` : ''}
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// =========================================================================
// AUTHENTICATION
// =========================================================================
// This is a client-side DEMO auth system — good enough for a hackathon demo,
// but it has no real backend, so:
//   - "signed up" accounts only live in memory and reset on page reload
//   - phone OTP is simulated locally (shown on-screen) since there's no SMS gateway
//   - Google Sign-In is fully real, but needs YOUR OWN Google Client ID (free, from
//     https://console.cloud.google.com/apis/credentials -> "OAuth client ID" -> Web application)
// For a production app, swap this out for Firebase Auth, Supabase Auth, or your own backend.
// =========================================================================

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // <-- replace this

let currentUser = null;           // { name, email, method, role, avatarUrl? }
let mockUsers = [];                // in-memory "database" of email/password accounts: {name, email, password, role}
let pendingPhone = null;           // phone number currently being verified
let pendingOtp = null;             // the OTP we generated for that phone
let selectedAuthRole = 'citizen';  // 'citizen' | 'mp' — chosen on the sign-in screen before any auth method

function selectAuthRole(role) {
    selectedAuthRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === role);
    });
}

function parseJwt(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

function initials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

function getCurrentUserKey() {
    if (!currentUser) return null;
    return currentUser.email || currentUser.phone || currentUser.name;
}

// Toggles which sections/buttons are visible based on the signed-in user's role.
// Citizens: submit + track their own reports; can't run analysis or manage others' submissions.
// MPs: run/re-run the AI analysis, manage priority + individual submission status; no submit form.
//
// Mechanism: any element carrying data-role="citizen" or data-role="mp" is shown only
// to that role and hidden from the other — a single sweep instead of toggling each
// element by hand, so the two views stay properly, consistently separated.
function applyRoleUI() {
    if (!currentUser) return;
    const isMp = currentUser.role === 'mp';

    document.getElementById('user-role-badge').textContent = isMp ? 'MP' : 'Citizen';
    document.getElementById('user-role-badge').className = `user-role-badge ${isMp ? 'role-mp' : 'role-citizen'}`;

    document.querySelectorAll('[data-role]').forEach(el => {
        el.classList.toggle('hidden', el.dataset.role !== currentUser.role);
    });

    // MPs don't get a submission form, so their live feed takes the full row width.
    document.getElementById('live-feed-block').classList.toggle('role-full-width', isMp);

    if (!isMp) renderMySubmissions();
    if (isMp && dashboardVisible) renderManageSubmissionsTable();
}

// Hero "View Dashboard" button: jump straight to the ranked dashboard if analysis has
// already run, otherwise send the user to the analyze section (MPs see the button
// there; citizens see the "waiting on your MP" note).
function scrollToDashboardOrAnalyze() {
    const target = dashboardVisible ? document.getElementById('dashboard') : document.getElementById('analyze-section');
    target.scrollIntoView({ behavior: 'smooth' });
}

function setSignedInUser(user) {
    currentUser = user;
    if (!currentUser.role) currentUser.role = selectedAuthRole;
    // Reflect user in navbar
    document.getElementById('user-name-slot').textContent = user.name.split(' ')[0];
    const avatarSlot = document.getElementById('user-avatar-slot');
    if (user.avatarUrl) {
        avatarSlot.innerHTML = `<img src="${user.avatarUrl}" alt="${escapeHtml(user.name)}">`;
    } else {
        avatarSlot.innerHTML = `<span class="user-avatar-fallback">${initials(user.name)}</span>`;
    }
    // Unlock the app
    document.getElementById('app-content').classList.remove('locked');
    document.getElementById('auth-overlay').classList.add('hidden');
    // Pre-fill the submission form's name field as a nice touch
    const nameField = document.getElementById('f-name');
    if (nameField && !nameField.value) nameField.value = user.name;

    applyRoleUI();
    renderNotifications();
    showToast(`Signed in as ${user.name} (${currentUser.role === 'mp' ? 'MP' : 'Citizen'})`, 'success');
}

function logout() {
    currentUser = null;
    document.getElementById('user-menu').classList.add('hidden');
    document.getElementById('notif-dropdown').classList.add('hidden');
    renderNotifications();
    document.getElementById('app-content').classList.add('locked');
    document.getElementById('auth-overlay').classList.remove('hidden');
    // Reset auth forms
    document.getElementById('email-auth-form').reset();
    document.getElementById('phone-step-otp').classList.add('hidden');
    document.getElementById('phone-step-number').classList.remove('hidden');
    document.getElementById('auth-phone').value = '';
    showToast('Logged out', 'info');
}

function toggleUserMenu() {
    document.getElementById('user-menu').classList.toggle('hidden');
}
document.addEventListener('click', (e) => {
    const badge = document.getElementById('user-badge');
    const menu = document.getElementById('user-menu');
    if (menu && !menu.classList.contains('hidden') && !badge.contains(e.target)) {
        menu.classList.add('hidden');
    }
    const bell = document.getElementById('notif-bell');
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden') && bell && !bell.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// ----- Google Sign-In -----
function handleGoogleCredentialResponse(response) {
    const payload = parseJwt(response.credential);
    if (!payload) {
        showToast('Google sign-in failed to parse response', 'error');
        return;
    }
    setSignedInUser({
        name: payload.name || payload.email,
        email: payload.email,
        method: 'google',
        avatarUrl: payload.picture,
        role: selectedAuthRole
    });
}

function showDisabledGoogleButton(reasonTitle) {
    const wrap = document.getElementById('google-signin-btn');
    wrap.innerHTML = `
        <button type="button" class="auth-btn-primary" style="background:#1A2A2A;color:#6B8A8A;cursor:not-allowed" title="${reasonTitle}">
            <i class="fab fa-google mr-2"></i>Continue with Google
        </button>`;
}

function initGoogleSignIn(retriesLeft = 20) {
    // 1) You must run this over http(s):// — Google Identity Services refuses to work
    //    when the page is opened directly as a file:// URL. Serve it, e.g.:
    //      python3 -m http.server 8000    then open http://localhost:8000
    if (location.protocol === 'file:') {
        showDisabledGoogleButton('Google Sign-In needs the page served over http/https, not opened as a local file. Run a local server (e.g. "python3 -m http.server") and open it via http://localhost.');
        return;
    }

    if (GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
        showDisabledGoogleButton('Add your real Google Client ID at the top of script.js to enable this.');
        return;
    }

    // 2) The GSI script tag loads with async/defer, so on a slow connection
    //    window.google might not exist yet when this function first runs.
    //    Poll briefly instead of giving up immediately.
    if (!window.google || !window.google.accounts) {
        if (retriesLeft > 0) {
            setTimeout(() => initGoogleSignIn(retriesLeft - 1), 250);
        } else {
            showDisabledGoogleButton('Google Sign-In script failed to load. Check your internet connection and that accounts.google.com is not blocked.');
        }
        return;
    }

    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse
        });
        google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
            theme: 'filled_black', size: 'large', shape: 'pill', width: 320
        });
        // Optional: also show the "One Tap" prompt automatically
        // google.accounts.id.prompt();
    } catch (err) {
        console.error('Google Sign-In init failed:', err);
        showDisabledGoogleButton('Google Sign-In failed to initialize — check the browser console for details. This usually means the Client ID is wrong or the current URL is not in "Authorized JavaScript origins" in Google Cloud Console.');
    }
}

// ----- Email / Password (mock) -----
let emailAuthMode = 'signin'; // or 'signup'

function setEmailAuthMode(mode) {
    emailAuthMode = mode;
    const nameWrap = document.getElementById('signup-name-wrap');
    const submitBtn = document.getElementById('email-auth-submit');
    const toggleText = document.getElementById('email-auth-toggle-text');
    const toggleBtn = document.getElementById('email-auth-toggle');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    hideEmailError();

    if (mode === 'signup') {
        nameWrap.classList.remove('hidden');
        submitBtn.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleBtn.textContent = 'Sign In';
        title.textContent = 'Create Your Account';
        subtitle.textContent = 'Join and start submitting civic priorities';
    } else {
        nameWrap.classList.add('hidden');
        submitBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = 'Sign Up';
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to submit and view civic priorities';
    }
}

function showEmailError(msg) {
    const el = document.getElementById('email-auth-error');
    el.textContent = msg;
    el.classList.add('show');
}
function hideEmailError() {
    document.getElementById('email-auth-error').classList.remove('show');
}

function handleEmailAuthSubmit(e) {
    e.preventDefault();
    hideEmailError();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showEmailError('Please enter a valid email address.');
        return;
    }
    if (!password || password.length < 6) {
        showEmailError('Password must be at least 6 characters.');
        return;
    }

    if (emailAuthMode === 'signup') {
        const name = document.getElementById('auth-name').value.trim();
        if (!name) { showEmailError('Please enter your full name.'); return; }
        if (mockUsers.some(u => u.email === email)) {
            showEmailError('An account with this email already exists. Try signing in.');
            return;
        }
        mockUsers.push({ name, email, password, role: selectedAuthRole });
        setSignedInUser({ name, email, method: 'email', role: selectedAuthRole });
    } else {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (!user) {
            showEmailError('Incorrect email or password, or no account exists yet.');
            return;
        }
        setSignedInUser({ name: user.name, email: user.email, method: 'email', role: user.role });
    }
}

// ----- Phone / OTP (simulated) -----
function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function handleSendOtp() {
    const errorEl = document.getElementById('phone-number-error');
    errorEl.classList.remove('show');
    const code = document.getElementById('phone-code').value.trim();
    const number = document.getElementById('auth-phone').value.trim();

    if (!/^\d{7,15}$/.test(number)) {
        errorEl.textContent = 'Please enter a valid phone number.';
        errorEl.classList.add('show');
        return;
    }

    pendingPhone = `${code} ${number}`;
    pendingOtp = generateOtp();

    document.getElementById('otp-phone-display').textContent = pendingPhone;
    document.getElementById('demo-otp-code').textContent = pendingOtp;
    document.getElementById('phone-step-number').classList.add('hidden');
    document.getElementById('phone-step-otp').classList.remove('hidden');
    document.querySelectorAll('.otp-inputs input').forEach(inp => inp.value = '');
    document.querySelector('.otp-inputs input').focus();

    showToast(`OTP sent to ${pendingPhone} (demo mode)`, 'info');
}

function handleVerifyOtp() {
    const errorEl = document.getElementById('otp-error');
    errorEl.classList.remove('show');
    const digits = [...document.querySelectorAll('.otp-inputs input')].map(i => i.value).join('');

    if (digits.length !== 6) {
        errorEl.textContent = 'Please enter all 6 digits.';
        errorEl.classList.add('show');
        return;
    }
    if (digits !== pendingOtp) {
        errorEl.textContent = 'Incorrect code. Please try again.';
        errorEl.classList.add('show');
        return;
    }

    setSignedInUser({ name: `User ${pendingPhone}`, email: null, method: 'phone', phone: pendingPhone, role: selectedAuthRole });
    pendingOtp = null;
    pendingPhone = null;
}

function setupOtpInputsAutoAdvance() {
    const inputs = [...document.querySelectorAll('.otp-inputs input')];
    inputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '').slice(0, 1);
            if (input.value && idx < inputs.length - 1) inputs[idx + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) inputs[idx - 1].focus();
        });
    });
}

// ----- Auth tabs (Email / Phone) -----
function setupAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${tab.dataset.method}`).classList.add('active');
        });
    });
}

function initAuth() {
    setupAuthTabs();
    setupOtpInputsAutoAdvance();
    initGoogleSignIn();

    document.getElementById('email-auth-form').addEventListener('submit', handleEmailAuthSubmit);
    document.getElementById('email-auth-toggle').addEventListener('click', () => {
        setEmailAuthMode(emailAuthMode === 'signin' ? 'signup' : 'signin');
    });
    document.getElementById('btn-send-otp').addEventListener('click', handleSendOtp);
    document.getElementById('btn-verify-otp').addEventListener('click', handleVerifyOtp);
    document.getElementById('btn-change-number').addEventListener('click', () => {
        document.getElementById('phone-step-otp').classList.add('hidden');
        document.getElementById('phone-step-number').classList.remove('hidden');
    });

    // App starts locked/logged-out
    document.getElementById('app-content').classList.add('locked');
}

// =========================================================================
// VOICE ASSIST — for citizens who can't read/write or aren't comfortable
// with forms. Speaks each question aloud (text-to-speech) and listens for
// the spoken answer (speech-to-text), then confirms out loud once saved.
// Works in Chrome / Edge / most Android browsers. Needs a real Client ID
// for nothing — this uses the browser's built-in Web Speech API, no setup.
// =========================================================================

const VOICE_STRINGS = {
    'en-IN': {
        pickLanguage: 'Choose your language',
        askName: 'Please say your full name after the beep.',
        askWard: 'Which ward do you live in? Please say the ward number, for example, ward three.',
        askCategory: 'What is the problem about? You can say things like water, road, electricity, health, school, safety, job, garbage, bus, or park.',
        askDesc: 'Please describe the problem in a few sentences.',
        askUrgency: 'How serious is this problem? Say low, medium, high, or critical.',
        confirmPrefix: 'Here is what I heard.',
        confirmAsk: 'Say yes to save this, or no to start over.',
        savedSpeech: 'Thank you. Your problem has been recorded and saved successfully.',
        cancelledSpeech: 'Okay, let us start again.',
        notUnderstoodWard: "Sorry, I didn't understand the ward number. Please say it again, like ward three.",
        notUnderstoodCategory: "Sorry, I didn't understand the category. Please try again with a simple word like water, road, or health.",
        notUnderstoodUrgency: "Sorry, please say only low, medium, high, or critical.",
        notUnderstoodYesNo: "Please say yes or no.",
        listening: 'Listening...',
        tapToBegin: 'Tap the mic to begin',
        micDenied: 'Microphone access was blocked. Please allow microphone access and try again.',
        needMoreWords: "I didn't catch that clearly. Please try again.",
        labels: { name:'Name', ward:'Ward', category:'Category', urgency:'Urgency', desc:'Details' },
        yes: ['yes','yeah','yep','correct','ok','okay','sure'],
        no: ['no','nope','wrong','cancel'],
        numberWords: {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8},
        categoryKeywords: {
            'Water Supply': ['water','tap','pipeline','borewell'],
            'Infrastructure': ['road','street','pothole','bridge','drainage','building'],
            'Healthcare': ['health','hospital','doctor','medicine','clinic'],
            'Education': ['school','teacher','education','college'],
            'Safety': ['police','safety','theft','crime','danger','safe'],
            'Employment': ['job','employment','work','jobless'],
            'Sanitation': ['garbage','trash','sanitation','dirty','waste','sewage'],
            'Electricity': ['electricity','current','power','light','transformer'],
            'Public Transport': ['bus','transport','auto'],
            'Parks': ['park','garden']
        },
        urgencyKeywords: {
            low: ['low','small','minor'],
            medium: ['medium','normal','moderate'],
            high: ['high','serious','urgent'],
            critical: ['critical','emergency','very serious','severe']
        }
    },
    'hi-IN': {
        askName: 'बीप के बाद कृपया अपना पूरा नाम बताएं।',
        askWard: 'आप किस वार्ड में रहते हैं? कृपया वार्ड नंबर बताएं, जैसे वार्ड तीन।',
        askCategory: 'समस्या किस बारे में है? आप पानी, सड़क, बिजली, स्वास्थ्य, स्कूल, सुरक्षा, नौकरी, कचरा, बस, या पार्क जैसे शब्द बोल सकते हैं।',
        askDesc: 'कृपया समस्या के बारे में कुछ वाक्यों में बताएं।',
        askUrgency: 'यह समस्या कितनी गंभीर है? कम, सामान्य, गंभीर, या अत्यंत गंभीर बोलें।',
        confirmPrefix: 'मैंने यह सुना है।',
        confirmAsk: 'सहेजने के लिए हाँ बोलें, या फिर से शुरू करने के लिए नहीं बोलें।',
        savedSpeech: 'धन्यवाद। आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।',
        cancelledSpeech: 'ठीक है, फिर से शुरू करते हैं।',
        notUnderstoodWard: 'माफ़ कीजिए, वार्ड नंबर समझ नहीं आया। कृपया फिर से बताएं, जैसे वार्ड तीन।',
        notUnderstoodCategory: 'माफ़ कीजिए, समझ नहीं आया। कृपया पानी, सड़क, या स्वास्थ्य जैसे आसान शब्द से बताएं।',
        notUnderstoodUrgency: 'कृपया केवल कम, सामान्य, गंभीर, या अत्यंत गंभीर बोलें।',
        notUnderstoodYesNo: 'कृपया हाँ या नहीं बोलें।',
        listening: 'सुन रहा हूँ...',
        tapToBegin: 'शुरू करने के लिए माइक दबाएं',
        micDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अनुमति दें और फिर से प्रयास करें।',
        needMoreWords: 'मुझे ठीक से समझ नहीं आया। कृपया फिर से बोलें।',
        labels: { name:'नाम', ward:'वार्ड', category:'श्रेणी', urgency:'गंभीरता', desc:'विवरण' },
        yes: ['हाँ','जी हाँ','ठीक है'],
        no: ['नहीं','ना'],
        numberWords: {'एक':1,'दो':2,'तीन':3,'चार':4,'पांच':5,'छह':6,'सात':7,'आठ':8},
        categoryKeywords: {
            'Water Supply': ['पानी','नल','पाइपलाइन'],
            'Infrastructure': ['सड़क','रोड','गड्ढा','पुल','नाली'],
            'Healthcare': ['स्वास्थ्य','अस्पताल','डॉक्टर','दवा'],
            'Education': ['स्कूल','शिक्षा','टीचर'],
            'Safety': ['पुलिस','सुरक्षा','चोरी','अपराध'],
            'Employment': ['नौकरी','काम','रोजगार'],
            'Sanitation': ['कचरा','गंदगी','सफाई'],
            'Electricity': ['बिजली','करंट','ट्रांसफार्मर'],
            'Public Transport': ['बस','परिवहन'],
            'Parks': ['पार्क','बगीचा']
        },
        urgencyKeywords: {
            low: ['कम'],
            medium: ['सामान्य','मध्यम'],
            high: ['गंभीर','ज़रूरी'],
            critical: ['अत्यंत गंभीर','आपातकाल','बहुत गंभीर']
        }
    },
    'te-IN': {
        askName: 'బీప్ తర్వాత దయచేసి మీ పూర్తి పేరు చెప్పండి.',
        askWard: 'మీరు ఏ వార్డులో నివసిస్తున్నారు? దయచేసి వార్డు నంబర్ చెప్పండి, ఉదాహరణకు వార్డు మూడు.',
        askCategory: 'సమస్య దేని గురించి? నీరు, రోడ్డు, కరెంట్, ఆరోగ్యం, స్కూల్, భద్రత, ఉద్యోగం, చెత్త, బస్సు, లేదా పార్క్ వంటి పదాలు చెప్పవచ్చు.',
        askDesc: 'దయచేసి సమస్యను కొన్ని వాక్యాలలో వివరించండి.',
        askUrgency: 'ఈ సమస్య ఎంత తీవ్రమైనది? తక్కువ, మధ్యస్థ, తీవ్రమైన, లేదా చాలా తీవ్రమైనది అని చెప్పండి.',
        confirmPrefix: 'నేను ఇది విన్నాను.',
        confirmAsk: 'సేవ్ చేయడానికి అవును చెప్పండి, లేదా మళ్ళీ మొదలుపెట్టడానికి కాదు చెప్పండి.',
        savedSpeech: 'ధన్యవాదాలు. మీ సమస్య విజయవంతంగా నమోదు చేయబడింది.',
        cancelledSpeech: 'సరే, మళ్ళీ మొదలుపెడదాం.',
        notUnderstoodWard: 'క్షమించండి, వార్డు నంబర్ అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి, వార్డు మూడు లాగా.',
        notUnderstoodCategory: 'క్షమించండి, అర్థం కాలేదు. దయచేసి నీరు, రోడ్డు, లేదా ఆరోగ్యం వంటి సులభమైన పదంతో చెప్పండి.',
        notUnderstoodUrgency: 'దయచేసి తక్కువ, మధ్యస్థ, తీవ్రమైన, లేదా చాలా తీవ్రమైనది అని మాత్రమే చెప్పండి.',
        notUnderstoodYesNo: 'దయచేసి అవును లేదా కాదు చెప్పండి.',
        listening: 'వింటున్నాను...',
        tapToBegin: 'ప్రారంభించడానికి మైక్ నొక్కండి',
        micDenied: 'మైక్రోఫోన్ అనుమతి లభించలేదు. దయచేసి అనుమతి ఇచ్చి మళ్ళీ ప్రయత్నించండి.',
        needMoreWords: 'నాకు సరిగ్గా అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి.',
        labels: { name:'పేరు', ward:'వార్డు', category:'వర్గం', urgency:'తీవ్రత', desc:'వివరాలు' },
        yes: ['అవును'],
        no: ['కాదు'],
        numberWords: {'ఒకటి':1,'రెండు':2,'మూడు':3,'నాలుగు':4,'ఐదు':5,'ఆరు':6,'ఏడు':7,'ఎనిమిది':8},
        categoryKeywords: {
            'Water Supply': ['నీరు','నీటి','కొళాయి'],
            'Infrastructure': ['రోడ్డు','రహదారి','వంతెన','డ్రైనేజీ'],
            'Healthcare': ['ఆరోగ్యం','ఆసుపత్రి','డాక్టర్','మందు'],
            'Education': ['స్కూల్','పాఠశాల','ఉపాధ్యాయుడు'],
            'Safety': ['పోలీసు','భద్రత','దొంగతనం','నేరం'],
            'Employment': ['ఉద్యోగం','పని'],
            'Sanitation': ['చెత్త','పరిశుభ్రత','మురుగు'],
            'Electricity': ['కరెంట్','విద్యుత్','ట్రాన్స్ఫార్మర్'],
            'Public Transport': ['బస్సు','రవాణా'],
            'Parks': ['పార్క్','ఉద్యానవనం']
        },
        urgencyKeywords: {
            low: ['తక్కువ'],
            medium: ['మధ్యస్థ'],
            high: ['తీవ్రమైన'],
            critical: ['చాలా తీవ్రమైనది','అత్యవసరం']
        }
    }
};

let voiceLang = 'en-IN';
let voiceRecognition = null;
let voiceListening = false;
let voiceData = { name:'', ward:'', wardRaw:'', category:'', urgency:'', desc:'', photo:null };
let voiceFlowActive = false;

function speechSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function speak(text, lang) {
    return new Promise(resolve => {
        if (!window.speechSynthesis) { resolve(); return; }
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang || voiceLang;
        utter.rate = 0.95;
        utter.onend = resolve;
        utter.onerror = resolve;
        window.speechSynthesis.speak(utter);
    });
}

// Listens once and resolves with the recognized transcript (lowercased for
// English; kept as-is for Hindi/Telugu since they use different scripts).
function listenOnce() {
    return new Promise((resolve, reject) => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { reject(new Error('unsupported')); return; }

        const recognition = new SR();
        voiceRecognition = recognition;
        recognition.lang = voiceLang;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        let finalTranscript = '';
        setVoiceListeningUI(true);

        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalTranscript += transcript;
                else interim += transcript;
            }
            document.getElementById('voice-transcript').textContent = finalTranscript || interim;
        };
        recognition.onerror = (event) => {
            setVoiceListeningUI(false);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                reject(new Error('denied'));
            } else if (event.error === 'no-speech') {
                reject(new Error('no-speech'));
            } else {
                reject(new Error(event.error || 'unknown'));
            }
        };
        recognition.onend = () => {
            setVoiceListeningUI(false);
            resolve(finalTranscript.trim());
        };
        try {
            recognition.start();
        } catch (e) {
            reject(e);
        }
    });
}

function setVoiceListeningUI(isListening) {
    voiceListening = isListening;
    const circle = document.getElementById('voice-mic-circle');
    const pulse = document.getElementById('voice-mic-pulse');
    const status = document.getElementById('voice-status');
    if (!circle) return;
    circle.classList.toggle('listening', isListening);
    pulse.classList.toggle('active', isListening);
    if (isListening) status.textContent = VOICE_STRINGS[voiceLang].listening || 'Listening...';
}

function matchNumberFromSpeech(text, lang) {
    const digitMatch = text.match(/\d+/);
    if (digitMatch) return parseInt(digitMatch[0], 10);
    const words = VOICE_STRINGS[lang].numberWords;
    for (const w in words) {
        if (text.includes(w)) return words[w];
    }
    return null;
}

function matchCategoryFromSpeech(text, lang) {
    const map = VOICE_STRINGS[lang].categoryKeywords;
    for (const category in map) {
        if (map[category].some(kw => text.includes(kw))) return category;
    }
    return null;
}

function matchUrgencyFromSpeech(text, lang) {
    const map = VOICE_STRINGS[lang].urgencyKeywords;
    for (const level in map) {
        if (map[level].some(kw => text.includes(kw))) return level;
    }
    return null;
}

function matchYesNoFromSpeech(text, lang) {
    const strings = VOICE_STRINGS[lang];
    if (strings.yes.some(w => text.includes(w))) return true;
    if (strings.no.some(w => text.includes(w))) return false;
    return null;
}

// ----- Modal open/close -----
function openVoiceAssist() {
    if (!currentUser) { showToast('Please sign in first', 'error'); return; }
    document.getElementById('voice-modal-overlay').classList.add('active');
    if (!speechSupported()) {
        document.getElementById('voice-lang-picker').classList.add('hidden');
        document.getElementById('voice-flow').classList.add('hidden');
        document.getElementById('voice-unsupported').classList.remove('hidden');
        return;
    }
    document.getElementById('voice-unsupported').classList.add('hidden');
    backToLanguagePicker();
}

function closeVoiceAssist() {
    if (voiceRecognition) { try { voiceRecognition.abort(); } catch(e) {} }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    voiceFlowActive = false;
    document.getElementById('voice-modal-overlay').classList.remove('active');
}

function backToLanguagePicker() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    document.getElementById('voice-lang-picker').classList.remove('hidden');
    document.getElementById('voice-flow').classList.add('hidden');
}

function selectVoiceLanguage(lang) {
    voiceLang = lang;
    document.getElementById('voice-lang-picker').classList.add('hidden');
    document.getElementById('voice-flow').classList.remove('hidden');
    resetVoiceFlowUI();
}

function resetVoiceFlowUI() {
    voiceData = { name:'', ward:'', wardRaw:'', category:'', urgency:'', desc:'', photo:null };
    const photoPreview = document.getElementById('voice-photo-preview');
    if (photoPreview) photoPreview.classList.add('hidden');
    document.getElementById('voice-status').textContent = VOICE_STRINGS[voiceLang].tapToBegin;
    document.getElementById('voice-transcript').textContent = '';
    document.getElementById('voice-summary').classList.add('hidden');
    document.getElementById('voice-mic-btn').classList.remove('hidden');
    document.getElementById('voice-mic-btn-label').textContent = 'Start';
    document.getElementById('voice-restart-btn').classList.add('hidden');
}

function restartVoiceFlow() {
    resetVoiceFlowUI();
}

function voiceMicTap() {
    if (voiceFlowActive) return; // already running
    runVoiceFlow();
}

// Optional — a citizen can attach a photo at any point during the voice flow
// (doesn't interrupt the speech steps). Purely additive to what gets saved.
async function handleVoicePhotoSelect(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
        voiceData.photo = await readFileAsDataURL(file);
        const preview = document.getElementById('voice-photo-preview');
        preview.src = voiceData.photo;
        preview.classList.remove('hidden');
    } catch (e) { /* silently ignore — photo is optional */ }
}

function etaSpeechText(days) {
    const templates = {
        'en-IN': `We expect this to be resolved in about ${days} days.`,
        'hi-IN': `हमें उम्मीद है कि यह लगभग ${days} दिनों में हल हो जाएगा।`,
        'te-IN': `ఇది సుమారు ${days} రోజుల్లో పరిష్కరించబడుతుందని మేము భావిస్తున్నాము.`
    };
    return templates[voiceLang] || templates['en-IN'];
}

// Wraps listenOnce with basic retry-on-failure messaging.
async function listenWithRetry(promptFn, validateFn, maxTries = 3) {
    for (let attempt = 0; attempt < maxTries; attempt++) {
        try {
            const transcript = await listenOnce();
            const lower = voiceLang === 'en-IN' ? transcript.toLowerCase() : transcript;
            if (!lower) {
                await speak(VOICE_STRINGS[voiceLang].needMoreWords);
                continue;
            }
            const result = validateFn(lower, transcript);
            if (result !== null && result !== undefined && result !== false) return result;
            await speak(promptFn());
        } catch (err) {
            if (err.message === 'denied') {
                await speak(VOICE_STRINGS[voiceLang].micDenied);
                throw err;
            }
            // no-speech or other transient errors — just re-prompt
            await speak(VOICE_STRINGS[voiceLang].needMoreWords);
        }
    }
    return null;
}

async function runVoiceFlow() {
    const S = VOICE_STRINGS[voiceLang];
    voiceFlowActive = true;
    document.getElementById('voice-summary').classList.add('hidden');
    document.getElementById('voice-restart-btn').classList.add('hidden');
    document.getElementById('voice-mic-btn').classList.add('hidden');

    try {
        // 1) Name
        document.getElementById('voice-status').textContent = S.askName;
        await speak(S.askName);
        const nameRaw = await listenWithRetry(() => S.askName, t => t.length > 1 ? t : null);
        if (!nameRaw) throw new Error('abandoned');
        voiceData.name = nameRaw.replace(/\b\w/g, c => c.toUpperCase());

        // 2) Ward
        document.getElementById('voice-status').textContent = S.askWard;
        await speak(S.askWard);
        const wardNum = await listenWithRetry(() => S.notUnderstoodWard, t => matchNumberFromSpeech(t, voiceLang));
        if (!wardNum) throw new Error('abandoned');
        voiceData.ward = `Ward ${wardNum}`;

        // 3) Category
        document.getElementById('voice-status').textContent = S.askCategory;
        await speak(S.askCategory);
        const category = await listenWithRetry(() => S.notUnderstoodCategory, t => matchCategoryFromSpeech(t, voiceLang));
        if (!category) throw new Error('abandoned');
        voiceData.category = category;

        // 4) Description
        document.getElementById('voice-status').textContent = S.askDesc;
        await speak(S.askDesc);
        const desc = await listenWithRetry(() => S.askDesc, t => t.length > 5 ? t : null);
        if (!desc) throw new Error('abandoned');
        voiceData.desc = desc;

        // 5) Urgency
        document.getElementById('voice-status').textContent = S.askUrgency;
        await speak(S.askUrgency);
        const urgency = await listenWithRetry(() => S.notUnderstoodUrgency, t => matchUrgencyFromSpeech(t, voiceLang));
        if (!urgency) throw new Error('abandoned');
        voiceData.urgency = urgency;

        // 6) Confirm
        showVoiceSummary();
        const confirmText = `${S.confirmPrefix} ${S.confirmAsk}`;
        document.getElementById('voice-status').textContent = S.confirmAsk;
        await speak(confirmText);
        const confirmed = await listenWithRetry(() => S.notUnderstoodYesNo, t => {
            const yn = matchYesNoFromSpeech(t, voiceLang);
            return yn === true ? true : (yn === false ? 'no' : null);
        });

        if (confirmed === true) {
            const days = estimateResolutionDays(voiceData.urgency);
            saveVoiceSubmission();
            document.getElementById('voice-status').textContent = S.savedSpeech;
            await speak(S.savedSpeech);
            await speak(etaSpeechText(days));
            setTimeout(closeVoiceAssist, 2200);
        } else {
            await speak(S.cancelledSpeech);
            resetVoiceFlowUI();
        }
    } catch (err) {
        if (err.message !== 'abandoned' && err.message !== 'denied') {
            console.error('Voice flow error:', err);
        }
        resetVoiceFlowUI();
    } finally {
        voiceFlowActive = false;
    }
}

function showVoiceSummary() {
    const S = VOICE_STRINGS[voiceLang];
    document.getElementById('vs-name').textContent = voiceData.name;
    document.getElementById('vs-ward').textContent = voiceData.ward;
    document.getElementById('vs-category').textContent = voiceData.category;
    document.getElementById('vs-urgency').textContent = voiceData.urgency;
    document.getElementById('vs-desc').textContent = voiceData.desc;
    const etaRow = document.getElementById('vs-eta');
    if (etaRow) etaRow.textContent = `~${estimateResolutionDays(voiceData.urgency)} days`;
    document.getElementById('voice-summary').classList.remove('hidden');
}

function saveVoiceSubmission() {
    submissions.push({
        id: nextId++,
        name: voiceData.name,
        category: voiceData.category,
        description: voiceData.desc,
        urgency: voiceData.urgency,
        ward: voiceData.ward,
        timestamp: new Date(),
        status: 'pending',
        submittedBy: getCurrentUserKey(),
        etaDays: estimateResolutionDays(voiceData.urgency),
        photo: voiceData.photo || null
    });
    updateStats();
    renderLiveFeed();
    if (currentUser && currentUser.role !== 'mp') renderMySubmissions();
    showToast('Priority submitted via Voice Assist!', 'success');
    if (dashboardVisible) {
        rankedPriorities = analyzePriorities();
        renderRankedCards(rankedPriorities);
        renderCharts(rankedPriorities);
        renderUrgencyBars();
        renderActionPlan(rankedPriorities);
        if (currentUser && currentUser.role === 'mp') renderManageSubmissionsTable();
    }
}

// =========================================================================
// AI ASSISTANT (chatbot) — an advanced rule-based assistant, not a live LLM.
//
// Why rule-based and not a "real" generative AI: a genuinely generative
// chatbot needs a live API call, and calling that safely requires a backend
// holding a secret API key — a static HTML/JS file has nowhere safe to hide
// a key, so anyone viewing the page source could steal and misuse it.
// This assistant instead uses careful intent-matching against a knowledge
// base PLUS live app data (current stats, top-ranked category, etc.), so it
// gives accurate, real answers about this specific app without any backend,
// API key, or ongoing cost — and it never breaks from network issues.
//
// If you later add a backend (Node/Express, Firebase Functions, etc.) that
// holds your Anthropic/OpenAI API key server-side, you can swap
// `getBotReply()` below for a fetch() to your own endpoint and keep
// everything else (UI, voice, history) exactly as-is.
// =========================================================================

let chatHistory = [];
let chatOpened = false;

const CHAT_QUICK_REPLIES_INITIAL = [
    "How do I submit a problem?",
    "What do the categories mean?",
    "Show me current stats",
    "How does the AI ranking work?"
];

// Each intent: keywords to match on, and a reply — either a fixed string or
// a function returning a string computed from live app data.
const CHAT_INTENTS = [
    {
        name: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon'],
        reply: () => `Hello${currentUser ? ', ' + currentUser.name.split(' ')[0] : ''}! I'm here to help you use People's Priorities. You can ask me how to submit a problem, what the categories mean, or how the AI ranking works.`
    },
    {
        name: 'howToSubmit',
        keywords: ['submit', 'how to submit', 'report a problem', 'file a complaint', 'raise an issue', 'add my problem'],
        reply: () => `There are two ways to submit a priority:\n\n1. Scroll to the "Submit Your Priority" form, fill in your name, ward, category, urgency, and a description, then tap Submit.\n2. Or tap the orange "Speak" microphone button in the bottom-right corner — it will ask you questions out loud and you just answer by speaking. No typing needed, and it works in English, Hindi, or Telugu.`
    },
    {
        name: 'voiceAssist',
        keywords: ['voice', 'speak', 'talk', 'mic', 'microphone', 'audio'],
        reply: () => `The orange microphone button (bottom-right) is our Voice Assist. Tap it, choose your language (English, Hindi, or Telugu), then answer the spoken questions about your name, ward, the problem, and how serious it is. It reads everything back to confirm before saving, and speaks a confirmation once it's saved.`
    },
    {
        name: 'categories',
        keywords: ['categories', 'category', 'what kind of problems', 'types of issues', 'what can i report'],
        reply: () => `You can submit issues under 10 categories: ${CATEGORIES.join(', ')}. Just pick whichever matches your problem best — the AI groups all similar submissions together and ranks them by how urgent and common they are.`
    },
    {
        name: 'urgencyLevels',
        keywords: ['urgency', 'urgent', 'critical', 'how serious', 'severity', 'priority level'],
        reply: () => `There are 4 urgency levels: Low (minor, can wait), Medium (needs attention soon), High (serious, affecting daily life), and Critical (dangerous or an emergency). Be honest about the real impact — this directly affects how high your issue is ranked.`
    },
    {
        name: 'howRankingWorks',
        keywords: ['how does the ai', 'how does ai', 'ranking work', 'how are priorities ranked', 'algorithm', 'how does analysis work', 'how does it rank'],
        reply: () => `When you tap "Run AI Analysis," the system groups all submissions by category, then scores each group using three factors: how many people reported it (35% weight), how urgent those reports are on average (40% weight), and how recent they are (25% weight). The categories are then ranked highest-score first, and the top 5 get a full action plan with budget and timeline estimates.`
    },
    {
        name: 'currentStats',
        keywords: ['current stats', 'how many submissions', 'total submissions', 'stats', 'statistics', 'how many people', 'how many complaints'],
        reply: () => {
            const cats = new Set(submissions.map(s => s.category)).size;
            const wards = new Set(submissions.map(s => s.ward)).size;
            const crit = submissions.filter(s => s.urgency === 'critical').length;
            return `Right now there are ${submissions.length} submissions across ${cats} categories and ${wards} wards. ${crit} of them are marked Critical. Tap "Run AI Analysis" to see the full ranked dashboard.`;
        }
    },
    {
        name: 'topPriority',
        keywords: ['top priority', 'biggest problem', 'most important issue', 'what should be fixed first', 'highest ranked'],
        reply: () => {
            if (!rankedPriorities || !rankedPriorities.length) {
                return `No analysis has been run yet. Tap "Run AI Analysis" on the page and I'll be able to tell you the current #1 priority.`;
            }
            const top = rankedPriorities[0];
            return `Right now, the top-ranked priority is "${top.category}" — based on ${top.count} submissions across ${top.affectedWards.length} ward(s). It's the highest combination of frequency, urgency, and recency among all categories.`;
        }
    },
    {
        name: 'actionPlan',
        keywords: ['action plan', 'budget', 'what will be done', 'timeline', 'solution'],
        reply: () => `After running AI Analysis, scroll to "Generated Action Plan" — it turns the top 5 priorities into concrete plans with specific action items, an estimated budget, a timeline, and the responsible government department for each.`
    },
    {
        name: 'wards',
        keywords: ['ward', 'which ward', 'my area', 'my locality'],
        reply: () => `The constituency is divided into ${WARDS.length} wards: ${WARDS.join(', ')}. Pick whichever one your issue is located in when submitting.`
    },
    {
        name: 'login',
        keywords: ['login', 'log in', 'sign in', 'sign up', 'account', 'password', 'google login', 'phone login'],
        reply: () => `You can sign in three ways: with Google, with an email + password, or with your phone number using a one-time code (OTP). Just pick a tab on the sign-in screen. If you're stuck, tap Log out from your profile in the top-right and try a different method.`
    },
    {
        name: 'roles',
        keywords: ['citizen view', 'mp view', 'representative', 'difference between citizen and mp', 'what does mp do', 'what can mp do', 'role', 'am i a citizen', 'am i an mp'],
        reply: () => {
            const roleNote = currentUser ? `You're currently signed in as a ${currentUser.role === 'mp' ? 'MP / Representative' : 'Citizen'}.` : '';
            return `There are two roles in this app. Citizens can submit priorities (by form or voice) and track the status of their own reports under "My Reports." MPs / Representatives can run the AI analysis, view the ranked dashboard and action plan, and update the status of priorities and individual submissions (Pending, In Progress, Resolved) under "Manage Submissions." ${roleNote}`;
        }
    },
    {
        name: 'aboutApp',
        keywords: ['what is this app', 'what does this do', 'about this', 'what is people\'s priorities', 'purpose'],
        reply: () => `People's Priorities lets citizens report local problems in their own words. An AI engine then clusters similar reports together, ranks them by urgency and how many people are affected, and turns the top issues into a clear, actionable development plan — so elected representatives know exactly what to fix first.`
    },
    {
        name: 'aboutTeam',
        keywords: ['who made this', 'who built this', 'team', 'dominators', 'developer', 'creator'],
        reply: () => `This was built by team Dominators for a hackathon.`
    },
    {
        name: 'thanks',
        keywords: ['thank', 'thanks', 'thank you', 'great', 'awesome', 'nice'],
        reply: () => `You're welcome! Let me know if there's anything else about the app I can help with.`
    },
    {
        name: 'help',
        keywords: ['help', 'what can you do', 'options', 'menu'],
        reply: () => `I can help you with:\n• How to submit a priority (by form or by voice)\n• What categories and urgency levels mean\n• How the AI ranking and action plan work\n• Live stats — like current top priority or total submissions\n• Signing in with Google, email, or phone\n\nJust ask in your own words!`
    }
];

function normalizeForMatch(text) {
    return text.toLowerCase().trim();
}

function getBotReply(userText) {
    const text = normalizeForMatch(userText);
    let bestIntent = null;
    let bestScore = 0;
    for (const intent of CHAT_INTENTS) {
        const score = intent.keywords.reduce((s, kw) => s + (text.includes(kw) ? kw.split(' ').length : 0), 0);
        if (score > bestScore) { bestScore = score; bestIntent = intent; }
    }
    if (bestIntent) return bestIntent.reply();
    return `I'm not totally sure about that one. I can help with submitting a priority, what the categories or urgency levels mean, how the AI ranking works, current stats, or signing in. Try asking about one of those, or tap a suggestion below.`;
}

function formatChatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendChatMessage(sender, text) {
    chatHistory.push({ sender, text, time: new Date() });
    const container = document.getElementById('chat-messages');
    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${sender}`;
    msgEl.innerHTML = `${escapeHtml(text).replace(/\n/g, '<br>')}<div class="chat-msg-time">${formatChatTime(new Date())}</div>`;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
}

function showChatTyping() {
    const container = document.getElementById('chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-typing';
    typingEl.id = 'chat-typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
}

function hideChatTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
}

function renderQuickReplies(suggestions) {
    const wrap = document.getElementById('chat-quick-replies');
    wrap.innerHTML = suggestions.map(s => `<div class="chat-quick-reply" onclick="sendChatMessage('${s.replace(/'/g, "\\'")}')">${s}</div>`).join('');
}

function botRespond(userText) {
    showChatTyping();
    const thinkTime = 450 + Math.random() * 500; // small delay so it feels considered, not instant/robotic
    setTimeout(() => {
        hideChatTyping();
        const reply = getBotReply(userText);
        appendChatMessage('bot', reply);
        speakChatReplyIfVoiceWasUsed(reply);
        renderQuickReplies(CHAT_QUICK_REPLIES_INITIAL);
    }, thinkTime);
}

function sendChatMessage(presetText) {
    const input = document.getElementById('chat-input');
    const text = (presetText !== undefined ? presetText : input.value).trim();
    if (!text) return;
    appendChatMessage('user', text);
    input.value = '';
    document.getElementById('chat-quick-replies').innerHTML = '';
    botRespond(text);
}

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
});

function toggleChatPanel() {
    const panel = document.getElementById('chat-panel');
    const isOpening = !panel.classList.contains('active');
    panel.classList.toggle('active');
    if (isOpening) {
        document.getElementById('chat-fab-badge').classList.add('hidden');
        if (!chatOpened) {
            chatOpened = true;
            appendChatMessage('bot', `Hi${currentUser ? ' ' + currentUser.name.split(' ')[0] : ''}! I'm Priya, your assistant for this app. Ask me anything about submitting a priority, categories, urgency, or how the AI ranking works.`);
            renderQuickReplies(CHAT_QUICK_REPLIES_INITIAL);
        }
        document.getElementById('chat-input').focus();
    }
}

// ----- Voice input/output inside the chat (reuses the Voice Assist engine) -----
let chatLastUsedVoice = false;

async function chatMicTap() {
    if (!speechSupported()) {
        appendChatMessage('bot', "Voice input isn't supported in this browser — please try Google Chrome, or just type your question.");
        return;
    }
    const micBtn = document.getElementById('chat-mic-btn');
    micBtn.classList.add('chat-mic-active');
    chatLastUsedVoice = true;
    try {
        const transcript = await listenOnce();
        micBtn.classList.remove('chat-mic-active');
        if (transcript && transcript.trim()) {
            sendChatMessage(transcript.trim());
        }
    } catch (err) {
        micBtn.classList.remove('chat-mic-active');
        if (err.message === 'denied') {
            appendChatMessage('bot', 'Microphone access was blocked, so I can\'t hear you. Please allow microphone access and try again, or just type instead.');
        }
    }
}

function speakChatReplyIfVoiceWasUsed(text) {
    if (chatLastUsedVoice) {
        speak(text, 'en-IN');
        chatLastUsedVoice = false;
    }
}

// ===== INITIALIZATION =====
function init() {
    // Populate form selects
    const wardSelect = document.getElementById('f-ward');
    WARDS.forEach(w => { const opt = document.createElement('option'); opt.value = w; opt.textContent = w; wardSelect.appendChild(opt); });
    const catSelect = document.getElementById('f-category');
    CATEGORIES.forEach(c => { const opt = document.createElement('option'); opt.value = c; opt.textContent = c; catSelect.appendChild(opt); });

    // Form submit
    document.getElementById('priority-form').addEventListener('submit', handleSubmit);

    // Demo data button
    document.getElementById('btn-random').addEventListener('click', () => addRandomSubmissions(5));

    // Nav scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Intersection observer for stat cards
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-card').forEach(el => statsObserver.observe(el));

    // Initial render
    updateStats();
    renderLiveFeed();

    // Auth
    initAuth();
}

// Handle canvas resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('ai-canvas');
    if (document.getElementById('ai-overlay').classList.contains('active')) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

document.addEventListener('DOMContentLoaded', init);
