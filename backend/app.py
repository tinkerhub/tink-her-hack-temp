"""
Community Event Finder — Flask Backend
======================================
Routes:
  GET  /                      → serves index.html (static file, optional)
  GET  /events                → list/filter/sort events by distance
  GET  /events/<id>           → single event detail
  POST /add-event             → add a new event (JSON body)
  DELETE /events/<id>         → delete an event

Query params for GET /events:
  lat       float   user latitude  (required for distance sort/filter)
  lng       float   user longitude (required for distance sort/filter)
  radius    float   max km; 0 = no limit  (default 0)
  district  str     optional district filter
  place     str     optional place filter
  category  str     optional category filter (Music/Tech/Sports/Art/Dance)

Response shape per event:
  { id, name, date, time, category, district, place, description,
    lat, lng, paid, price, distance_km }
"""

import sqlite3
import math
import hashlib
from datetime import datetime
import os
from flask import Flask, request, jsonify, g
from flask_cors import CORS

# ── App setup ────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)          # project root with HTML/CSS
DB_PATH    = os.path.join(BASE_DIR, "events.db")

app = Flask(__name__,
            static_folder=PARENT_DIR,
            static_url_path="",
            template_folder=PARENT_DIR)
CORS(app)   # keep CORS in case someone still opens HTML as a local file


# ── Database helpers ─────────────────────────────────────────────────────────
def get_db() -> sqlite3.Connection:
    """Return a per-request SQLite connection stored on Flask's g object."""
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row   # rows behave like dicts
    return g.db


