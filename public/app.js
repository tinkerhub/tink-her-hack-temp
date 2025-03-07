document.addEventListener("DOMContentLoaded", () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log("🔥 Firebase Initialized");

    const app = firebase.app();
    console.log("✅ Firebase App Initialized:", app.name);

    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");
    const googleLoginBtn = document.getElementById("google-login-btn");

    if (signupBtn) signupBtn.addEventListener("click", signUp);
    if (loginBtn) loginBtn.addEventListener("click", login);
    if (googleLoginBtn) googleLoginBtn.addEventListener("click", googleLogin);
});

function signUp() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("❌ Please enter both email and password.");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("✅ User signed up:", user);

            return firebase.firestore().collection("users").doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("🎉 Account created successfully! Redirecting...");
            window.location.href = "welcomeindex.html";  // Redirect after successful sign-up
        })
        .catch(error => {
            console.error("❌ Error signing up:", error);
            alert(`Error: ${error.message}`);
        });
}

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("❌ Please enter both email and password.");
        return;
    }

    console.log("Please log in once more.");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("✅ User logged in:", user);
            alert(`🎉 Welcome back, ${user.email}`);
            window.location.href = "welcomeindex.html";  // Redirect after successful login
        })
        .catch(error => {
            console.error("❌ Error logging in:", error);
            alert(`Error: ${error.message}`);
        });
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log("✅ Google login successful:", user);
            localStorage.setItem("userName", user.displayName || user.email);
            window.location.href = "welcomeindex.html";  // Redirect after successful Google login
        })
        .catch(error => {
            console.error("❌ Google Login Error:", error);
            alert(`Google Sign-In Error: ${error.message}`);
        });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("✅ User detected:", user);
        localStorage.setItem("userName", user.displayName || user.email);
    } else {
        console.log("⚠ No user is currently signed in.");
    }
});
