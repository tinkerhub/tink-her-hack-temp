// ===============================
// 1. STORAGE SETUP
// ===============================
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===============================
// 2. PAGE SWITCHING LOGIC (SPA)
// ===============================
window.showPage = function(pageId) {
    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
        page.classList.add("hidden");
    });

    const target = document.getElementById(pageId);
    if(target) {
        target.classList.remove("hidden");
        target.classList.add("active");
    }
}

// Basic Navigation Buttons
document.getElementById("btn-go-to-login").addEventListener("click", () => showPage("page-login"));
document.getElementById("btn-back-to-guest").addEventListener("click", () => showPage("page-landing"));
document.getElementById("btn-post-request").addEventListener("click", () => showPage("page-student-post"));

document.getElementById("btn-offer-help").addEventListener("click", () => {
    displayRequests();
    showPage("page-feed");
});

document.getElementById("btn-view-all").addEventListener("click", () => {
    displayRequests();
    showPage("page-feed");
});

// ===============================
// 3. HAMBURGER MENU
// ===============================
const btnMenu = document.getElementById("btn-menu");
if (btnMenu) {
    btnMenu.addEventListener("click", function() {
        document.getElementById("menu-dropdown").classList.toggle("hidden");
    });
}

// Close menu if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.hamburger-btn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (!openDropdown.classList.contains('hidden')) {
                openDropdown.classList.add('hidden');
            }
        }
    }
}

// ===============================
// 4. AUTH & LOGIN SYSTEM
// ===============================
function validateCollegeID(id) {
    const pattern = /^U\d{6}$/; 
    return pattern.test(id) && id.length === 7;
}

// Student Login
document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Direct check: password must be "1" for the demo
    if (password === "1") {
        currentUser = { email: email, name: "Student", points: 10 };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        updatePointsBadge();
        showPage("page-dashboard");
    } else {
        alert("Hint: The password is 1 😉");
    }
});

// Logout
document.getElementById("btn-logout").addEventListener("click", function () {
    currentUser = null;
    localStorage.removeItem("currentUser");
    showPage("page-landing");
});

// ===============================
// 5. POSTING REQUESTS
// ===============================

// Guest Request
document.getElementById("form-guest-request").addEventListener("submit", function (e) {
    e.preventDefault();

    const collegeID = document.getElementById("guest-id").value;
    if (!validateCollegeID(collegeID)) {
        alert("Invalid College ID format! Please try again.");
        return;
    }

    const newRequest = {
        id: Date.now(),
        title: document.getElementById("guest-title").value,
        description: document.getElementById("guest-desc").value,
        priority: "High", 
        contact: document.getElementById("guest-contact").value,
        postedBy: collegeID,
        status: "Active"
    };

    requests.push(newRequest);
    saveRequests();
    alert("Urgent Request posted successfully! The community has been alerted.");
    this.reset();
});

// Student Request
document.getElementById("form-student-request").addEventListener("submit", function (e) {
    e.preventDefault();

    const newRequest = {
        id: Date.now(),
        title: document.getElementById("student-title").value,
        priority: document.getElementById("student-priority").value,
        contact: document.getElementById("student-contact").value,
        description: document.getElementById("student-desc").value,
        postedBy: currentUser.email,
        status: "Active"
    };

    requests.push(newRequest);
    saveRequests();
    alert("Request posted successfully!");
    this.reset();
    showPage("page-dashboard");
});