@app.teardown_appcontext
def close_db(exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """
    Create the events table if it doesn't exist and seed sample data
    on the very first run (i.e. when the DB file is brand-new).
    """
    db = sqlite3.connect(DB_PATH)
    cur = db.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            date        TEXT    NOT NULL,
            time        TEXT    NOT NULL,
            category    TEXT    NOT NULL,
            district    TEXT    DEFAULT '',
            place       TEXT    DEFAULT '',
            description TEXT    DEFAULT '',
            lat         REAL    NOT NULL,
            lng         REAL    NOT NULL,
            paid        INTEGER DEFAULT 0,   -- 0 = free, 1 = paid
            price       REAL    DEFAULT 0
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            email    TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL
        )
    """)

    # Seed only when the table is empty (first run)
    if cur.execute("SELECT COUNT(*) FROM events").fetchone()[0] == 0:
        seed_events = [
            ("Rock Concert",           "March 10, 2026",  "7:00 PM",  "Music",  "Ernakulam",       "Kochi",                    "Live rock band performance at City Hall.",           9.9312,  76.2673, 0,   0),
            ("Football Match",         "March 15, 2026",  "3:00 PM",  "Sports", "Thrissur",         "Thrissur City",            "District-level football tournament.",               10.5276, 76.2144, 0,   0),
            ("AI Conference",          "March 20, 2026",  "10:00 AM", "Tech",   "Ernakulam",       "Kochi",                    "Annual AI & ML summit for developers.",              9.9816,  76.2998, 1, 500),
            ("Jazz Night",             "March 22, 2026",  "8:00 PM",  "Music",  "Kozhikode",        "Kozhikode City",           "Intimate jazz session at the Calicut Club.",        11.2588, 75.7804, 1, 200),
            ("Basketball Tournament",  "March 25, 2026",  "2:00 PM",  "Sports", "Thiruvananthapuram","Thiruvananthapuram City", "State-level basketball championship.",               8.5241,  76.9366, 0,   0),
            ("Startup Meetup",         "March 28, 2026",  "5:00 PM",  "Tech",   "Ernakulam",       "Kochi",                    "Networking event for Kerala entrepreneurs.",         10.0159, 76.3419, 0,   0),
            ("Classical Dance Show",   "March 30, 2026",  "6:30 PM",  "Dance",  "Thrissur",         "Guruvayur",                "Bharatanatyam & Mohiniyattam recital.",             10.5941, 76.0387, 1, 150),
            ("Street Art Festival",    "April 5, 2026",   "11:00 AM", "Art",    "Kozhikode",        "Kozhikode City",           "Open-air mural & graffiti fest.",                  11.2453, 75.7913, 0,   0),
            ("Munnar Music Retreat",   "April 10, 2026",  "4:00 PM",  "Music",  "Idukki",           "Munnar",                   "Acoustic music weekend in the hills.",              10.0892, 77.0595, 1, 300),
            ("Backwater Sports Meet",  "April 12, 2026",  "9:00 AM",  "Sports", "Alappuzha",        "Alappuzha City",           "Snake boat race and water sports carnival.",         9.4981,  76.3388, 0,   0),
            ("Photography Workshop",   "April 18, 2026",  "10:00 AM", "Art",    "Palakkad",         "Palakkad City",            "Landscape photography masterclass.",               10.7867, 76.6548, 1,  250),
            ("Tech Hackathon",         "April 22, 2026",  "9:00 AM",  "Tech",   "Kannur",           "Kannur City",              "24-hour student hackathon.",                       11.8745, 75.3704, 0,    0),
            ("Folk Music Evening",     "April 25, 2026",  "6:00 PM",  "Music",  "Wayanad",          "Kalpetta",                 "Traditional Kerala folk instruments showcase.",     11.6085, 76.0820, 0,    0),
            ("Yoga & Wellness Camp",   "April 28, 2026",  "7:00 AM",  "Sports", "Malappuram",       "Malappuram City",          "Sunrise yoga & meditation retreat.",                11.0730, 76.0740, 1,  100),
            ("Kathakali Performance",  "May 2, 2026",     "7:30 PM",  "Dance",  "Thrissur",         "Thrissur City",            "Classical Kathakali at the town auditorium.",       10.5276, 76.2144, 1,  180),
        ]
        cur.executemany("""
            INSERT INTO events
            (name, date, time, category, district, place, description, lat, lng, paid, price)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """, seed_events)

    db.commit()
    db.close()


# ── Haversine ────────────────────────────────────────────────────────────────
def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return great-circle distance in kilometres between two lat/lng points."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi   = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def row_to_dict(row: sqlite3.Row, user_lat=None, user_lng=None) -> dict:
    """Convert a DB row to a response dict, optionally attaching distance_km."""
    d = dict(row)
    d["paid"] = bool(d["paid"])
    if user_lat is not None and user_lng is not None:
        d["distance_km"] = round(haversine(user_lat, user_lng, d["lat"], d["lng"]), 1)
    else:
        d["distance_km"] = None
    return d


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def home():
    """Serve the main index page."""
    return app.send_static_file("index.html")


@app.route("/add-event-page")
def add_event_page():
    """Serve the add-event form page."""
    return app.send_static_file("add-event.html")


@app.route("/login-page")
def login_page():
    """Serve the login/register page."""
    return app.send_static_file("login.html")


@app.route("/login", methods=["POST"])
def login():
    """POST /login — authenticate a user."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "Request body must be JSON"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (email, hashed)
    ).fetchone()

    if user is None:
        return jsonify({"message": "Invalid email or password."}), 401

    return jsonify({"message": f"Welcome back, {user['name']}!", "user_id": user["id"]})


