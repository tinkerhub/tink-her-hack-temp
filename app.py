from flask import Flask, render_template, request, redirect, session, url_for
import json
import os

app = Flask(__name__)
app.secret_key = "hackathon_secret"

DATA_FILE = "entries.json"

def load_entries():
    if not os.path.exists(DATA_FILE) or os.stat(DATA_FILE).st_size == 0:
        return []
    with open(DATA_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_entries(entries):
    with open(DATA_FILE, "w") as f:
        json.dump(entries, f, indent=4)

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        session["user"] = request.form["username"]
        return redirect(url_for("index"))
    return render_template("login.html")

@app.route("/home")
def index():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("index.html")

@app.route("/add", methods=["POST"])
def add_entry():
    if "user" not in session:
        return redirect(url_for("login"))
    
    # Getting text and mood from the form
    text = request.form.get("entry")
    mood = request.form.get("mood") 
    
    entries = load_entries()
    entries.append({
        "user": session["user"], 
        "text": text, 
        "mood": mood
    })
    save_entries(entries)
    return redirect(url_for("show_entries"))

@app.route("/entries")
def show_entries():
    if "user" not in session:
        return redirect(url_for("login"))
    
    all_entries = load_entries()
    # Filtering entries for the logged-in user
    user_entries = [e for e in all_entries if isinstance(e, dict) and e.get("user") == session["user"]]
    
    # Simple Motivation Logic
    motivation = "Keep going! You're doing great."
    if user_entries:
        first_mood = user_entries[-1].get("mood")
        if first_mood == "sad":
            motivation = "I'm sorry you're feeling down. Remember: this too shall pass!"
        elif first_mood == "happy":
            motivation = "Ride that wave of happiness! You're glowing!"

    return render_template("entries.html", entries=user_entries, motivation=motivation)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