// ===============================
// 6. FEED DISPLAY & LOGIC
// ===============================
window.displayRequests = function() {
    const container = document.getElementById("requestContainer");
    if (!container) return;
    
    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 2rem; color: var(--text-muted);'>No active requests right now. The community is safe!</p>";
        return;
    }

    const reversedRequests = [...requests].reverse();

    reversedRequests.forEach(request => {
        const card = document.createElement("div");
        card.classList.add("request-card");
        
        let priorityClass = request.priority ? `priority-${request.priority.toLowerCase()}` : 'priority-medium';
        card.classList.add(priorityClass);

        let statusClass = `status-${request.status.toLowerCase().replace(' ', '')}`;

        let actionButton = "";
        
        if (currentUser) {
            if (request.postedBy === currentUser.email) {
                if (request.status === "In Progress") {
                    actionButton = `<button class="btn-primary w-100" onclick="markResolved(${request.id})">✅ Mark as Completed</button>`;
                } else if (request.status === "Active") {
                    actionButton = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; margin-top: 1rem;">Waiting for helpers...</p>`;
                } else if (request.status === "Resolved") {
                     actionButton = `<p style="color: #10B981; font-size: 0.9rem; font-weight: bold; text-align: center; margin-top: 1rem;">Help Received</p>`;
                }
            } else {
                if (request.status === "Active") {
                    actionButton = `<button class="btn-secondary w-100" onclick="offerHelp(${request.id})" style="margin-top: 1rem;">✋ Offer Help</button>`;
                }
            }
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; font-size: 1.25rem;">${request.title}</h3>
                <span class="status-badge ${statusClass}">${request.status}</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Priority:</strong> ${request.priority || "Medium"}</p>
            <p style="margin-bottom: 0.5rem;">${request.description || "No additional details provided."}</p>
            <p style="font-size: 0.9rem; background: var(--bg-color); padding: 0.5rem; border-radius: 4px;"><strong>Contact:</strong> ${request.contact}</p>
            ${actionButton}
        `;

        container.appendChild(card);
    });
}

// ===============================
// 7. OFFER HELP & RESOLVE FLOW
// ===============================
window.offerHelp = function(id) {
    const request = requests.find(req => req.id === id);
    if (!request) return;

    request.status = "In Progress";
    saveRequests();
    displayRequests();
    
    alert(`Thank you for offering help! Please reach out to them at: ${request.contact}`);
}

window.markResolved = function(id) {
    const request = requests.find(req => req.id === id);
    if (!request || request.status === "Resolved") return;

    request.status = "Resolved";

    if (currentUser) {
        currentUser.points += 25;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updatePointsBadge();
    }

    saveRequests();
    displayRequests();
    alert("Awesome! Glad you got the help you needed.");
}

function updatePointsBadge() {
    const navPoints = document.getElementById("nav-points");
    if (navPoints && currentUser) {
        navPoints.textContent = currentUser.points;
    }
}

// ===============================
// 8. INITIALIZE APP ON LOAD
// ===============================
window.onload = function () {
    if (currentUser) {
        updatePointsBadge();
        showPage("page-dashboard");
    } else {
        showPage("page-landing");
    }
};
// ===============================
// 9. NEW FEATURES LOGIC (Profile, Settings, Graph)
// ===============================

// Helper to close the dropdown when a link is clicked
window.closeMenu = function() {
    document.getElementById("menu-dropdown").classList.add("hidden");
}

// -- PROFILE LOGIC --
document.getElementById("form-profile").addEventListener("submit", function(e) {
    e.preventDefault();
    if(currentUser) {
        currentUser.name = document.getElementById("profile-name").value;
        currentUser.collegeId = document.getElementById("profile-id").value;
        currentUser.sem = document.getElementById("profile-sem").value;
        currentUser.branch = document.getElementById("profile-branch").value;
        
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Profile saved successfully!");
    }
});

// Load profile data when showing the dashboard
function loadProfileData() {
    if(currentUser) {
        document.getElementById("profile-name").value = currentUser.name || "";
        document.getElementById("profile-id").value = currentUser.collegeId || "";
        if(currentUser.sem) document.getElementById("profile-sem").value = currentUser.sem;
        if(currentUser.branch) document.getElementById("profile-branch").value = currentUser.branch;
    }
}

// -- DARK MODE LOGIC --
const darkModeToggle = document.getElementById("toggle-dark-mode");

// Check saved preference on load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", function() {
    if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
    }
});

// -- CHART.JS ACTIVITY GRAPH LOGIC --
let activityChartInstance = null;

window.updateChart = function(viewType) {
    // UI Tab switching logic
    document.getElementById("btn-chart-weekly").classList.remove("active");
    document.getElementById("btn-chart-monthly").classList.remove("active");
    document.getElementById(`btn-chart-${viewType}`).classList.add("active");

    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Destroy previous chart if it exists so it doesn't overlap
    if (activityChartInstance) {
        activityChartInstance.destroy();
    }

    // Dummy data to make the graph look active for the hackathon presentation
    let labels = [];
    let dataPoints = [];

    if (viewType === 'weekly') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = [5, 20, 0, 10, 25, 5, currentUser ? currentUser.points : 0]; // Simulates recent activity
    } else {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        dataPoints = [40, 65, 30, currentUser ? currentUser.points : 0];
    }

    // Create the graph
    activityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Points Earned',
                data: dataPoints,
                borderColor: '#4F46E5', // Primary indigo color
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderWidth: 3,
                tension: 0.3, // Adds a nice curve to the line
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }, // Hides the legend for a cleaner look
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Update the total points text
    if(currentUser) {
        document.getElementById("total-points-display").textContent = currentUser.points;
    }
};

// -- UPDATED POINTS LOGIC FOR OFFERING / RESOLVING --
// *Replace your existing offerHelp and markResolved functions with these:*

window.offerHelp = function(id) {
    const request = requests.find(req => req.id === id);
    if (!request) return;

    request.status = "In Progress";
    
    // Feature: Reward points for offering help
    if (currentUser) {
        currentUser.points += 5; 
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updatePointsBadge();
    }

    saveRequests();
    displayRequests();
    
    alert(`Thank you! You earned 5 points for offering help. Please reach out to them at: ${request.contact}`);
}

window.markResolved = function(id) {
    const request = requests.find(req => req.id === id);
    if (!request || request.status === "Resolved") return;

    request.status = "Resolved";

    // Feature: Reward major points for completing the job
    if (currentUser) {
        currentUser.points += 20;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updatePointsBadge();
    }

    saveRequests();
    displayRequests();
    alert("Awesome! The job is complete and you earned 20 points.");
}

// Hook into the page load to pre-fill profile data and setup the chart
const originalOnload = window.onload;
window.onload = function() {
    if (originalOnload) originalOnload(); // Run the login check
    loadProfileData();
    updateChart('weekly'); // Initialize the chart in the background
};
// ===============================
// 11. HELP OFFERED & MY REQUESTS LOGIC
// ===============================

// Render the user's "Help Offered" tasks
window.displayHelpOffered = function() {
    const container = document.getElementById("helpOfferedContainer");
    if (!container) return;
    container.innerHTML = "";

    // Find requests where the current user is the helper
    const myHelpReqs = requests.filter(r => currentUser && r.helperEmail === currentUser.email).reverse();

    if (myHelpReqs.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: 8px;'>You haven't offered help on any requests yet.</p>";
        return;
    }

    myHelpReqs.forEach(request => {
        const card = document.createElement("div");
        card.className = `request-card priority-${request.priority ? request.priority.toLowerCase() : 'medium'}`;
        
        let statusMsg = "";
        if (request.status === "Resolved") {
            statusMsg = `<p style="color: #10B981; font-weight: bold; margin-top: 1rem; text-align: center;">✅ Verified by Requester (20 Pts Awarded)</p>`;
        } else {
            statusMsg = `<p style="color: #F59E0B; font-weight: bold; margin-top: 1rem; text-align: center;">⏳ Waiting for Requester to Verify</p>`;
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; font-size: 1.25rem;">${request.title}</h3>
                <span class="status-badge status-${request.status.toLowerCase().replace(' ', '')}">${request.status}</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Requester Contact:</strong> <span style="background: var(--bg-color); padding: 2px 6px; border-radius: 4px;">${request.contact}</span></p>
            <p>${request.description || "No description."}</p>
            ${statusMsg}
        `;
        container.appendChild(card);
    });
}