@app.route("/register", methods=["POST"])
def register():
    """POST /register — create a new user account."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "Request body must be JSON"}), 400

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required."}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400

    hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()

    db = get_db()
    # Check if email already exists
    existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        return jsonify({"message": "An account with this email already exists."}), 409

    db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, hashed)
    )
    db.commit()
    return jsonify({"message": "Account created successfully! Please sign in."}), 201


@app.route("/events", methods=["GET"])
def get_events():
    """
    GET /events
    Query params: lat, lng, radius, district, place, category
    """
    # Parse location params
    try:
        user_lat = float(request.args["lat"]) if "lat" in request.args else None
        user_lng = float(request.args["lng"]) if "lng" in request.args else None
        radius   = float(request.args.get("radius", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "lat, lng and radius must be numbers"}), 400

    district_filter = request.args.get("district", "").strip()
    place_filter    = request.args.get("place", "").strip()
    category_filter = request.args.get("category", "").strip()

    # Build SQL query with optional filters
    query  = "SELECT * FROM events WHERE 1=1"
    params = []

    if district_filter:
        query  += " AND district = ?"
        params.append(district_filter)
    if place_filter:
        query  += " AND place = ?"
        params.append(place_filter)
    if category_filter:
        query  += " AND category = ?"
        params.append(category_filter)

    db   = get_db()
    rows = db.execute(query, params).fetchall()

    has_location = user_lat is not None and user_lng is not None
    result = []

    for row in rows:
        if has_location:
            dist = haversine(user_lat, user_lng, row["lat"], row["lng"])
            if radius > 0 and dist > radius:
                continue  # outside requested radius — skip
            entry = row_to_dict(row, user_lat, user_lng)
        else:
            entry = row_to_dict(row)

        result.append(entry)

    # Sort by distance ascending (nearest first) when location provided
    if has_location:
        result.sort(key=lambda e: e["distance_km"])

    return jsonify(result)


@app.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id: int):
    """GET /events/<id> — return a single event."""
    db  = get_db()
    row = db.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
    if row is None:
        return jsonify({"error": f"Event {event_id} not found"}), 404
    return jsonify(row_to_dict(row))


@app.route("/add-event", methods=["POST"])
def add_event():
    """
    POST /add-event
    Expects JSON body with: name, date, time, category, lat, lng
    Optional: district, place, description, paid, price
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "Request body must be JSON"}), 400

    # Validate required fields
    required = ["name", "date", "time", "category", "lat", "lng"]
    missing  = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    # Validate category
    allowed_categories = {"Music", "Tech", "Sports", "Art", "Dance"}
    if data["category"] not in allowed_categories:
        return jsonify({"message": f"Category must be one of: {', '.join(sorted(allowed_categories))}"}), 400

    # Validate coordinates
    try:
        lat = float(data["lat"])
        lng = float(data["lng"])
        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"message": "lat must be −90..90 and lng must be −180..180"}), 400

    paid  = bool(data.get("paid", False))
    price = float(data.get("price", 0)) if paid else 0.0

    # Normalise date & time coming from HTML <input type="date"> / <input type="time">
    # so they match the human-readable format used by seed data.
    raw_date = data["date"].strip()
    raw_time = data["time"].strip()
    try:
        nice_date = datetime.strptime(raw_date, "%Y-%m-%d").strftime("%B %d, %Y")
    except ValueError:
        nice_date = raw_date          # already in readable format — keep as-is
    try:
        nice_time = datetime.strptime(raw_time, "%H:%M").strftime("%I:%M %p").lstrip("0")
    except ValueError:
        nice_time = raw_time

    db  = get_db()
    cur = db.execute("""
        INSERT INTO events (name, date, time, category, district, place, description, lat, lng, paid, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"].strip(),
        nice_date,
        nice_time,
        data["category"].strip(),
        data.get("district", "").strip(),
        data.get("place", "").strip(),
        data.get("description", "").strip(),
        lat, lng,
        int(paid),
        price,
    ))
    db.commit()

    return jsonify({"message": "Event added successfully!", "id": cur.lastrowid}), 201


@app.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id: int):
    """DELETE /events/<id> — remove an event."""
    db  = get_db()
    row = db.execute("SELECT id FROM events WHERE id = ?", (event_id,)).fetchone()
    if row is None:
        return jsonify({"error": f"Event {event_id} not found"}), 404

    db.execute("DELETE FROM events WHERE id = ?", (event_id,))
    db.commit()
    return jsonify({"message": f"Event {event_id} deleted."}), 200


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()   # creates events.db and seeds sample data on first run
    app.run(host="0.0.0.0", port=3000, debug=True)