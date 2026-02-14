// API base
        const API_BASE = '/api';

        // State
        let currentUser = '';
        let authToken = localStorage.getItem('sanchaari_token') || null;

        // --- Navigation Functions ---

        function showSection(id) {
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            const target = document.getElementById(id);
            target.style.display = 'flex';
            setTimeout(() => target.classList.add('active'), 10);
        }

        function goBack(targetId) {
            showSection(targetId);
        }

        // --- Lightweight API helper ---
        async function apiRequest(path, method = 'GET', body) {
            const opts = { method, headers: { 'Content-Type': 'application/json' } };
            if (authToken) opts.headers['Authorization'] = `Bearer ${authToken}`;
            if (body) opts.body = JSON.stringify(body);
            
            console.log(`API: ${method} ${path}`, body ? body : '');
            
            try {
                const res = await fetch(API_BASE + path, opts);
                const text = await res.text();
                let data;
                try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
                
                console.log(`API Response: ${res.status}`, data);
                
                if (!res.ok) throw { status: res.status, body: data };
                return data;
            } catch (err) {
                console.error(`API Error on ${path}:`, err);
                throw err;
            }
        }

        // --- Login / Register Logic ---
        document.getElementById('login-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) return alert('Provide username and password');
            
            try {
                // Try login first
                const res = await apiRequest('/auth/login', 'POST', { username, password });
                if (res && res.data && res.data.token) {
                    authToken = res.data.token;
                    localStorage.setItem('sanchaari_token', authToken);
                    currentUser = username;
                    document.getElementById('display-username').innerText = currentUser;
                    showSection('mode-selection');
                    return;
                }
            } catch (err) {
                console.log('Initial login failed:', err.status);
                // Only auto-register on 401 (user not found)
                if (err.status === 401) {
                    try {
                        console.log('User not found, attempting registration...');
                        const regRes = await apiRequest('/auth/register', 'POST', { username, password });
                        console.log('Registration response:', regRes);
                        
                        if (regRes && regRes.data) {
                            console.log('Registration successful, logging in...');
                            const loginRes = await apiRequest('/auth/login', 'POST', { username, password });
                            if (loginRes && loginRes.data && loginRes.data.token) {
                                authToken = loginRes.data.token;
                                localStorage.setItem('sanchaari_token', authToken);
                                currentUser = username;
                                document.getElementById('display-username').innerText = currentUser;
                                showSection('mode-selection');
                                return;
                            }
                        }
                    } catch (regErr) {
                        console.error('Registration/Login error:', regErr);
                        alert('Auth failed: ' + (regErr.body?.error?.message || 'Unknown error'));
                        return;
                    }
                } else {
                    alert('Login failed: ' + (err.body?.error?.message || err.status));
                    return;
                }
            }
            
            alert('Authentication failed - unexpected error');
        });

        // --- Mode Selection ---
        function selectMode(mode) {
            if (mode === 'planning') showSection('planning-form');
            else if (mode === 'in-trip') showSection('trip-assistance');
            else if (mode === 'my-itineraries') loadSavedItineraries();
        }

        // --- Mock Database for Specific Cities (Expanded with 4K Images) ---
        const destinationsData = {
            "kochi": {
                "Food Spots": ["B for Biriyani", "Pai Dosa", "Kashi Art Cafe", "Grand Pavilion", "Paragon Restaurant", "Dhe Puttu"],
                "Tourist Spots": ["Fort Kochi Beach", "Chinese Fishing Nets", "Mattancherry Palace", "Jewish Synagogue", "Marine Drive", "Hill Palace"],
                "Shopping": ["Lulu Mall", "Jew Town", "Broadway Market", "Centre Square Mall", "Oberon Mall"],
                "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=3840&auto=format&fit=crop"
            },
            "paris": {
                "Food Spots": ["Le Meurice", "L'Ambroisie", "Café de Flore", "Pierre Hermé", "Le Jules Verne"],
                "Tourist Spots": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Sacré-Cœur"],
                "Shopping": ["Champs-Élysées", "Galeries Lafayette", "Le Marais", "Avenue Montaigne"],
                "image": "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=3840&auto=format&fit=crop"
            },
            "tokyo": {
                "Food Spots": ["Sukiyabashi Jiro", "Ichiran Ramen", "Robot Restaurant", "Tsukiji Outer Market"],
                "Tourist Spots": ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing", "Meiji Shrine", "TeamLab Planets"],
                "Shopping": ["Ginza", "Harajuku (Takeshita Street)", "Akihabara", "Shinjuku"],
                "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3840&auto=format&fit=crop"
            },
            "london": {
                "Food Spots": ["Dishoom", "The Ledbury", "Sketch", "Borough Market"],
                "Tourist Spots": ["London Eye", "Tower Bridge", "British Museum", "Buckingham Palace"],
                "Shopping": ["Oxford Street", "Harrods", "Covent Garden", "Camden Market"],
                "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=3840&auto=format&fit=crop"
            },
            "dubai": {
                "Food Spots": ["At.mosphere", "Pierchic", "Ravi Restaurant", "Al Ustad Special Kebab"],
                "Tourist Spots": ["Burj Khalifa", "The Dubai Mall", "Palm Jumeirah", "Desert Safari"],
                "Shopping": ["Dubai Mall", "Mall of the Emirates", "Gold Souk", "Souk Madinat Jumeirah"],
                "image": "https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=3840&auto=format&fit=crop"
            },
            "new york": {
                "Food Spots": ["Katz's Delicatessen", "Le Bernardin", "Joe's Pizza", "Peter Luger Steak House"],
                "Tourist Spots": ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building"],
                "Shopping": ["Fifth Avenue", "SoHo", "Macy's Herald Square", "Chelsea Market"],
                "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=3840&auto=format&fit=crop"
            },
            "rome": {
                "Food Spots": ["La Pergola", "Roscioli", "Da Enzo al 29", "Pizzarium"],
                "Tourist Spots": ["Colosseum", "Trevi Fountain", "Pantheon", "Vatican City"],
                "Shopping": ["Via del Corso", "Via Condotti", "Porta Portese Market"],
                "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=3840&auto=format&fit=crop"
            },
            "bali": {
                "Food Spots": ["Locavore", "Merah Putih", "Naughty Nuri's", "Potato Head Beach Club"],
                "Tourist Spots": ["Uluwatu Temple", "Sacred Monkey Forest", "Tegallalang Rice Terrace", "Seminyak Beach"],
                "Shopping": ["Ubud Art Market", "Seminyak Village", "Love Anchor Canggu"],
                "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=3840&auto=format&fit=crop"
            },
            "sydney": {
                "Food Spots": ["Quay", "The Grounds of Alexandria", "Mr. Wong", "Icebergs Dining Room"],
                "Tourist Spots": ["Sydney Opera House", "Bondi Beach", "Sydney Harbour Bridge", "Taronga Zoo"],
                "Shopping": ["Queen Victoria Building", "Pitt Street Mall", "The Rocks Markets"],
                "image": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=3840&auto=format&fit=crop"
            }
        };

        // --- Planning Logic (Itinerary Generator) ---

        document.getElementById('trip-details-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const destInput = document.getElementById('destination').value.trim();
            const days = parseInt(document.getElementById('days').value);
            const p1 = document.getElementById('priority-1').value;
            const p2 = document.getElementById('priority-2').value;
            const p3 = document.getElementById('priority-3').value;
            const priorities = [p1, p2, p3];
            showSection('itinerary-result');

            // Try server-side creation (will persist). If it fails, fallback to local generation.
            try {
                const res = await apiRequest('/itineraries', 'POST', { destination: destInput, days, priorities });
                const data = res.data || res;
                const items = data.items || [];
                renderItinerary(destInput, items);
            } catch (err) {
                console.warn('Server create failed, falling back to client generation', err);
                generateItinerary(destInput, days, priorities);
            }
        });
        
        // Helper to capitalize words
        function capitalizeWords(str) {
            return str.replace(/\b\w/g, l => l.toUpperCase());
        }

        // Helper to generate dynamic spots if city is unknown
        function getOrGenerateCityData(city) {
            const cityKey = city.toLowerCase().trim();
            if (destinationsData[cityKey]) {
                return destinationsData[cityKey];
            }
            
            // Procedural generation for unknown cities
            const formattedCity = capitalizeWords(city);
            return {
                "Food Spots": [
                    `The ${formattedCity} Bistro`, 
                    `${formattedCity} Spice Kitchen`, 
                    `Royal ${formattedCity} Grill`, 
                    `Taste of ${formattedCity} Central`, 
                    `The Golden Spoon ${formattedCity}`, 
                    `${formattedCity} Street Food Hub`
                ],
                "Tourist Spots": [
                    `${formattedCity} National Museum`, 
                    `Historic Old Town of ${formattedCity}`, 
                    `${formattedCity} City Park`, 
                    `The Grand ${formattedCity} Monument`, 
                    `${formattedCity} Botanical Gardens`, 
                    `Sunset Viewpoint at ${formattedCity}`
                ],
                "Shopping": [
                    `${formattedCity} Central Market`, 
                    `The Grand ${formattedCity} Mall`, 
                    `${formattedCity} Artisan Bazaar`, 
                    `Downtown ${formattedCity} Plaza`, 
                    `${formattedCity} Souvenir Lane`
                ],
                // Fallback High-Quality Travel Image for unknown cities
                "image": `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=3840&auto=format&fit=crop`
            };
        }

        function generateItinerary(destination, days, priorities) {
            const formattedDest = capitalizeWords(destination);
            document.getElementById('result-dest').innerText = formattedDest;
            const container = document.getElementById('itinerary-container');
            container.innerHTML = ""; // Clear previous

            // Get Data (Mock or Dynamic)
            const cityData = getOrGenerateCityData(destination);

            // Update Background Image
            const bgContainer = document.getElementById('main-bg');
            if (cityData.image) {
                bgContainer.style.backgroundImage = `url('${cityData.image}')`;
            }

            const items = [];
            for (let i = 1; i <= days; i++) {
                let morningActivity = priorities[0];
                let afternoonActivity = priorities[1]; 
                let eveningActivity = priorities[2];

                // Variety logic: swap morning/afternoon on even days
                if (i % 2 === 0) {
                    morningActivity = priorities[1];
                    afternoonActivity = priorities[0];
                }

                // Helper to get specific spot name
                const getSpotName = (activityType, indexOffset) => {
                    const list = cityData[activityType];
                    // Safety check
                    if (!list || list.length === 0) return `a popular ${activityType} spot`;
                    
                    const index = (i + indexOffset) % list.length;
                    const spotName = list[index];
                    
                    // Create a Google Search Link for this specific spot
                    // This makes the "Fake" generated spots useful because searching them 
                    // usually brings up the most relevant real result with similar keywords.
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(spotName + " " + destination)}`;
                    
                    return `
                        <span class="group relative inline-block">
                            <span class="text-green-200 font-bold border-b border-dotted border-green-200 cursor-help">'${spotName}'</span>
                            <a href="${searchUrl}" target="_blank" class="ml-1 inline-flex items-center justify-center w-5 h-5 bg-white/20 hover:bg-white/40 rounded-full text-[10px] text-white transition" title="View Real Info">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </span>
                    `;
                };

                const morningSpot = getSpotName(morningActivity, 0);
                const afternoonSpot = getSpotName(afternoonActivity, 1);
                const eveningSpot = getSpotName(eveningActivity, 2);

                // Generate HTML
                const dayHTML = `
                    <div class="bg-white/10 rounded-xl p-4 border border-white/10 transition hover:bg-white/20">
                        <h4 class="text-lg font-bold text-green-300 mb-3 border-b border-white/10 pb-2">Day ${i}</h4>
                        <div class="space-y-4">
                            
                            <!-- Morning -->
                            <div class="flex items-start">
                                <div class="bg-yellow-100/20 p-2 rounded-lg mr-3 text-yellow-300 flex-shrink-0">
                                    <i class="fas fa-sun text-lg"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-sm text-yellow-100">Morning: ${morningActivity}</p>
                                    <p class="text-xs text-gray-300 leading-relaxed">Start your day fresh! We recommend you visit ${morningSpot}. It's a great place to begin your exploration of ${formattedDest}.</p>
                                </div>
                            </div>

                            <!-- Afternoon -->
                            <div class="flex items-start">
                                <div class="bg-orange-100/20 p-2 rounded-lg mr-3 text-orange-300 flex-shrink-0">
                                    <i class="fas fa-cloud-sun text-lg"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-sm text-orange-100">Afternoon: ${afternoonActivity}</p>
                                    <p class="text-xs text-gray-300 leading-relaxed">Take a break and head over to ${afternoonSpot}. Perfect for the afternoon vibe and crowd favorite.</p>
                                </div>
                            </div>

                            <!-- Evening -->
                            <div class="flex items-start">
                                <div class="bg-indigo-100/20 p-2 rounded-lg mr-3 text-indigo-300 flex-shrink-0">
                                    <i class="fas fa-moon text-lg"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-sm text-indigo-100">Evening: ${eveningActivity}</p>
                                    <p class="text-xs text-gray-300 leading-relaxed">End your day at ${eveningSpot}. A great way to wrap up Day ${i} and relax.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                `;
                container.innerHTML += dayHTML;
                items.push({
                    day: i,
                    morning: { type: morningActivity, place: stripHtml(morningSpot) },
                    afternoon: { type: afternoonActivity, place: stripHtml(afternoonSpot) },
                    evening: { type: eveningActivity, place: stripHtml(eveningSpot) }
                });
            }
            container.dataset.generated = JSON.stringify(items);
        }

        // Simple HTML stripper for generated spot snippets
        function stripHtml(html) {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        }

        function renderItinerary(destination, items) {
            const formattedDest = capitalizeWords(destination);
            document.getElementById('result-dest').innerText = formattedDest;
            const container = document.getElementById('itinerary-container');
            container.innerHTML = '';
            items.forEach(i => {
                const dayHTML = `
                    <div class="bg-white/10 rounded-xl p-4 border border-white/10 transition hover:bg-white/20">
                        <h4 class="text-lg font-bold text-green-300 mb-3 border-b border-white/10 pb-2">Day ${i.day}</h4>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="bg-yellow-100/20 p-2 rounded-lg mr-3 text-yellow-300 flex-shrink-0"><i class="fas fa-sun text-lg"></i></div>
                                <div><p class="font-semibold text-sm text-yellow-100">Morning: ${i.morning.type}</p><p class="text-xs text-gray-300 leading-relaxed">Start your day fresh! We recommend you visit ${i.morning.place}.</p></div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-orange-100/20 p-2 rounded-lg mr-3 text-orange-300 flex-shrink-0"><i class="fas fa-cloud-sun text-lg"></i></div>
                                <div><p class="font-semibold text-sm text-orange-100">Afternoon: ${i.afternoon.type}</p><p class="text-xs text-gray-300 leading-relaxed">Take a break and head over to ${i.afternoon.place}.</p></div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-indigo-100/20 p-2 rounded-lg mr-3 text-indigo-300 flex-shrink-0"><i class="fas fa-moon text-lg"></i></div>
                                <div><p class="font-semibold text-sm text-indigo-100">Evening: ${i.evening.type}</p><p class="text-xs text-gray-300 leading-relaxed">End your day at ${i.evening.place}.</p></div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += dayHTML;
            });
        }

        async function loadSavedItineraries() {
            try {
                const res = await apiRequest('/itineraries', 'GET');
                const data = res.data || res;
                const items = data || [];
                const listHtml = items.map(it => `
                    <div class="bg-white/10 p-4 rounded-lg border border-white/10 mb-3">
                        <div class="flex items-center justify-between mb-2"><strong>${it.destination}</strong><small class="text-gray-400">${new Date(it.created_at).toLocaleString()}</small></div>
                        <div class="text-sm text-gray-300">Days: ${it.days}</div>
                        <div class="mt-2"><button class="btn-primary px-3 py-2 rounded" onclick='viewItinerary("${it.id}")'>View</button></div>
                    </div>
                `).join('');
                document.getElementById('itinerary-container').innerHTML = listHtml || '<div class="text-gray-400">No saved itineraries</div>';
                showSection('itinerary-result');
            } catch (err) {
                console.error('Failed to load itineraries', err);
                alert('Failed to load saved itineraries');
            }
        }

        async function viewItinerary(id) {
            try {
                const res = await apiRequest(`/itineraries/${id}`, 'GET');
                const data = res.data || res;
                renderItinerary(data.destination, data.items);
                showSection('itinerary-result');
            } catch (err) {
                console.error('Failed to load itinerary', err);
                alert('Failed to load itinerary');
            }
        }

        // --- In-Trip Logic (Google Maps) ---

        function findNearby(category) {
            const mapArea = document.getElementById('map-area');
            const categorySpan = document.getElementById('map-category-name');
            const iframe = document.getElementById('google-map-embed');
            const linkBtn = document.getElementById('open-maps-btn');
            
            // Show loading state or preparing UI
            mapArea.classList.remove('hidden');
            mapArea.style.opacity = '0';
            setTimeout(() => mapArea.style.opacity = '1', 50);
            
            categorySpan.innerText = category;
            categorySpan.innerHTML = `${category} <span class="text-xs text-gray-400 ml-2">(Locating you...)</span>`;

            // Function to update map with query
            const updateMap = (queryLocation) => {
                const query = `${category} near ${queryLocation}`;
                const encodedQuery = encodeURIComponent(query);
                
                // Update text to remove "Locating..."
                categorySpan.innerText = category;

                // 1. Set Iframe source
                iframe.src = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                
                // 2. Set "Open in App" button link
                linkBtn.href = `https://www.google.com/maps/search/${encodedQuery}`;
            };

            // HTML5 Geolocation API
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        // Use coordinates for precise location
                        updateMap(`${lat},${lng}`);
                    },
                    (error) => {
                        console.warn("Geolocation access denied or failed.", error);
                        // Fallback to generic "near me"
                        updateMap("me");
                    }
                );
            } else {
                // Fallback if browser doesn't support geolocation
                updateMap("me");
            }
        }