// Render the user's "My Requests" tasks (with the Verification Button)
window.displayMyRequests = function() {
    const container = document.getElementById("myRequestsContainer");
    if (!container) return;
    container.innerHTML = "";

    const myReqs = requests.filter(r => currentUser && r.postedBy === currentUser.email).reverse();

    if (myReqs.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: 8px;'>You haven't posted any requests yet.</p>";
        return;
    }

    myReqs.forEach(request => {
        const card = document.createElement("div");
        card.className = `request-card priority-${request.priority ? request.priority.toLowerCase() : 'medium'}`;
        
        let actionButton = "";
        
        if (request.status === "In Progress") {
            actionButton = `
                <div style="background: #F3F4F6; padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid var(--border-color);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.9rem;"><strong>Helper:</strong> ${request.helperEmail} is assisting you.</p>
                    <button class="btn-primary w-100" style="background-color: #10B981;" onclick="verifyCompletion(${request.id})">
                        ✅ Verify & Award 20 Pts
                    </button>
                </div>
            `;
        } else if (request.status === "Active") {
            actionButton = `<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem; text-align: center;">Waiting for a helper...</p>`;
        } else {
            actionButton = `<p style="color: #10B981; font-weight: bold; margin-top: 1rem; text-align: center;">✔ Task Verified</p>`;
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; font-size: 1.25rem;">${request.title}</h3>
                <span class="status-badge status-${request.status.toLowerCase().replace(' ', '')}">${request.status}</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Priority:</strong> ${request.priority || "Medium"}</p>
            <p>${request.description || "No description."}</p>
            ${actionButton}
        `;
        container.appendChild(card);
    });
}

// The Verification Logic
window.verifyCompletion = function(id) {
    const request = requests.find(req => req.id === id);
    if (!request || request.status === "Resolved") return;

    request.status = "Resolved";
    saveRequests();

    // Give points to the person who helped (Bonus: dynamically updates local user object if testing on same machine)
    if (currentUser && currentUser.email === request.helperEmail) {
        currentUser.points += 20;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updatePointsBadge();
    }

    displayMyRequests(); 
    displayRequests(); 
    
    alert(`Task verified! 20 points have been successfully awarded to ${request.helperEmail}.`);
}

// ===============================
// 12. LEADERBOARD TAB LOGIC
// ===============================
const tabButtons = document.querySelectorAll('.leaderboard-section .tab-btn');
const rankLists = document.querySelectorAll('.leaderboard-section .rank-list');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. Remove 'active' styling from all buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        // 2. Add 'active' styling to the clicked button
        btn.classList.add('active');

        // 3. Hide all the ranking lists
        rankLists.forEach(list => {
            list.classList.add('hidden');
            list.classList.remove('active-list');
        });

        // 4. Find the target list (weekly or monthly) and show it
        const targetId = 'list-' + btn.getAttribute('data-target');
        const targetList = document.getElementById(targetId);
        
        if(targetList) {
            targetList.classList.remove('hidden');
            targetList.classList.add('active-list');
        }
    });
});
