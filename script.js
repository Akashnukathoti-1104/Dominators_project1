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
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" style="background:${hexToRgba(CATEGORY_COLORS[s.category],0.15)};color:${CATEGORY_COLORS[s.category]}">${s.category}</span>
                <span class="text-[10px] text-muted">${s.ward}</span>
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
    container.innerHTML = top5.map((r, i) => {
        const tmpl = ACTION_TEMPLATES[r.category];
        const color = CATEGORY_COLORS[r.category];
        return `
        <div class="action-card bg-card border border-brd rounded-2xl p-6" style="border-left-color:${color}">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style="background:${hexToRgba(color,0.15)}">
                        <i class="fas ${tmpl.icon} text-lg" style="color:${color}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-heading font-bold text-xs px-2 py-0.5 rounded-full" style="background:${hexToRgba(color,0.15)};color:${color}">Priority #${i+1}</span>
                            <span class="text-xs text-muted">Based on ${r.count} submissions</span>
                        </div>
                        <h4 class="font-heading font-bold text-lg">${tmpl.title}</h4>
                    </div>
                </div>
                <div class="flex items-center gap-4 text-xs shrink-0">
                    <div class="text-center"><div class="text-muted">Budget</div><div class="font-heading font-bold text-fg mt-0.5">${tmpl.budget}</div></div>
                    <div class="text-center"><div class="text-muted">Timeline</div><div class="font-heading font-bold text-fg mt-0.5">${tmpl.timeline}</div></div>
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
        urgency: urgencyEl.value, ward, timestamp: new Date()
    };
    submissions.push(submission);

    // Reset form
    document.getElementById('priority-form').reset();
    document.getElementById('u-crit').checked = true;

    updateStats();
    renderLiveFeed();
    showToast('Priority submitted successfully!', 'success');

    // Auto re-analyze if dashboard visible
    if (dashboardVisible) {
        rankedPriorities = analyzePriorities();
        renderRankedCards(rankedPriorities);
        renderCharts(rankedPriorities);
        renderUrgencyBars();
        renderActionPlan(rankedPriorities);
        showToast('Dashboard updated with new data', 'info');
    }
}

function addRandomSubmissions(count = 5) {
    for (let i = 0; i < count; i++) {
        const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const issues = RANDOM_ISSUES[cat];
        submissions.push({
            id: nextId++,
            name: RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)],
            category: cat,
            description: issues[Math.floor(Math.random() * issues.length)],
            urgency: ['low','medium','high','critical'][Math.floor(Math.random()*4)],
            ward: WARDS[Math.floor(Math.random() * WARDS.length)],
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 5)
        });
    }
    updateStats();
    renderLiveFeed();
    showToast(`Added ${count} demo submissions`, 'info');
}

function handleAnalyze() {
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

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles mr-3"></i>Re-run Analysis';
        btn.classList.remove('pulse-glow');

        setTimeout(() => {
            dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    });
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

let currentUser = null;           // { name, email, method, avatarUrl? }
let mockUsers = [];                // in-memory "database" of email/password accounts: {name, email, password}
let pendingPhone = null;           // phone number currently being verified
let pendingOtp = null;             // the OTP we generated for that phone

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

function setSignedInUser(user) {
    currentUser = user;
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

    showToast(`Signed in as ${user.name}`, 'success');
}

function logout() {
    currentUser = null;
    document.getElementById('user-menu').classList.add('hidden');
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
        avatarUrl: payload.picture
    });
}

function initGoogleSignIn() {
    if (!window.google || !window.google.accounts || GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
        // No real client ID configured — show a disabled-look demo button instead of failing silently
        const wrap = document.getElementById('google-signin-btn');
        wrap.innerHTML = `
            <button type="button" class="auth-btn-primary" style="background:#1A2A2A;color:#6B8A8A;cursor:not-allowed" title="Add your Google Client ID in script.js to enable this">
                <i class="fab fa-google mr-2"></i>Continue with Google
            </button>`;
        return;
    }
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
    });
    google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
        theme: 'filled_black', size: 'large', shape: 'pill', width: 320
    });
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
        mockUsers.push({ name, email, password });
        setSignedInUser({ name, email, method: 'email' });
    } else {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (!user) {
            showEmailError('Incorrect email or password, or no account exists yet.');
            return;
        }
        setSignedInUser({ name: user.name, email: user.email, method: 'email' });
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

    setSignedInUser({ name: `User ${pendingPhone}`, email: null, method: 'phone', phone: pendingPhone });
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
